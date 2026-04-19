import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './shared/components/layout/layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  
  // Envolvemos las rutas privadas dentro del LayoutComponent
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { 
        path: 'admin', 
        data: { role: 'admin' },
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES) 
      },
      { 
        path: 'client', 
        data: { role: 'client' },
        loadChildren: () => import('./features/client/client.routes').then(m => m.CLIENT_ROUTES) 
      }
    ]
  },
  
  { path: '**', redirectTo: 'login' }
];