import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { JwtService } from '../../services/jwt.service';
import {
  Enterprise,
  EnterpriseDashboardDto,
  EnterpriseStatus,
} from '../models/enterprise.model';
import { EnterpriseService } from '../services/enterprise.service';
import { AdminNavbarComponent } from '../shared/admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AdminNavbarComponent],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
})
export class AdminPanelComponent implements OnInit {
  isUserAdmin: boolean = false;
  userEmail: string | null = null;

  // Enterprises data
  enterprises: Enterprise[] = [];
  dashboardStats: EnterpriseDashboardDto | null = null;
  selectedStatus: EnterpriseStatus = EnterpriseStatus.PENDING;
  isLoading: boolean = false;
  error: string | null = null;
  activeSection: string = 'dashboard';

  // Status options for dropdown
  statusOptions = Object.values(EnterpriseStatus);
  statusOptions2 = ['validated', 'pending', 'rejected'];
  constructor(
    private jwtService: JwtService,
    private enterpriseService: EnterpriseService,
    private route: ActivatedRoute
  ) {}


statusTranslations: { [key: string]: string } = {
  validated: 'Validé',
  pending: 'En attente',
  rejected: 'Rejeté'
};
  ngOnInit(): void {
    this.isUserAdmin = this.jwtService.isAdmin();
    this.userEmail = this.jwtService.getUserEmail();

    // Determine active section from route
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
        } else {
          this.activeSection = 'dashboard';
        }
      }

      // Load initial data based on section
      this.loadInitialData();
    });
  }

  loadInitialData(): void {
    // Load dashboard stats
    this.loadDashboardStats();

    // Load enterprises based on selected status or default to pending
    this.loadEnterprisesByStatus(this.selectedStatus);
  }

  loadDashboardStats(): void {
    this.isLoading = true;
    this.enterpriseService.getDashboard().subscribe({
      next: (stats) => {
        this.dashboardStats = stats;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard stats', err);
        this.error =
          'Impossible de charger les statistiques du tableau de bord.';
        this.isLoading = false;
      },
    });
  }

  loadEnterprisesByStatus(status: EnterpriseStatus): void {
    this.isLoading = true;
    this.selectedStatus = status;

    this.enterpriseService.getEnterprisesByStatus(status).subscribe({
      next: (data) => {
        this.enterprises = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading enterprises', err);
        this.error = `Impossible de charger les entreprises avec le statut ${status}.`;
        this.isLoading = false;
      },
    });
  }

  updateEnterpriseStatus(
    enterprise: Enterprise,
    event: Event
  ): void {
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value as EnterpriseStatus;

    if (enterprise.status === newStatus) {
      return; // No change needed
    }

    this.isLoading = true;
    this.enterpriseService
      .updateEnterpriseStatus(enterprise.id, newStatus)
      .subscribe({
        next: (response) => {
          // Update the local enterprise status
          enterprise.status = newStatus;
          this.isLoading = false;

          // Refresh stats after status update
          this.loadDashboardStats();

          console.log('Enterprise status updated successfully', response);
        },
        error: (err) => {
          console.error('Error updating enterprise status', err);
          this.error = "Impossible de mettre à jour le statut de l'entreprise.";
          this.isLoading = false;
        },
      });
  }

  // Helper method to get status CSS class
  getStatusClass(status: EnterpriseStatus): string {
    switch (status) {
      case EnterpriseStatus.VALIDATED:
        return 'status-validated';
      case EnterpriseStatus.REJECTED:
        return 'status-rejected';
      case EnterpriseStatus.PENDING:
      default:
        return 'status-pending';
    }
  }

  // Switch between sections
  setActiveSection(section: string): void {
    this.activeSection = section;
  }
}
