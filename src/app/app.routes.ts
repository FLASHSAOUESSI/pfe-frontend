import { Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { StatisticsDashboardComponent } from './admin/statistics-dashboard/statistics-dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { SetPasswordComponent } from './auth/set-password/set-password.component';
import { ContactComponent } from './contact/contact.component';
import { DemandeInformationComponent } from './demande-information/demande-information.component';
import { EnqueteComponent } from './enquete/enquete.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { adminGuard } from './guards/admin.guard';
import { ParametresComponent } from './parametres/parametres.component';
import { ResultatsComponent } from './resultats/resultats.component';
import { MessageManagementComponent } from './admin/message-management/message-management.component';
import { EnqueteAnalysisComponent } from './admin/components/enquete-analysis/enquete-analysis.component';
import { TypeEnqueteManagementComponent } from './admin/components/type-enquete-management/type-enquete-management.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent }, // ✅ Add route for login
  { path: 'register', component: RegisterComponent }, // ✅ Add route for register
  { path: 'set-password', component: SetPasswordComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'demande-information', component: DemandeInformationComponent },
  { path: 'parametres', component: ParametresComponent },
  { path: 'resultats', component: ResultatsComponent },
  { path: 'admin', component: AdminPanelComponent, canActivate: [adminGuard] },
  {
    path: 'admin/utilisateurs',
    component: AdminPanelComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'admin/enquetes',
    component: EnqueteAnalysisComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'admin/parametres',
    component: AdminPanelComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'admin/statistiques',
    component: StatisticsDashboardComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'admin/messages',
    component: MessageManagementComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'admin/type-enquete',
    component: TypeEnqueteManagementComponent,
    canActivate: [adminGuard],
  },
  { path: 'accueil', component: AccueilComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirection par défaut

  { path: 'enquete', component: EnqueteComponent },
  { path: '', redirectTo: '/accueil', pathMatch: 'full' },
];
