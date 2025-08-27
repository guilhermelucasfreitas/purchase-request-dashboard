import { Routes } from '@angular/router';
import { LayoutTheme } from './layout-theme/layout-theme';


export const routes: Routes = [
  {
    path: '',
    component: LayoutTheme,
    children: [
      {
        path: '',
        redirectTo: '/tasks',
        pathMatch: 'full'
      },
      {
        path: 'tasks',
        loadComponent: () => import('./pages/list-view/list-view').then(m => m.ListView)
      },
    ]
  },
  {
    path: '**',
    redirectTo: '/tasks'
  }
];