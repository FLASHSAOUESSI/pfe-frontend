import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class ContactComponent {
  contactForm: FormGroup;
  submitted = false;
  messageSent = false;

  constructor(private formBuilder: FormBuilder) {
    this.contactForm = this.formBuilder.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      sujet: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.contactForm.invalid) {
      return;
    }

    // Ici, vous pouvez implémenter l'envoi réel du message
    console.log('Formulaire soumis:', this.contactForm.value);
    
    // Simuler un envoi réussi
    setTimeout(() => {
      this.messageSent = true;
      this.contactForm.reset();
      this.submitted = false;
      
      // Réinitialiser le message de succès après 5 secondes
      setTimeout(() => {
        this.messageSent = false;
      }, 5000);
    }, 1000);
  }
}