import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './routes/home/home.component';
import { LoginComponent } from './routes/auth/login/login.component';
import { authGuard } from './shared/services/auth/auth.guard';
import { IncomesComponent } from './routes/transactions/incomes/incomes.component';
import { RegisterComponent } from './routes/auth/register/register.component';
import { ProfileComponent } from './routes/auth/profile/profile.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'profile', component: ProfileComponent },
    {
      path: 'home',
      component: HomeComponent,
      canActivate: [authGuard],
    },
    {
      path: 'incomes',
      component: IncomesComponent,
      canActivate: [authGuard]
    },

    { path: '**', redirectTo: '/login' },
  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule {}

