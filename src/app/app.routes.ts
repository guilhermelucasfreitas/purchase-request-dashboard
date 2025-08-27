import { Routes } from '@angular/router';
import { LayoutTheme } from './layout-theme/layout-theme';

export const APP_ROUTE: Routes = [
  {
    path: '',
    component: LayoutTheme,
    children: [
      {
        path: '',
        redirectTo: '/tasks',
        pathMatch: 'full',
      },
      {
        path: 'tasks',
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/list-view/list-view').then((m) => m.ListView),
            title: 'Task Management',
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./pages/form-task-details/form-task-details').then((m) => m.FormTaskDetails),
            title: 'Create New Task',
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./pages/form-task-details/form-task-details').then((m) => m.FormTaskDetails),
            title: 'Edit Task',
          },
        ],
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/users/users').then((m) => m.Users),
        title: 'User Management',
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings').then((m) => m.Settings),
        title: 'Settings',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/tasks',
  },
];
