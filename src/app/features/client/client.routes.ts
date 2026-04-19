import { Routes } from '@angular/router';
import { PortalComponent } from './portal/portal.component';

export const CLIENT_ROUTES: Routes = [
  { path: '', redirectTo: 'portal', pathMatch: 'full' },
  { path: 'portal', component: PortalComponent }
  // Aquí agregaremos después 'billing', 'my-projects', etc.
];