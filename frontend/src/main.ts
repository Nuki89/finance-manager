import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/shared/services/auth/auth.interceptor';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
// import { enableProdMode } from '@angular/core';
// import { environment } from './environments/environment.prod';

// if (environment.production) {
//   enableProdMode();
// }

// ENABLE PROD MODE !! we I need to test this soulution !!

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor]) 
    ),
    provideAnimations(),
    provideToastr({
      timeOut: 3000,
      closeButton: true,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
      progressBar: true,
      progressAnimation: 'increasing',
    }),
    
  ],
}).catch((err) => console.error(err));

