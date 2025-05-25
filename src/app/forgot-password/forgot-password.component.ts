import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { ForgetPasswordRequest } from '../auth/auth.types';

interface PasswordReset {
  email: string;
  newPassword: string;
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule]
})
export class ForgotPasswordComponent implements OnInit {
  private readonly authService = inject(AuthService)
  private readonly toast = inject(HotToastService)
  forgotPasswordForm!: FormGroup;
  submitted = false;
  currentStep = 1;
  showPassword = false;
  tempVerificationCode: string = '';
  
  // Captcha
  captchaImages = [
    { id: 1, url: 'captcha/car1.jpg', type: 'car' },
    { id: 2, url: 'captcha/building1.jpg', type: 'building' },
    { id: 3, url: 'captcha/car2.jpg', type: 'car' },
    { id: 4, url: 'captcha/tree1.jpg', type: 'tree' },
    { id: 5, url: 'captcha/car3.jpg', type: 'car' },
    { id: 6, url: 'captcha/building2.jpg', type: 'building' },
    { id: 7, url: 'captcha/tree2.jpg', type: 'tree' },
    { id: 8, url: 'captcha/building3.jpg', type: 'building' },
    { id: 9, url: 'captcha/car4.jpg', type: 'car' }
  ];
  selectedImages: number[] = [];
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      verificationCode: [''],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
    
    // Mélanger les images
    this.shuffleImages();
  }
  
  get f() {
    return this.forgotPasswordForm.controls;
  }
  
  shuffleImages() {
    this.captchaImages.sort(() => Math.random() - 0.5);
  }
  
  toggleImageSelection(imageId: number) {
    const index = this.selectedImages.indexOf(imageId);
    if (index === -1) {
      this.selectedImages.push(imageId);
    } else {
      this.selectedImages.splice(index, 1);
    }
  }
  
  isImageSelected(imageId: number): boolean {
    return this.selectedImages.includes(imageId);
  }
  
  verifyCaptcha() {
    this.submitted = true;
    
    if (this.f['email'].invalid) {
      return;
    }
    
    // Vérifier que seules les voitures sont sélectionnées
    const correctSelection = this.captchaImages
      .filter(img => img.type === 'car')
      .every(img => this.isImageSelected(img.id)) &&
      this.captchaImages
      .filter(img => img.type !== 'car')
      .every(img => !this.isImageSelected(img.id));
    
    if (correctSelection) {
      const request:ForgetPasswordRequest = {
        email: this.f['email'].value
      }
      this.authService.forgotpassword(request).subscribe()
      this.currentStep = 2;
      this.submitted = false;
    } else {
      alert('Sélection incorrecte. Veuillez sélectionner toutes les voitures.');
      this.selectedImages = [];
      this.shuffleImages();
    }
  }
  
  verifyCode() {
    const enteredCode = this.f['verificationCode'].value;

    this.authService.verifyCode(enteredCode).subscribe({
      next: (res:boolean) => {
        if (res){
          this.currentStep =3
        }
        return true;
      },
      error: ()=>{
        alert('Code incorrect.');

      }
    })
  
  }
  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
  onSubmit() {
    this.submitted = true;
    
    if (this.currentStep === 1) {
      this.verifyCaptcha();
      return;
    }
    
    if (this.currentStep === 2) {
      this.verifyCode();
      return;
    }

    if(this.currentStep===3){
 // Étape 3: Réinitialisation du mot de passe
 if (this.f['newPassword'].invalid || this.f['confirmPassword'].invalid) {
  return;
}

if (this.f['newPassword'].value !== this.f['confirmPassword'].value) {
  alert('Les mots de passe ne correspondent pas');
  return;
}

const password= this.f['newPassword'].value;
const confirmPassword = this.f['confirmPassword'].value
const code = this.f['verificationCode'].value
this.authService.changePassword(password,confirmPassword,code).subscribe(
  {
    next: ()=>{
      alert('Votre mot de passe a été réinitialisé avec succès!');
      this.router.navigateByUrl('/login');
    }
  }
)
return;
    }
    
   
   
  }
}