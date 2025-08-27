import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';

import { App } from './app/app';
import { APP_ROUTE } from './app/app.routes';

bootstrapApplication(App, {
  providers: [provideZonelessChangeDetection(), provideRouter(APP_ROUTE), provideHttpClient()],
}).catch((err) => console.error(err));