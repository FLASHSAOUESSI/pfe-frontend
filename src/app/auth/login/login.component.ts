import { CommonModule } from '@angular/common'; // Import CommonModule for ngClass
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // Ajout de Router
import { HotToastService } from '@ngxpert/hot-toast';
import { JwtService } from '../../services/jwt.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  private readonly authService = inject(AuthService);
  private readonly toast = inject(HotToastService);
  private readonly jwtService = inject(JwtService);

  constructor(
    private formBuilder: FormBuilder,
    private router: Router // Injection du Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}

  // Getter pour un accès facile aux champs du formulaire
  get f() {
    return this.loginForm.controls;
  }
  onSubmit() {
    this.submitted = true;

    // Arrêter ici si le formulaire est invalide
    if (this.loginForm.invalid) {
      return;
    }

    const email = this.f['email'].value;
    const password = this.f['password'].value;
    this.authService.login(email, password).subscribe({
      next: () => {
        // Check if the user is an admin to decide where to redirect
        if (this.jwtService.isAdmin()) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/accueil']);
        }
      },
      error: (error) => {
        console.log(error);
        this.toast.error('Email ou mot de passe incorrect');
      },
    });
  }
}
