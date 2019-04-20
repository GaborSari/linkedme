import { Routes } from '@angular/router';
import { TestComponent } from './components/test.component/test.component';

const appRoutes: Routes = [
    {
      path: '',
      component: TestComponent
    }
  ];

export const APP_ROUTES = appRoutes;