import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { JwtService } from '../../services/jwt.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  isUserAdmin: boolean = false;
  userEmail: string | null = null;
  private routerSubscription!: Subscription;

  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initial check for auth state
    this.checkAuthState();

    // Subscribe to router events to update auth state on navigation
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // Update auth state after navigation (login/logout)
        this.checkAuthState();
      });
  }

  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  /**
   * Check and update the authentication state
   */
  checkAuthState(): void {
    this.isUserAdmin = this.jwtService.isAdmin();
    this.userEmail = this.jwtService.getUserEmail();
  }

  /**
   * Log the user out and navigate to login page
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
