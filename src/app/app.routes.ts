import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard'; // Única importación necesaria
import { LayoutComponent } from './shared/components/layout/layout.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { ProjectListComponent } from './features/admin/projects/project-list/project-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  
  // Envolvemos TODAS las rutas privadas (Admin y Cliente) dentro del LayoutComponent
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard], // authGuard ya verifica sesión y lee la propiedad 'data: { role }'
    children: [
      
      // ------------------------------------------
      // ZONA EXCLUSIVA PARA EL DUEÑO (ADMIN)
      // ------------------------------------------
      { 
        path: 'admin', 
        data: { role: 'admin' },
        children: [
          // Mantenemos tu Lazy Loading original
          { path: 'lazy', loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES) },
          // Componentes directos
          { path: 'dashboard', component: DashboardComponent },
          { path: 'projects', component: ProjectListComponent },
        ]
      },

      // ------------------------------------------
      // ZONA EXCLUSIVA PARA LOS CLIENTES
      // ------------------------------------------
      { 
        path: 'client', 
        data: { role: 'client' },
        children: [
          // Mantenemos tu Lazy Loading original para el cliente
          { path: 'lazy', loadChildren: () => import('./features/client/client.routes').then(m => m.CLIENT_ROUTES) },
          // Aquí agregaremos { path: 'portal', component: ClientPortalComponent }
        ]
      }
    ]
  },
  
  { path: '**', redirectTo: 'login' }
];