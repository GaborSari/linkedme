import { Routes } from '@angular/router';
import { RegistrationComponent } from './components/registration.component/registration.component';
import { HomeComponent } from './components/home.component/home.component';
import { JobsComponent } from './components/jobs.component/jobs.component';
import { MyapplicationsComponent } from './components/myapplications.component/myapplications.component';
import { IncomingapplicationsComponent } from './components/incomingapplications.component/incomingapplications.component';

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
    path: 'myapplications',
    component: MyapplicationsComponent
  },
  {
    path: 'incomingapplications',
    component: IncomingapplicationsComponent
  },
  {
    path: '**',
    component: HomeComponent
  }
];

export const APP_ROUTES = appRoutes;