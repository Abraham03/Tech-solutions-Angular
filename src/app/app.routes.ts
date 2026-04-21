import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard'; // Única importación necesaria
import { LayoutComponent } from './shared/components/layout/layout.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { ProjectListComponent } from './features/admin/projects/project-list/project-list.component';
import { ClientListComponent } from './features/admin/clients/client-list/client-list.component';
import { ClientFormComponent } from './features/admin/clients/client-form/client-form.component';
import { ProjectFormComponent } from './features/admin/projects/project-form/project-form.component';
import { UserListComponent } from './features/admin/users/user-list/user-list.component';
import { UserFormComponent } from './features/admin/users/user-form/user-form.component';
import { ServiceListComponent } from './features/admin/services/service-list/service-list.component';
import { ServiceFormComponent } from './features/admin/services/service-form/service-form.component';

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
          

          // MÓDULO DE PROYECTOS (Formularios)
          { path: 'projects', component: ProjectListComponent },
          { path: 'projects/new', component: ProjectFormComponent },
          { path: 'projects/edit/:id', component: ProjectFormComponent },
          
          // MÓDULO DE CLIENTES (Orden de las rutas es importante)
          { path: 'clients', component: ClientListComponent }, 
          { path: 'clients/new', component: ClientFormComponent }, 
          { path: 'clients/edit/:id', component: ClientFormComponent },

          // MÓDULO DE USUARIOS
          { path: 'users', component: UserListComponent },
          { path: 'users/new', component: UserFormComponent },
          { path: 'users/edit/:id', component: UserFormComponent },

          // En el bloque 'admin':
          { path: 'services', component: ServiceListComponent },
          { path: 'services/new', component: ServiceFormComponent },
          { path: 'services/edit/:id', component: ServiceFormComponent },

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