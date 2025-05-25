import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // ✅ Import CommonModule for directives like ngIf, ngClass
import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule for template-driven forms
import { RouterModule } from '@angular/router'; // ✅ Import RouterModule for routing
import { AuthService } from '../auth.service';
import { RegisterRequest, VerificationRequest } from '../auth.types';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-register',
  standalone: true, // ✅ Standalone component
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule], // ✅ Import necessary modules
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  private readonly authService = inject(AuthService)
  private readonly toast = inject(HotToastService)
  registerForm: FormGroup;
  submitted = false;
  verificationStep = false;
  verificationCode = '';
  generatedCode = '';

  constructor(private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      // Informations de l'entreprise
      companyName: ['', Validators.required],
      companyAddress: ['', Validators.required],
      companyEmail: ['', [Validators.required, Validators.email]],
      companyFax: ['', Validators.required],
      
      // Informations de l'enquêteur
      investigatorName: ['', Validators.required],
      investigatorPhone: ['', [Validators.required, Validators.pattern('^[0-9]{8,}$')]],
      investigatorEmail: ['', [Validators.required, Validators.email]],
      
      // Code de vérification
      verificationCode: ['']
    });
  }

  ngOnInit(): void {}

  // Getter pour accéder facilement aux contrôles du formulaire
  get f() { 
    return this.registerForm.controls; 
  }


  // Première étape: envoi du code de vérification
  sendVerificationCode() {
    this.submitted = true;

    // Vérifier si le formulaire est valide (sans le code de vérification)
    if (this.registerForm.get('companyName')?.invalid ||
        this.registerForm.get('companyAddress')?.invalid ||
        this.registerForm.get('companyEmail')?.invalid ||
        this.registerForm.get('companyFax')?.invalid ||
        this.registerForm.get('investigatorName')?.invalid ||
        this.registerForm.get('investigatorPhone')?.invalid ||
        this.registerForm.get('investigatorEmail')?.invalid) {
      return;
    }

    const request: VerificationRequest = {
      companyEmail: this.registerForm.get('companyEmail')?.value,
      companyName: this.registerForm.get('companyName')?.value,
      investigatorEmail: this.registerForm.get('investigatorEmail')?.value,

    }
   
    this.authService.sendVerficationCode(request).subscribe({
      next: ()=>{
        this.verificationStep = true;
        this.toast.success("Verification code sent successfully")
      },
      error: ()=>{
        this.toast.error("Something went wrong, please try again later")
      }
    })
    
  }

  register(){
    const request: RegisterRequest = {
      companyName: this.registerForm.get('companyName')?.value,
      companyAddress: this.registerForm.get('companyAddress')?.value,
      companyEmail: this.registerForm.get('companyEmail')?.value,
      companyFax: this.registerForm.get('companyFax')?.value,
      investigatorName: this.registerForm.get('investigatorName')?.value,
      investigatorPhone: this.registerForm.get('investigatorPhone')?.value,
      investigatorEmail: this.registerForm.get('investigatorEmail')?.value,
      verificationCode: this.registerForm.get('verificationCode')?.value
    };
    this.authService.register(request).subscribe(
      {
        next: ()=>{
          this.toast.success("Registartion success, please check your email to set ur password")
        },
        error: ()=>{
          this.toast.error("Something went wrong, please try again later")
        }
      }
    )

  }

  // Deuxième étape: vérification du code et enregistrement final
  onSubmit() {
    if (!this.verificationStep) {
      this.sendVerificationCode();
      return;
    }

    const submittedCode = this.registerForm.get('verificationCode')?.value;
    
    if (submittedCode === this.generatedCode) {
      // TODO: Envoyer les données au backend
      console.log('Inscription réussie !', this.registerForm.value);
    } else {
      alert('Code de vérification incorrect !');
    }
  }
}