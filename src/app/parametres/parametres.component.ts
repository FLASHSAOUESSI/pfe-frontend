import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { Subscription } from 'rxjs';

// Interface pour les thèmes
interface Theme {
  name: string;
  label: string;
  navbarColor: string;
  bannerColor: string;
  titleColor: string;
  buttonColor: string;
}

// Interface pour les options d'affichage
interface DisplayOptions {
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
}

// Interface pour les notifications
interface Notification {
  show: boolean;
  type: 'success' | 'error';
  message: string;
}

// Interface pour les boîtes de dialogue de confirmation
interface ConfirmDialog {
  show: boolean;
  title: string;
  message: string;
  callback: Function | null;
}

@Component({
  selector: 'app-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './parametres.component.html',
  styleUrl: './parametres.component.css'
})
export class ParametresComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly themeService = inject(ThemeService);
  
  // Thèmes prédéfinis
  themes: Theme[] = [];

  // Thème sélectionné
  selectedTheme: string = 'default';
  currentTheme!: Theme;

  // Couleurs personnalisées
  customColors: {
    navbarColor: string;
    bannerColor: string;
    titleColor: string;
    buttonColor: string;
  } = {
    navbarColor: '#003366',
    bannerColor: '#e9ecef',
    titleColor: '#003366',
    buttonColor: '#003366'
  };

  // Options d'affichage
  displayOptions: DisplayOptions = {
    fontSize: 'medium',
    highContrast: false
  };

  // Notification
  notification: Notification = {
    show: false,
    type: 'success',
    message: ''
  };

  // Dialogue de confirmation
  confirmDialog: ConfirmDialog = {
    show: false,
    title: '',
    message: '',
    callback: null
  };

  // Thèmes prédéfinis
  private defaultThemes: Theme[] = [
    {
      name: 'default',
      label: 'Défaut',
      navbarColor: '#003366',
      bannerColor: '#e9ecef',
      titleColor: '#003366',
      buttonColor: '#003366'
    },
    {
      name: 'dark',
      label: 'Sombre',
      navbarColor: '#222222',
      bannerColor: '#333333',
      titleColor: '#ffffff',
      buttonColor: '#444444'
    },
    {
      name: 'light',
      label: 'Claire',
      navbarColor: '#3498db',
      bannerColor: '#f8f9fa',
      titleColor: '#2c3e50',
      buttonColor: '#3498db'
    },
    {
      name: 'green',
      label: 'Nature',
      navbarColor: '#2ecc71',
      bannerColor: '#e8f5e9',
      titleColor: '#1b5e20',
      buttonColor: '#2ecc71'
    }
  ];

  // Subscriptions pour la gestion des observables
  private themeSubscription!: Subscription;
  private displayOptionsSubscription!: Subscription;

  ngOnInit(): void {
    // Utiliser les thèmes prédéfinis locaux au lieu d'appeler le service
    this.themes = this.defaultThemes;
    
    // Charger les paramètres depuis le localStorage
    this.loadSettings();
    
    // Appliquer le thème et les options d'affichage
    this.applyTheme();
    this.applyDisplayOptions();
  }

  ngOnDestroy(): void {
    // Nettoyer si nécessaire
  }

  // Sélectionner un thème
  selectTheme(theme: Theme): void {
    this.selectedTheme = theme.name;
    this.currentTheme = theme;
    
    // Mettre à jour les couleurs personnalisées
    this.customColors = {
      navbarColor: theme.navbarColor,
      bannerColor: theme.bannerColor,
      titleColor: theme.titleColor,
      buttonColor: theme.buttonColor
    };
    
    // Appliquer et sauvegarder
    this.applyTheme();
    this.saveSettings();
  }

  // Appliquer les couleurs personnalisées
  applyCustomColors(): void {
    this.selectedTheme = 'custom';
    this.currentTheme = {
      name: 'custom',
      label: 'Personnalisé',
      ...this.customColors
    };
    
    this.applyTheme();
    //this.saveSettings();
  }

  // Appliquer les options d'affichage
  applyDisplayOptions(): void {
    // Appliquer la taille de police
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    document.body.classList.add(`font-${this.displayOptions.fontSize}`);
    
    // Appliquer le mode contraste élevé
    if (this.displayOptions.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    
    this.saveSettings();
  }

  // Afficher une notification
  showNotification(type: 'success' | 'error', message: string): void {
    this.notification = {
      show: true,
      type,
      message
    };
    
    // Masquer automatiquement après 3 secondes
    setTimeout(() => {
      this.hideNotification();
    }, 3000);
  }
  
  // Masquer la notification
  hideNotification(): void {
    this.notification.show = false;
  }
  
  // Afficher le dialogue de confirmation
  showConfirmDialog(title: string, message: string, callback: Function): void {
    this.confirmDialog = {
      show: true,
      title,
      message,
      callback
    };
  }
  
  // Annuler la confirmation
  onConfirmCancel(): void {
    this.confirmDialog.show = false;
  }
  
  // Confirmer l'action
  onConfirmConfirm(): void {
    const callback = this.confirmDialog.callback;
    this.confirmDialog.show = false;
    
    if (callback) {
      callback();
    }
  }

  // Appliquer le thème actuel
  private applyTheme(): void {
    if (!this.currentTheme) return;
    
    // Appliquer les couleurs au niveau du document
    document.documentElement.style.setProperty('--navbar-color', this.currentTheme.navbarColor);
    document.documentElement.style.setProperty('--banner-color', this.currentTheme.bannerColor);
    document.documentElement.style.setProperty('--title-color', this.currentTheme.titleColor);
    document.documentElement.style.setProperty('--button-color', this.currentTheme.buttonColor);
  }

  // Sauvegarder les paramètres
  saveSettings(): void {
    try {
      const settings = {
        theme: this.selectedTheme,
        customColors: this.customColors,
        displayOptions: this.displayOptions
      };
      
      localStorage.setItem('userSettings', JSON.stringify(settings));
      //this.showNotification('success', 'Vos paramètres ont été enregistrés avec succès.');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres :', error);
      this.showNotification('error', 'Une erreur est survenue lors de la sauvegarde des paramètres.');
    }
  }

  // Réinitialiser les paramètres
  resetSettings(): void {
    // Utiliser le dialogue de confirmation au lieu de confirm()
    this.showConfirmDialog(
      'Réinitialiser les paramètres',
      'Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?',
      () => {
        // Cette fonction sera exécutée si l'utilisateur confirme
        
        // Réinitialiser au thème par défaut
        this.selectTheme(this.defaultThemes[0]);
        
        // Réinitialiser les options d'affichage
        this.displayOptions = {
          fontSize: 'medium',
          highContrast: false
        };
        
        // Appliquer les changements
        this.applyDisplayOptions();
        
        // Supprimer du localStorage
        localStorage.removeItem('userSettings');
        
        this.showNotification('success', 'Tous les paramètres ont été réinitialisés.');
      }
    );
  }

  // Charger les paramètres depuis le localStorage
  private loadSettings(): void {
    try {
      const savedSettings = localStorage.getItem('userSettings');
      
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        // Charger le thème
        if (settings.theme) {
          this.selectedTheme = settings.theme;
          
          if (settings.theme === 'custom' && settings.customColors) {
            this.customColors = settings.customColors;
            this.currentTheme = {
              name: 'custom',
              label: 'Personnalisé',
              ...this.customColors
            };
          } else {
            // Trouver le thème par son nom
            const foundTheme = this.themes.find(t => t.name === settings.theme);
            if (foundTheme) {
              this.currentTheme = foundTheme;
            } else {
              // Thème par défaut si non trouvé
              this.currentTheme = this.themes[0];
            }
          }
        } else {
          this.currentTheme = this.themes[0];
        }
        
        // Charger les options d'affichage
        if (settings.displayOptions) {
          this.displayOptions = settings.displayOptions;
        }
      } else {
        // Initialiser avec le thème par défaut
        this.currentTheme = this.themes[0];
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres :', error);
      this.currentTheme = this.themes[0];
      this.showNotification('error', 'Erreur lors du chargement des paramètres.');
    }
  }

  // Déconnexion
  logout(): void {
    // Supprimer le token d'authentification
    localStorage.removeItem('accessToken');
    // Rediriger vers la page de connexion
    this.router.navigate(['/login']);
  }
}
