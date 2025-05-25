import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InvestigateurService } from './investigator.service'; // Adjust path if necessary
import { EnqueteService } from './enquete.service';

// Define interfaces based on expected API response
interface Entreprise {
  id: number;
  name: string;
  address: string;
  email: string;
  fax: string;
}

export interface Investigator {
  id: number;
  name: string;
  phone: string;
  email: string;
  entreprise?: Entreprise;
  username: string;
  authorities: any[];
  enabled: boolean;
  accountNonLocked: boolean;
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
}

@Component({
  selector: 'app-enquete',
  templateUrl: './enquete.component.html',
  styleUrls: ['./enquete.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule]
})
export class EnqueteComponent implements OnInit {
  enqueteForm!: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private investigatorService: InvestigateurService,
    private enqueteService: EnqueteService
  ) { }

  ngOnInit(): void {
    // Initialize the form first
    this.enqueteForm = this.formBuilder.group({
      nomSociale: [''],
      adresse: [''],
      telephone: [''],
      fax: [''],
      nomRepondant: [''],
      mailRepondant: ['', [Validators.email]],
      brancheActivite: [''],
      exportatrice: [''],
      situation1erTrimestre: [''],
      situationFuture: [''],
      effectifs1erTrimestre: [''],
      effectifsFutur: [''],
      identifiantStat : [''],
      diffAutre: [''],
      variaisonSaisoniere: [''],
      situation2emeTrimestre: [''],
      effectifs2emeTrimestre: [''],
      prixMatieres1erTrimestre: [''],
      prixMatieres2emeTrimestre: [''],
      prixMatieresFutur: [''],
      pleineCapacite: [''],
      tauxUtilisationCapacite: [''],
      avoirDifficultes : [''],
      diffApprovisionnement: [''],
      diffPieces: [],
      diffTresorerie: []
    });

    // Then load data and patch the form
    this.loadAndPrefillData();
  }

  loadAndPrefillData(): void {
    this.investigatorService.findCurrentInvestiagor().subscribe({
      next: (investigatorData: Investigator) => {
        console.log('Received investigator data:', investigatorData);

        if (investigatorData) {
          const valuesToPatch  :any= {};

          if (investigatorData.name) {
            valuesToPatch.nomRepondant = investigatorData.name;
          }
          if (investigatorData.email) {
            valuesToPatch.mailRepondant = investigatorData.email;
          }
          if (investigatorData.phone) {
            valuesToPatch.telephone = investigatorData.phone;
          }
         

          if (investigatorData.entreprise) {
            if (investigatorData.entreprise.name) {
              valuesToPatch.nomSociale = investigatorData.entreprise.name;
            }
            if (investigatorData.entreprise.address) {
              valuesToPatch.adresse = investigatorData.entreprise.address;
            }

          } else {
             console.warn('Investigator data does not contain entreprise details.');
          }

          if (Object.keys(valuesToPatch).length > 0) {
            console.log('Patching form with values:', valuesToPatch);
            this.enqueteForm.patchValue(valuesToPatch);
          } else {
             console.log('No relevant data found to patch the form.');
          }

        } else {
           console.warn("Received null or undefined investigator data.");
        }
      },
      error: (error) => {
        console.error('Error fetching investigator data:', error);
        // Optionally show an error message to the user
      }
    });
  }

  get f() {
    return this.enqueteForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    console.log(this.enqueteForm.value)

    if (this.enqueteForm.invalid) {
      const firstError = document.querySelector('form .ng-invalid'); // More specific selector
      if (firstError) {
        // Attempt to focus or scroll
        if (typeof (firstError as HTMLElement).focus === 'function') {
          (firstError as HTMLElement).focus();
        }
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      console.warn('Form is invalid:', this.enqueteForm.errors);
      return;
    }

    console.log('Données de l\'enquête:', this.enqueteForm.value);

    this.enqueteService.create(this.enqueteForm.value).subscribe()
    this.router.navigate(['/accueil']); // Navigate after successful save
  }

  onCancel() {
    if (confirm('Êtes-vous sûr de vouloir annuler ? Toutes les données saisies seront perdues.')) {
      this.router.navigate(['/accueil']);
    }
  }
}