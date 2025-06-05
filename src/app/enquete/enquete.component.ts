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
import { EnqueteService } from './enquete.service';
import { InvestigateurService } from './investigator.service'; // Adjust path if necessary
import { HotToastService } from '@ngxpert/hot-toast';

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
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
  ],
})
export class EnqueteComponent implements OnInit {
  enqueteForm!: FormGroup;
  submitted = false;
  typeEnqueteId :number;
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
    id: ['']
  })
    });

    // Then load data and patch the form
    this.loadAndPrefillData();


    this.route.queryParams.subscribe(params => {
    const typeEnquete = +params['type'];
    console.log('Received typeEnqueteId:', typeEnquete);
    this.typeEnqueteId=typeEnquete;
  });
  }

  loadAndPrefillData(): void {
    this.investigatorService.findCurrentResponsable().subscribe({
      next: (investigatorData: Investigator) => {
        console.log('Received investigator data:', investigatorData);

        if (investigatorData) {
          const valuesToPatch: any = {};

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
            console.warn(
              'Investigator data does not contain entreprise details.'
            );
          }

          if (Object.keys(valuesToPatch).length > 0) {
            console.log('Patching form with values:', valuesToPatch);
            this.enqueteForm.patchValue(valuesToPatch);
          } else {
            console.log('No relevant data found to patch the form.');
          }
        } else {
          console.warn('Received null or undefined investigator data.');
        }
      },
      error: (error) => {
        console.error('Error fetching investigator data:', error);
        // Optionally show an error message to the user
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
  typeEnquete: { id: this.typeEnqueteId }
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
        this.toast.error('Erreur lors de l\'enregistrement de l\'enquête');
        console.error('Erreur:', error);
      }
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
}
