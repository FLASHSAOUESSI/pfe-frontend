import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule 
  ],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent {
router = inject(Router)

goToEnquete() {
  console.log("Navigation vers la page d'enquête");
  this.router.navigate(['/enquete']);
}

logout() {
  // Supprime le token d'authentification
  localStorage.removeItem('accessToken');
  // Redirige vers la page de connexion
  this.router.navigate(['/login']);
}

}
