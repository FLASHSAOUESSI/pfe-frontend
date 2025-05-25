import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngClass
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router'; // Ajout de Router
import { AuthService } from '../auth.service';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
private readonly authService = inject(AuthService)
private readonly toast = inject(HotToastService)

  constructor(
    private formBuilder: FormBuilder,
    private router: Router // Injection du Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
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

    const email= this.f['email'].value
    const password = this.f['password'].value
    this.authService.login(email,password).subscribe(
      {
        next: ()=>{
          this.router.navigate(['/accueil']);
        },
        error: (error)=>{
          console.log(error)
          alert('email or password is wrong')
        }
      }
    )

    

  }
}