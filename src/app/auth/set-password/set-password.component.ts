import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class SetPasswordComponent implements OnInit {
  setPasswordForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.setPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }
  
  // Validateur personnalisé pour vérifier que les mots de passe correspondent
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      return { notMatching: true };
    }
    
    return null;
  }
  
  // Méthode pour basculer la visibilité du mot de passe
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
  // Méthode pour basculer la visibilité de la confirmation du mot de passe
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  
  // Méthode pour déterminer la force du mot de passe
  getPasswordStrength(): string {
    const password = this.setPasswordForm.get('password')?.value;
    
    if (!password) return '';
    
    // Critères de force du mot de passe
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const passwordStrength = 
      (password.length >= 8 ? 1 : 0) + 
      (hasUpperCase ? 1 : 0) + 
      (hasLowerCase ? 1 : 0) + 
      (hasNumbers ? 1 : 0) + 
      (hasSpecialChars ? 1 : 0);
    
    if (passwordStrength <= 2) return 'weak';
    if (passwordStrength <= 4) return 'medium';
    return 'strong';
  }
  
  // Texte descriptif de la force du mot de passe
  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    
    switch (strength) {
      case 'weak':
        return 'Faible';
      case 'medium':
        return 'Moyen';
      case 'strong':
        return 'Fort';
      default:
        return '';
    }
  }
  
  // Soumission du formulaire
  submit() {
    if (this.setPasswordForm.invalid) {
      return;
    }
    
    // Logique pour définir le mot de passe
    console.log('Mot de passe défini:', this.setPasswordForm.get('password')?.value);
    
    // Redirection vers la page de connexion après la réinitialisation
    this.router.navigateByUrl('/login');
  }
}