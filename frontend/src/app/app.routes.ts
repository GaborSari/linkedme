import { Routes } from '@angular/router';
import { MoviesComponent } from './components/movies.component/movies.component';

const appRoutes: Routes = [
    {
      path: '',
      component: MoviesComponent
    }
  ];

  export const APP_ROUTES = appRoutes;