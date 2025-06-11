import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MatChip,
  MatChipListbox,
  MatChipsModule,
} from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { JwtService } from '../../../services/jwt.service';
import {
  AdminEnqueteService,
  Enquete,
} from '../../services/admin-enquete.service';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-enquete-analysis',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatChipListbox,
    MatChip,
    AdminNavbarComponent,
  ],
  templateUrl: './enquete-analysis.component.html',
  styleUrls: ['./enquete-analysis.component.css'],
})
export class EnqueteAnalysisComponent implements OnInit {
  enquetes: Enquete[] = [];
  selectedEnquete: Enquete | null = null;
  displayedColumns: string[] = [
    'identifiantStat',
    'type_enquete',
    'entreprise',
    'status',
    'actions',
  ];
  isUserAdmin: boolean = false;
  userEmail: string | null = null;

  constructor(
    private adminEnqueteService: AdminEnqueteService,
    private jwtService: JwtService
  ) {}

  ngOnInit(): void {
    this.isUserAdmin = this.jwtService.isAdmin();
    this.userEmail = this.jwtService.getUserEmail();
    this.loadEnquetes();
  }

  loadEnquetes(): void {
    this.adminEnqueteService.getAllEnquetes().subscribe({
      next: (data) => {
        this.enquetes = data;
        // Analyser le statut de chaque enquête
        console.log(this.enquetes);
        this.enquetes.forEach((enquete) => {
          enquete.status =
            this.adminEnqueteService.analyzeEnqueteStatus(enquete);
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement des enquêtes:', error);
      },
    });
  }

  selectEnquete(enquete: Enquete): void {
    this.selectedEnquete = enquete;
  }

  unselectEnquete(): void {
    this.selectedEnquete = null;
  }

  getStatusColor(status: 'COMPLETED' | 'INCOMPLETE'): string {
    return status === 'COMPLETED' ? 'green' : 'red';
  }

  getStatusText(status: 'COMPLETED' | 'INCOMPLETE'): string {
    return status === 'COMPLETED' ? 'Terminé' : 'Non terminé';
  }
  getMissingFields(enquete: Enquete): string[] {
    const requiredFields = [
      { key: 'nomSociale', label: 'Nom de la société' },
      { key: 'adresse', label: 'Adresse' },
      { key: 'telephone', label: 'Téléphone' },
      { key: 'fax', label: 'Fax' },
      { key: 'nomRepondant', label: 'Nom du répondant' },
      { key: 'mailRepondant', label: 'Email du répondant' },
      { key: 'brancheActivite', label: "Branche d'activité" },
      { key: 'exportatrice', label: 'Exportatrice' },
      { key: 'variaisonSaisoniere', label: 'Variation saisonnière' },
      { key: 'situation1erTrimestre', label: 'Situation 1er trimestre' },
      { key: 'situation2emeTrimestre', label: 'Situation 2ème trimestre' },
      { key: 'situationFuture', label: 'Situation future' },
      { key: 'effectifs1erTrimestre', label: 'Effectifs 1er trimestre' },
      { key: 'effectifs2emeTrimestre', label: 'Effectifs 2ème trimestre' },
      { key: 'effectifsFutur', label: 'Effectifs futurs' },
      { key: 'prixMatieres1erTrimestre', label: 'Prix matières 1er trimestre' },
      {
        key: 'prixMatieres2emeTrimestre',
        label: 'Prix matières 2ème trimestre',
      },
      { key: 'prixMatieresFutur', label: 'Prix matières futurs' },
      { key: 'pleineCapacite', label: 'Pleine capacité' },
      { key: 'tauxUtilisationCapacite', label: "Taux d'utilisation" },
      { key: 'avoirDifficultes', label: 'Avoir des difficultés' },
    ];

    return requiredFields
      .filter((field) => {
        const value = enquete[field.key as keyof Enquete];
        return value === null || value === undefined || value === '';
      })
      .map((field) => field.label);
  }

  viewEntreprise(enquete: Enquete): void {
    this.selectedEnquete = enquete;
    console.log('Viewing enterprise data for enquete:', enquete);
    if (enquete.enterprise) {
      console.log('Enterprise details:', enquete.enterprise);
    } else {
      console.log('No enterprise data available for this enquete');
    }
  }

  getEnterpriseStatusText(status: string): string {
    switch (status) {
      case 'VALIDATED':
        return 'Validée';
      case 'PENDING':
        return 'En attente';
      case 'REJECTED':
        return 'Rejetée';
      default:
        return status;
    }
  }

  getEnterpriseStatusIcon(status: string): string {
    switch (status) {
      case 'VALIDATED':
        return 'check_circle';
      case 'PENDING':
        return 'hourglass_empty';
      case 'REJECTED':
        return 'cancel';
      default:
        return 'help';
    }
  }
}
