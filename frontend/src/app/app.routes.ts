import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './routes/home/home.component';
import { LoginComponent } from './routes/auth/login/login.component';
import { authGuard } from './shared/services/auth/auth.guard';
import { IncomesComponent } from './routes/transactions/incomes/incomes.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
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

