import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => {
      return import('./components/home/home').then((m) => m.Home);
    },
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => {
          return import('./components/auth/login/login').then((m) => m.Login);
        },
      },
      {
        path: 'signup',
        loadComponent: () => {
          return import('./components/auth/signup/signup').then(
            (m) => m.Signup
          );
        },
      },
    ],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard').then((m) => m.Dashboard),
  },
];
