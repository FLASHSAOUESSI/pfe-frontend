import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { JwtService } from '../../../services/jwt.service';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.css'
})
export class AdminNavbarComponent implements OnInit {
  isUserAdmin: boolean = false;
  userEmail: string | null = null;
  activeSection: string = 'dashboard';

  constructor(private jwtService: JwtService, private router: Router) {}

  ngOnInit(): void {
    this.isUserAdmin = this.jwtService.isAdmin();
    this.userEmail = this.jwtService.getUserEmail();
    this.setActiveSection(this.router.url);
    this.router.events.subscribe(() => {
      this.setActiveSection(this.router.url);
    });
  }

  setActiveSection(url: string) {
    if (url.includes('/admin/type-enquete')) {
      this.activeSection = 'type-enquete';
    } else if (url.includes('/admin/enquetes')) {
      this.activeSection = 'surveys';
    } else if (url.includes('/admin/messages')) {
      this.activeSection = 'messages';
    } else if (url.includes('/admin/statistiques')) {
      this.activeSection = 'statistics';
    } else if (url === '/admin' || url.startsWith('/admin?')) {
      this.activeSection = 'dashboard';
    } else {
      this.activeSection = '';
    }
  }
}
