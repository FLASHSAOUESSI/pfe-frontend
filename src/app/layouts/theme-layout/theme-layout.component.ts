import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
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

@Component({
  selector: 'app-theme-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './theme-layout.component.html',
  styleUrl: './theme-layout.component.css'
})
export class ThemeLayoutComponent implements OnInit, OnDestroy {
  private readonly themeService = inject(ThemeService);
  
  // Thème actuel avec valeur par défaut pour éviter les undefined
  currentTheme: Theme = {
    name: 'default',
    label: 'Défaut',
    navbarColor: '#003366',
    bannerColor: '#e9ecef',
    titleColor: '#003366',
    buttonColor: '#003366'
  };
  
  // Abonnements
  private themeSubscription?: Subscription;
  
  ngOnInit(): void {
    // Charger les paramètres depuis le localStorage
    this.loadSettings();
  }
  
  ngOnDestroy(): void {
    // Se désabonner
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }
  
  // Applique les couleurs du thème à l'ensemble du document
  private applyThemeToDocument(theme: Theme): void {
    document.documentElement.style.setProperty('--navbar-color', theme.navbarColor);
    document.documentElement.style.setProperty('--banner-color', theme.bannerColor);
    document.documentElement.style.setProperty('--title-color', theme.titleColor);
    document.documentElement.style.setProperty('--button-color', theme.buttonColor);
  }

  // Charger les paramètres depuis le localStorage
  private loadSettings(): void {
    try {
      const savedSettings = localStorage.getItem('userSettings');
      
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        // Charger le thème
        if (settings.theme === 'custom' && settings.customColors) {
          // Thème personnalisé
          const customTheme: Theme = {
            name: 'custom',
            label: 'Personnalisé',
            ...settings.customColors
          };
          this.currentTheme = customTheme;
          this.applyThemeToDocument(this.currentTheme);
        } else if (settings.theme) {
          // Définition des thèmes prédéfinis
          const themes: Theme[] = [
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
          
          // Trouver le thème par son nom
          const foundTheme = themes.find(t => t.name === settings.theme);
          if (foundTheme) {
            this.currentTheme = foundTheme;
            this.applyThemeToDocument(this.currentTheme);
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres :', error);
    }
  }
}
