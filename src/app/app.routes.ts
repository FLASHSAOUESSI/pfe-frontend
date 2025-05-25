import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { SetPasswordComponent } from './auth/set-password/set-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AccueilComponent } from './accueil/accueil.component';
import { EnqueteComponent } from './enquete/enquete.component';
import { ContactComponent } from './contact/contact.component';
import { DemandeInformationComponent } from './demande-information/demande-information.component';
import { ParametresComponent } from './parametres/parametres.component';
import { ResultatsComponent } from './resultats/resultats.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent }, // ✅ Add route for login
    { path: 'register', component: RegisterComponent }, // ✅ Add route for register
    {path : 'set-password', component: SetPasswordComponent},
    {path : 'forgot-password',component : ForgotPasswordComponent},
    { path: 'contact',component: ContactComponent},
    {path: 'demande-information',component :DemandeInformationComponent},
    { path: 'parametres', component: ParametresComponent},
    { path: 'resultats', component: ResultatsComponent},

   { path: 'accueil', component: AccueilComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirection par défaut

  { path: 'enquete', component: EnqueteComponent },
  { path: '', redirectTo: '/accueil', pathMatch: 'full' }
  
];
