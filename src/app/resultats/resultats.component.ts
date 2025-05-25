import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-resultats',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './resultats.component.html',
  styleUrl: './resultats.component.css'
})
export class ResultatsComponent {
  private readonly router = inject(Router);

  logout() {
    // Supprime le token d'authentification
    localStorage.removeItem('accessToken');
    // Redirige vers la page de connexion
    this.router.navigate(['/login']);
  }
}
