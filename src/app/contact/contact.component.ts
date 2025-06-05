import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContactService } from '../services/contact.service';
import { HotToastService } from '@ngxpert/hot-toast';

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
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private contactService: ContactService,
    private toast: HotToastService
  ) {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
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

    this.isLoading = true;

    const message = {
      name: this.contactForm.value.name,
      email: this.contactForm.value.email,
      subject: this.contactForm.value.subject,
      message: this.contactForm.value.message
    };

    this.contactService.sendMessage(message).subscribe({
      next: () => {
        this.isLoading = false;
        this.messageSent = true;
        this.contactForm.reset();
        this.submitted = false;
        this.toast.success('Votre message a été envoyé avec succès !');
        
        // Réinitialiser le message de succès après 5 secondes
        setTimeout(() => {
          this.messageSent = false;
        }, 5000);
      },
      error: (error) => {
        this.isLoading = false;
        this.toast.error('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.');
        console.error('Erreur lors de l\'envoi du message:', error);
      }
    });
  }
}