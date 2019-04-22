import { Routes } from '@angular/router';
import { RegistrationComponent } from './components/registration.component/registration.component';
import { HomeComponent } from './components/home.component/home.component';
import { JobsComponent } from './components/jobs.component/jobs.component';

const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'registration',
    component: RegistrationComponent
  },
  {
    path: 'jobs',
    component: JobsComponent
  },
  {
    path: '**',
    component: HomeComponent
  }
];

export const APP_ROUTES = appRoutes;