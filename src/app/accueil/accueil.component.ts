import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminTypeEnqueteService, TypeEnquete } from '../admin/services/admin-type-enquete.service';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent implements OnInit {
  router = inject(Router);
  typeService = inject(AdminTypeEnqueteService);

  types: TypeEnquete[] = [];
  selectedTypeId: number | null = null;
  selectedType: TypeEnquete | null = null;

  ngOnInit(): void {
    this.typeService.getAllTypes().subscribe(types => {
      this.types = types;
      if (types.length > 0) {
        this.selectedTypeId = types[0].id;
        this.selectedType = types[0];
      }
    });
  }

  onTypeChange(id: string) {
    const type = this.types.find(t => t.id === +id) || null;
    this.selectedTypeId = type ? type.id : null;
    this.selectedType = type;
  }

goToEnquete(typeEnqueteId : number) {
  console.log(typeEnqueteId);
      if (this.selectedType && this.selectedType.statut === 'enable') {
    this.router.navigate(['/enquete'], { queryParams: { type: typeEnqueteId } });
    }
}

logout() {
  // Supprime le token d'authentification
  localStorage.removeItem('accessToken');
  // Redirige vers la page de connexion
  this.router.navigate(['/login']);
}
}
