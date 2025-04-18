import { routes } from './app.routes';

import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

import { BranchesService } from '../service/branches/branches.service';
import { DashboardService } from '../service/dashboard/dashboard.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(BrowserAnimationsModule),
    BranchesService,
    DashboardService
  ]
};
