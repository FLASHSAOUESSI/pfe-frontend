import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Interface pour les thèmes
export interface Theme {
  name: string;
  label: string;
  navbarColor: string;
  bannerColor: string;
  titleColor: string;
  buttonColor: string;
}

// Interface pour les options d'affichage
export interface DisplayOptions {
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
}

// Thème par défaut
const DEFAULT_THEME: Theme = {
  name: 'default',
  label: 'Défaut',
  navbarColor: '#003366',
  bannerColor: '#e9ecef',
  titleColor: '#003366',
  buttonColor: '#003366'
};

// Options d'affichage par défaut
const DEFAULT_DISPLAY_OPTIONS: DisplayOptions = {
  fontSize: 'medium',
  highContrast: false
};

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Thèmes disponibles
  private themes: Theme[] = [
    DEFAULT_THEME,
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

  // BehaviorSubjects pour observer les changements
  private currentThemeSubject = new BehaviorSubject<Theme>(DEFAULT_THEME);
  private customColorsSubject = new BehaviorSubject<any>({
    navbarColor: DEFAULT_THEME.navbarColor,
    bannerColor: DEFAULT_THEME.bannerColor,
    titleColor: DEFAULT_THEME.titleColor,
    buttonColor: DEFAULT_THEME.buttonColor
  });
  private displayOptionsSubject = new BehaviorSubject<DisplayOptions>(DEFAULT_DISPLAY_OPTIONS);

  constructor() {
    // Charger les paramètres depuis le localStorage au démarrage
    this.loadSettings();
  }

  // Retourne tous les thèmes disponibles
  getThemes(): Theme[] {
    return this.themes;
  }

  // Retourne le thème actuel comme Observable
  getCurrentTheme(): Observable<Theme> {
    return this.currentThemeSubject.asObservable();
  }

  // Retourne les options d'affichage comme Observable
  getDisplayOptions(): Observable<DisplayOptions> {
    return this.displayOptionsSubject.asObservable();
  }

  // Définir un nouveau thème
  setTheme(theme: Theme): void {
    this.currentThemeSubject.next(theme);
    
    // Mettre à jour les couleurs personnalisées pour refléter le thème sélectionné
    this.customColorsSubject.next({
      navbarColor: theme.navbarColor,
      bannerColor: theme.bannerColor,
      titleColor: theme.titleColor,
      buttonColor: theme.buttonColor
    });
    
    // Sauvegarder dans le localStorage
    this.saveSettings();
  }

  // Appliquer un thème personnalisé
  applyCustomTheme(customColors: any): void {
    // Créer un thème personnalisé
    const customTheme: Theme = {
      name: 'custom',
      label: 'Personnalisé',
      ...customColors
    };
    
    this.currentThemeSubject.next(customTheme);
    this.customColorsSubject.next(customColors);
    
    // Sauvegarder dans le localStorage
    this.saveSettings();
  }

  // Définir les options d'affichage
  setDisplayOptions(options: DisplayOptions): void {
    this.displayOptionsSubject.next(options);
    
    // Appliquer les options
    this.applyDisplayOptions(options);
    
    // Sauvegarder dans le localStorage
    this.saveSettings();
  }

  // Appliquer les options d'affichage au DOM
  private applyDisplayOptions(options: DisplayOptions): void {
    // Appliquer la taille de police
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    document.body.classList.add(`font-${options.fontSize}`);
    
    // Appliquer le mode contraste élevé
    if (options.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }

  // Réinitialiser tous les paramètres
  resetSettings(): void {
    // Réinitialiser au thème par défaut
    this.currentThemeSubject.next(DEFAULT_THEME);
    
    // Réinitialiser les couleurs personnalisées
    this.customColorsSubject.next({
      navbarColor: DEFAULT_THEME.navbarColor,
      bannerColor: DEFAULT_THEME.bannerColor,
      titleColor: DEFAULT_THEME.titleColor,
      buttonColor: DEFAULT_THEME.buttonColor
    });
    
    // Réinitialiser les options d'affichage
    const defaultOptions = DEFAULT_DISPLAY_OPTIONS;
    this.displayOptionsSubject.next(defaultOptions);
    this.applyDisplayOptions(defaultOptions);
    
    // Supprimer du localStorage
    localStorage.removeItem('userSettings');
  }

  // Sauvegarder les paramètres dans le localStorage
  private saveSettings(): void {
    try {
      const settings = {
        theme: this.currentThemeSubject.value.name,
        customColors: this.customColorsSubject.value,
        displayOptions: this.displayOptionsSubject.value
      };
      
      localStorage.setItem('userSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres :', error);
    }
  }

  // Charger les paramètres depuis le localStorage
  private loadSettings(): void {
    try {
      const savedSettings = localStorage.getItem('userSettings');
      
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        // Charger le thème
        if (settings.theme) {
          if (settings.theme === 'custom' && settings.customColors) {
            // Thème personnalisé
            this.customColorsSubject.next(settings.customColors);
            this.currentThemeSubject.next({
              name: 'custom',
              label: 'Personnalisé',
              ...settings.customColors
            });
          } else {
            // Thème prédéfini
            const foundTheme = this.themes.find(t => t.name === settings.theme);
            if (foundTheme) {
              this.currentThemeSubject.next(foundTheme);
            }
          }
        }
        
        // Charger les options d'affichage
        if (settings.displayOptions) {
          this.displayOptionsSubject.next(settings.displayOptions);
          this.applyDisplayOptions(settings.displayOptions);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres :', error);
    }
  }
}
