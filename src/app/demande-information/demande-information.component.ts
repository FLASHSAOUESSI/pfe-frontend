import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface AIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

@Component({
  selector: 'app-demande-information',
  templateUrl: './demande-information.component.html',
  styleUrls: ['./demande-information.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule]
})
export class DemandeInformationComponent {
  // Liste des cartes d'information
  infoCards = [
    {
      id: 1,
      title: 'Statistiques démographiques',
      icon: 'fa-users',
      color: '#3498db',
      url: '/statistiques/demographie',
      context: 'démographie, population, natalité, mortalité, migration, recensement'
    },
    {
      id: 2,
      title: 'Économie et finances',
      icon: 'fa-chart-line',
      color: '#2ecc71',
      url: '/statistiques/economie',
      context: 'PIB, inflation, croissance économique, finances publiques, budget'
    },
    {
      id: 3,
      title: 'Emploi et chômage',
      icon: 'fa-briefcase',
      color: '#e74c3c',
      url: '/statistiques/emploi',
      context: 'taux de chômage, emploi, marché du travail, secteurs d\'activité'
    },
    {
      id: 4,
      title: 'Commerce extérieur',
      icon: 'fa-ship',
      color: '#f39c12',
      url: '/statistiques/commerce',
      context: 'exportations, importations, balance commerciale, partenaires commerciaux'
    },
    {
      id: 5,
      title: 'Éducation et culture',
      icon: 'fa-graduation-cap',
      color: '#9b59b6',
      url: '/statistiques/education',
      context: 'taux de scolarisation, analphabétisme, enseignement, universités'
    },
    {
      id: 6,
      title: 'Santé publique',
      icon: 'fa-heartbeat',
      color: '#1abc9c',
      url: '/statistiques/sante',
      context: 'espérance de vie, mortalité infantile, maladies, système de santé'
    }
  ];

  // Sélection actuelle
  selectedCardId: number | null = null;

  // Formulaire simplifié
  contactForm: FormGroup;
  formSubmitted = false;
  
  // IA Response
  aiResponse: string = '';
  isLoadingAI = false;
  showAIResponse = false;
  
  // Configuration IA (Groq API - gratuite)
  private readonly GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
  private readonly GROQ_API_KEY = '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'; // À remplacer par votre clé API

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    // Initialisation du formulaire
    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      question: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  // Sélectionner une carte
  selectCard(id: number): void {
    this.selectedCardId = id;
    this.showAIResponse = false; // Reset AI response when changing domain
    this.aiResponse = '';
  }

  // Soumettre la demande avec IA
  async submitQuestion(): Promise<void> {
    if (this.contactForm.invalid) {
      return;
    }

    const formData = this.contactForm.value;
    
    // Si un domaine est sélectionné, utiliser l'IA
    if (this.selectedCardId) {
      await this.getAIResponse(formData.question);
    } else {
      // Comportement original si aucun domaine sélectionné
      console.log('Question soumise:', formData);
      this.formSubmitted = true;
      
      setTimeout(() => {
        this.formSubmitted = false;
        this.contactForm.reset();
        this.selectedCardId = null;
      }, 3000);
    }
  }

  // Obtenir la réponse de l'IA
  private async getAIResponse(question: string): Promise<void> {
    this.isLoadingAI = true;
    this.showAIResponse = true;

    const selectedCard = this.infoCards.find(card => card.id === this.selectedCardId);
    
    const prompt = this.buildPrompt(question, selectedCard);

    try {
      const response = await this.callGroqAPI(prompt);
      this.aiResponse = response;
      this.formSubmitted = true;
    } catch (error) {
      console.error('Erreur IA:', error);
      this.aiResponse = "Désolé, je ne peux pas répondre à votre question pour le moment. Veuillez réessayer plus tard ou contacter directement l'INS au +216 71 891 002.";
    } finally {
      this.isLoadingAI = false;
    }
  }

  // Construire le prompt pour l'IA
  private buildPrompt(question: string, selectedCard: any): string {
    return `Tu es un assistant virtuel de l'Institut National de Statistique de Tunisie (INS). 
Tu dois répondre de manière professionnelle et précise aux questions concernant les statistiques tunisiennes.

Contexte du domaine sélectionné: ${selectedCard?.title} - ${selectedCard?.context}

Question de l'utilisateur: ${question}

Instructions:
- Réponds en français
- Sois précis et factuel
- Si tu n'as pas de données exactes, indique-le clairement
- Référence l'INS Tunisie quand approprié
- Propose des sources officielles si possible
- Reste dans le contexte du domaine: ${selectedCard?.title}
- Limite ta réponse à 200 mots maximum

Réponse:`;
  }

  // Appeler l'API Groq
  private async callGroqAPI(prompt: string): Promise<string> {
    const headers = {
      'Authorization': `Bearer ${this.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    };

    const body = {
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama3-8b-8192', // Modèle gratuit de Groq
      temperature: 0.3,
      max_tokens: 300
    };

    try {
      const response = await this.http.post<AIResponse>(this.GROQ_API_URL, body, { headers }).toPromise();
      return response?.choices[0]?.message?.content || 'Aucune réponse disponible.';
    } catch (error) {
      // Fallback vers une API alternative gratuite si Groq échoue
      return await this.callHuggingFaceAPI(prompt);
    }
  }

  private async callHuggingFaceAPI(prompt: string): Promise<string> {
  const HF_API_URL = 'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta';

  try {
    const response = await this.http.post(HF_API_URL, {
      inputs: prompt
    }, {
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json'
      }
    }).toPromise() as any;

    console.log('Réponse Zephyr :', response);

    const fullText = response[0]?.generated_text ?? '';

    // Extraire la partie après "Réponse:"
    const reponseIndex = fullText.indexOf('Réponse:');
    if (reponseIndex !== -1) {
      // On récupère uniquement le texte après "Réponse:"
      return fullText.substring(reponseIndex + 'Réponse:'.length).trim();
    }

    return 'Réponse non disponible pour le moment.';
  } catch (error) {
    console.error('Hugging Face API échouée:', error);
    return this.getStaticResponse();
  }
}

  // Réponse statique en cas d'échec des APIs
  private getStaticResponse(): string {
    const selectedCard = this.infoCards.find(card => card.id === this.selectedCardId);
    
    return `Merci pour votre question concernant ${selectedCard?.title?.toLowerCase()}. 
    
L'Institut National de Statistique de Tunisie (INS) collecte et publie régulièrement des données sur ce domaine. 

Pour obtenir des informations détaillées et actualisées, je vous recommande de:
- Consulter le site officiel de l'INS
- Contacter directement nos services au +216 71 891 002
- Envoyer un email à contact@ins.tn

Notre équipe d'experts pourra vous fournir les données statistiques précises dont vous avez besoin.`;
  }

  // Fermer la réponse IA
  closeAIResponse(): void {
    this.showAIResponse = false;
    this.aiResponse = '';
    this.formSubmitted = false;
    this.contactForm.reset();
    this.selectedCardId = null;
  }

  // Poser une nouvelle question
  askNewQuestion(): void {
    this.showAIResponse = false;
    this.aiResponse = '';
    this.formSubmitted = false;
    // Garder le domaine sélectionné pour faciliter les questions multiples
  }

  // Obtenir le titre du domaine sélectionné
  getSelectedCardTitle(): string {
    const selectedCard = this.infoCards.find(card => card.id === this.selectedCardId);
    return selectedCard ? selectedCard.title : '';
  }
}