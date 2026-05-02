import { Routes } from '@angular/router';

export const CLIENT_ROUTES: Routes = [
  {
    path: '',
    // Opcional: Si quieres que el portal del cliente tenga un layout diferente, 
    // podrías cargarlo aquí. Si usa el mismo layout que el admin, déjalo así.
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./portal/portal.component').then(m => m.PortalComponent)
      },
      // Redirigir por defecto al dashboard
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];