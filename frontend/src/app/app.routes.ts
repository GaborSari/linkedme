import { Routes } from '@angular/router';
import { RegistrationComponent } from './components/registration.component/registration.component';

const appRoutes: Routes = [
    {
      path: '',
      component: RegistrationComponent
    }
  ];

export const APP_ROUTES = appRoutes;