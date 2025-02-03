import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { AuthLayoutComponent } from './core/layout/auth-layout/auth-layout.component';
import { HomeComponent } from './routes/home/home.component';
import { LoginComponent } from './routes/auth/login/login.component';
import { RegisterComponent } from './routes/auth/register/register.component';
import { ProfileComponent } from './routes/auth/profile/profile.component';
import { authGuard } from './shared/services/auth/auth.guard';
import { IncomesComponent } from './routes/transactions/incomes/incomes.component';
import { ExpensesComponent } from './routes/transactions/expenses/expenses.component';
import { SavingsComponent } from './routes/transactions/savings/savings.component';
import { ReportsComponent } from './routes/transactions/reports/reports.component';
import { ForgotPwdComponent } from './routes/auth/forgot-pwd/forgot-pwd.component';
import { TermsPolicyComponent } from './routes/auth/terms-policy/terms-policy.component';
import { SettingsComponent } from './routes/settings/settings.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'incomes', component: IncomesComponent },
      { path: 'expenses', component: ExpensesComponent },
      { path: 'savings', component: SavingsComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'settings', component: SettingsComponent },
    ],
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'forgot-password', component: ForgotPwdComponent },
      { path: 'terms-and-privacy', component: TermsPolicyComponent },
    ],
  },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}