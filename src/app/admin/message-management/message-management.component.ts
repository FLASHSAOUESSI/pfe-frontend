import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';
import { AdminContactService } from '../services/admin-contact.service';
import { ContactMessage } from '../models/contact-message';
import { AdminNavbarComponent } from '../shared/admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-message-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AdminNavbarComponent],
  templateUrl: './message-management.component.html',
  styleUrls: ['./message-management.component.css']
})
export class MessageManagementComponent implements OnInit {
  messages: ContactMessage[] = [];
  unrespondedMessages: ContactMessage[] = [];
  selectedMessage: ContactMessage | null = null;
  responseText: string = '';
  isLoading: boolean = false;
  showOnlyUnresponded: boolean = false;

  constructor(
    private adminContactService: AdminContactService,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.isLoading = true;
    if (this.showOnlyUnresponded) {
      this.adminContactService.getUnrespondedMessages().subscribe({
        next: (messages) => {
          this.messages = messages;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des messages non répondus:', error);
          this.toast.error('Erreur lors du chargement des messages');
          this.isLoading = false;
        }
      });
    } else {
      this.adminContactService.getAllMessages().subscribe({
        next: (messages) => {
          this.messages = messages;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des messages:', error);
          this.toast.error('Erreur lors du chargement des messages');
          this.isLoading = false;
        }
      });
    }
  }

  selectMessage(message: ContactMessage): void {
    this.selectedMessage = message;
    this.responseText = message.adminResponse || '';
  }

  sendResponse(): void {
    if (!this.selectedMessage || !this.responseText.trim()) {
      this.toast.error('Veuillez saisir une réponse');
      return;
    }

    this.isLoading = true;
    this.adminContactService.respondToMessage(this.selectedMessage.id, this.responseText)
      .subscribe({
        next: (updatedMessage) => {
          const index = this.messages.findIndex(m => m.id === updatedMessage.id);
          if (index !== -1) {
            this.messages[index] = updatedMessage;
          }
          this.selectedMessage = null;
          this.responseText = '';
          this.isLoading = false;
          this.toast.success('Réponse envoyée avec succès');
          
          // Recharger les messages si on affiche uniquement les non répondus
          if (this.showOnlyUnresponded) {
            this.loadMessages();
          }
        },
        error: (error) => {
          console.error('Erreur lors de l\'envoi de la réponse:', error);
          this.toast.error('Erreur lors de l\'envoi de la réponse');
          this.isLoading = false;
        }
      });
  }

  toggleUnrespondedFilter(): void {
    this.showOnlyUnresponded = !this.showOnlyUnresponded;
    this.loadMessages();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
