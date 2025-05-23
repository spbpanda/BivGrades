import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    },
    {
        path: 'frontend-developers',
        loadComponent: () => import('./pages/developers/frontend-developers/frontend-developers.component').then(m => m.FrontendDevelopersComponent),
    },
    {
        path: 'backend-developers',
        loadComponent: () => import('./pages/developers/backend-developers/backend-developers.component').then(m => m.BackendDevelopersComponent),
    },
    {
        path: '**',
        redirectTo: '/'
    }
];
