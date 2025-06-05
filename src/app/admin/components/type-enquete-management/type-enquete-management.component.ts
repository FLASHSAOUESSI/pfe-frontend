import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminTypeEnqueteService, TypeEnquete } from '../../services/admin-type-enquete.service';
import { JwtService } from '../../../services/jwt.service';
import { ActivatedRoute } from '@angular/router';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-type-enquete-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    AdminNavbarComponent
  ],
  templateUrl: './type-enquete-management.component.html',
  styleUrl: './type-enquete-management.component.css'
})
export class TypeEnqueteManagementComponent implements OnInit {
  types: TypeEnquete[] = [];
  displayedColumns: string[] = ['id', 'annee', 'periodicite', 'session', 'statut', 'actions'];
  editRowId: number | null = null;
  editAnnee: number | null = null;
  editPeriodicite: string = '';
  editSession: string = '';
  editStatut: 'enable' | 'disable' = 'enable';
  // Pour l'ajout
  newAnnee: number | null = null;
  newPeriodicite: string = '';
  newSession: string = '';
  newStatut: 'enable' | 'disable' = 'enable';
  isLoading = false;
  isUserAdmin: boolean = false;
  userEmail: string | null = null;
  activeSection: string = 'type-enquete';

  constructor(
    private typeService: AdminTypeEnqueteService,
    private jwtService: JwtService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isUserAdmin = this.jwtService.isAdmin();
    this.userEmail = this.jwtService.getUserEmail();
    this.activeSection = 'type-enquete';
    this.route.url.subscribe((segments) => {
      if (segments.length > 0) {
        const lastSegment = segments[segments.length - 1].path;
        if (lastSegment === 'utilisateurs') {
          this.activeSection = 'users';
        } else if (lastSegment === 'enquetes') {
          this.activeSection = 'surveys';
        } else if (lastSegment === 'parametres') {
          this.activeSection = 'settings';
        } else if (lastSegment === 'statistiques') {
          this.activeSection = 'statistics';
        } else if (lastSegment === 'type-enquete') {
          this.activeSection = 'type-enquete';
        } else {
          this.activeSection = 'dashboard';
        }
      }
    });
    this.loadTypes();
  }

  loadTypes() {
    this.isLoading = true;
    this.typeService.getAllTypes().subscribe({
      next: (data) => {
        this.types = data;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  startEdit(type: TypeEnquete) {
    this.editRowId = type.id;
    this.editAnnee = type.annee;
    this.editPeriodicite = type.periodicite;
    this.editSession = type.session;
    this.editStatut = type.statut;
  }

  cancelEdit() {
    this.editRowId = null;
  }

  saveEdit(type: TypeEnquete) {
    const updated = {
      annee: this.editAnnee,
      periodicite: this.editPeriodicite,
      session: this.editSession,
      statut: this.editStatut
    };
    this.typeService.updateType(type.id, updated).subscribe({
      next: (res) => {
        type.annee = res.annee;
        type.periodicite = res.periodicite;
        type.session = res.session;
        type.statut = res.statut;
        this.editRowId = null;
        this.loadTypes();
      }
    });
  }

  addType() {
    if (!this.newAnnee || !this.newPeriodicite.trim() || !this.newSession.trim()) return;
    const newType = {
      annee: this.newAnnee,
      periodicite: this.newPeriodicite,
      session: this.newSession,
      statut: this.newStatut
    };
    this.typeService.addType(newType).subscribe({
      next: (res) => {
        this.types.push(res);
        this.newAnnee = null;
        this.newPeriodicite = '';
        this.newSession = '';
        this.newStatut = 'enable';
        this.loadTypes();
      }
    });
  }

  deleteType(id: number) {
    this.typeService.deleteTypeEnquete(id).subscribe({
      next: () => {
        this.snackBar.open('Type supprimé avec succès', 'Fermer', { duration: 3000 });
        this.loadTypes();
      },
      error: (err) => {
        if (err.status === 400 && err.error?.error) {
          this.snackBar.open(err.error.error, 'Fermer', { duration: 5000 });
        } else {
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 5000 });
        }
      }
    });
  }
}
