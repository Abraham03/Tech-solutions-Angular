import { Routes } from '@angular/router';

// Layouts
import { PublicLayoutComponent } from './core/layouts/public-layout/public-layout.component';
import { LayoutComponent } from './shared/components/layout/layout.component'; // Admin/Client Layout

// Páginas Públicas
import { HomeComponent } from './features/public/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';

// Páginas Privadas (Admin)
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { ProjectListComponent } from './features/admin/projects/project-list/project-list.component';
import { ProjectFormComponent } from './features/admin/projects/project-form/project-form.component';
import { ClientListComponent } from './features/admin/clients/client-list/client-list.component';
import { ClientFormComponent } from './features/admin/clients/client-form/client-form.component';
import { UserListComponent } from './features/admin/users/user-list/user-list.component';
import { UserFormComponent } from './features/admin/users/user-form/user-form.component';
import { ServiceListComponent } from './features/admin/services/service-list/service-list.component';
import { ServiceFormComponent } from './features/admin/services/service-form/service-form.component';
import { PaymentListComponent } from './features/admin/payments/payment-list/payment-list.component';
import { PaymentFormComponent } from './features/admin/payments/payment-form/payment-form.component';

// Guards
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  
  // ------------------------------------------
  // ZONA PÚBLICA (Website de Tech Solutions)
  // ------------------------------------------
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomeComponent }, // techsolutions.com/
      // Si en el futuro creas /about o /contacto, irían aquí.
    ]
  },

  // ------------------------------------------
  // ZONA DE AUTENTICACIÓN
  // ------------------------------------------
  { path: 'auth/login', component: LoginComponent },
  
  // Mantenemos esta ruta por compatibilidad con tu código anterior
  { path: 'login', redirectTo: 'auth/login', pathMatch: 'full' },
  
  // ------------------------------------------
  // ZONA PRIVADA PROTEGIDA (Admin y Clientes)
  // ------------------------------------------
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard], // authGuard verifica sesión y lee 'data: { role }'
    children: [
      
      // ZONA EXCLUSIVA PARA EL DUEÑO (ADMIN)
      { 
        path: 'admin', 
        data: { role: 'admin' },
        children: [
          // Mantenemos tu Lazy Loading original
          { path: 'lazy', loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES) },
          
          { path: 'dashboard', component: DashboardComponent },
          
          // MÓDULO DE PROYECTOS
          { path: 'projects', component: ProjectListComponent },
          { path: 'projects/new', component: ProjectFormComponent },
          { path: 'projects/edit/:id', component: ProjectFormComponent },
          
          // MÓDULO DE CLIENTES
          { path: 'clients', component: ClientListComponent }, 
          { path: 'clients/new', component: ClientFormComponent }, 
          { path: 'clients/edit/:id', component: ClientFormComponent },

          // MÓDULO DE USUARIOS
          { path: 'users', component: UserListComponent },
          { path: 'users/new', component: UserFormComponent },
          { path: 'users/edit/:id', component: UserFormComponent },

          // MÓDULO DE PAGOS
          { path: 'payments', component: PaymentListComponent },
          { path: 'payments/new', component: PaymentFormComponent },
          { path: 'payments/edit/:id', component: PaymentFormComponent },

          // MÓDULO DE SERVICIOS
          { path: 'services', component: ServiceListComponent },
          { path: 'services/new', component: ServiceFormComponent },
          { path: 'services/edit/:id', component: ServiceFormComponent },
        ]
      },

      // ZONA EXCLUSIVA PARA LOS CLIENTES
      // ZONA EXCLUSIVA PARA LOS CLIENTES
      { 
        path: 'client', 
        data: { role: 'client' },
        // Quitamos el array 'children' y cargamos las rutas directamente
        loadChildren: () => import('./features/client/client.routes').then(m => m.CLIENT_ROUTES)
      }
    ]
  },
  
  // 404 - Cualquier ruta que no exista redirige a la página pública
  { path: '**', redirectTo: '' }
];