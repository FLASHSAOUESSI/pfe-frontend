import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';
import { EnqueteService } from './enquete.service';
import { InvestigateurService } from './investigator.service'; // Adjust path if necessary

// Define interfaces based on actual API response
interface Enterprise {
  id: number;
  name: string;
  address: string;
  email: string;
  fax: string;
  status: string;
  governorateId: number;
  governorateName: string;
  responsablesCount: number;
}

export interface Investigator {
  id: number;
  nom: string;
  phone: string;
  email: string;
  role: string;
  enabled: boolean;
  enterprise?: Enterprise;
}

@Component({
  selector: 'app-enquete',
  templateUrl: './enquete.component.html',
  styleUrls: ['./enquete.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
})
export class EnqueteComponent implements OnInit {
  enqueteForm!: FormGroup;
  submitted = false;
  typeEnqueteId: number;
  dataPrefilledFromProfile = false;
  prefilledFields: Set<string> = new Set();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private investigatorService: InvestigateurService,
    private enqueteService: EnqueteService,
    private toast: HotToastService,
    private route: ActivatedRoute
  ) {}

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
      identifiantStat: [''],
      diffAutre: [''],
      variaisonSaisoniere: [''],
      situation2emeTrimestre: [''],
      effectifs2emeTrimestre: [''],
      prixMatieres1erTrimestre: [''],
      prixMatieres2emeTrimestre: [''],
      prixMatieresFutur: [''],
      pleineCapacite: [''],
      tauxUtilisationCapacite: [''],
      avoirDifficultes: [''],
      diffApprovisionnement: [''],
      diffPieces: [],
      diffTresorerie: [],
      typeEnquete: this.formBuilder.group({
        id: [''],
      }),
    });

    // Then load data and patch the form
    this.loadAndPrefillData();

    this.route.queryParams.subscribe((params) => {
      const typeEnquete = +params['type'];
      console.log('Received typeEnqueteId:', typeEnquete);
      this.typeEnqueteId = typeEnquete;
    });
  }
  loadAndPrefillData(): void {
    this.investigatorService.findCurrentResponsable().subscribe({
      next: (investigatorData: Investigator) => {
        console.log('Received investigator data:', investigatorData);

        if (investigatorData) {
          const valuesToPatch: any = {};

          // Prefill investigator information
          if (investigatorData.nom) {
            valuesToPatch.nomRepondant = investigatorData.nom;
            this.prefilledFields.add('nomRepondant');
          }
          if (investigatorData.email) {
            valuesToPatch.mailRepondant = investigatorData.email;
            this.prefilledFields.add('mailRepondant');
          }
          if (investigatorData.phone) {
            valuesToPatch.telephone = investigatorData.phone;
            this.prefilledFields.add('telephone');
          }

          // Prefill company information from enterprise data
          if (investigatorData.enterprise) {
            if (investigatorData.enterprise.name) {
              valuesToPatch.nomSociale = investigatorData.enterprise.name;
              this.prefilledFields.add('nomSociale');
            }
            if (investigatorData.enterprise.address) {
              valuesToPatch.adresse = investigatorData.enterprise.address;
              this.prefilledFields.add('adresse');
            }
            if (investigatorData.enterprise.fax) {
              valuesToPatch.fax = investigatorData.enterprise.fax;
              this.prefilledFields.add('fax');
            }
            // Add company email if available and different from investigator email
            if (
              investigatorData.enterprise.email &&
              investigatorData.enterprise.email !== investigatorData.email
            ) {
              console.log(
                'Company email available:',
                investigatorData.enterprise.email
              );
            }
          } else {
            console.warn(
              'Investigator data does not contain enterprise details.'
            );
          }

          // Apply the patches to the form
          if (Object.keys(valuesToPatch).length > 0) {
            console.log('Patching form with values:', valuesToPatch);
            this.enqueteForm.patchValue(valuesToPatch);
            this.dataPrefilledFromProfile = true;

            // Show a success message to indicate data was prefilled
            this.toast.success(
              `${
                Object.keys(valuesToPatch).length
              } champs pré-remplis depuis votre profil`,
              {
                duration: 4000,
                position: 'top-right',
              }
            );
          } else {
            console.log('No relevant data found to patch the form.');
          }
        } else {
          console.warn('Received null or undefined investigator data.');
        }
      },
      error: (error) => {
        console.error('Error fetching investigator data:', error);
        this.toast.error('Impossible de récupérer vos informations', {
          duration: 4000,
          position: 'top-right',
        });
      },
    });
  }

  get f() {
    return this.enqueteForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    console.log(this.enqueteForm.value);
    this.enqueteForm.patchValue({
      typeEnquete: { id: this.typeEnqueteId },
    });

    if (this.enqueteForm.invalid) {
      const firstError = document.querySelector('form .ng-invalid');
      if (firstError) {
        if (typeof (firstError as HTMLElement).focus === 'function') {
          (firstError as HTMLElement).focus();
        }
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      console.warn('Form is invalid:', this.enqueteForm.errors);
      return;
    }

    console.log("Données de l'enquête:", this.enqueteForm.value);

    this.enqueteService.create(this.enqueteForm.value).subscribe({
      next: (response) => {
        this.toast.success('Enquête enregistrée avec succès !');
        this.router.navigate(['/accueil']);
      },
      error: (error) => {
        this.toast.error("Erreur lors de l'enregistrement de l'enquête");
        console.error('Erreur:', error);
      },
    });
  }

  onCancel() {
    if (
      confirm(
        'Êtes-vous sûr de vouloir annuler ? Toutes les données saisies seront perdues.'
      )
    ) {
      this.router.navigate(['/accueil']);
    }
  }
  // Helper method to check if a field is prefilled
  isFieldPrefilled(fieldName: string): boolean {
    return this.prefilledFields.has(fieldName);
  }
}
