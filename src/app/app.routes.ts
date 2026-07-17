import { Routes } from '@angular/router';

// Layouts y páginas críticas (se cargan de inmediato porque son la home pública)
import { PublicLayoutComponent } from './core/layouts/public-layout/public-layout.component';
import { HomeComponent } from './features/public/home/home.component';

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
      { path: '', component: HomeComponent },
    ]
  },

  // ------------------------------------------
  // ZONA DE AUTENTICACIÓN (lazy)
  // ------------------------------------------
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  { path: 'login', redirectTo: 'auth/login', pathMatch: 'full' },

  // ------------------------------------------
  // ZONA PRIVADA PROTEGIDA (Admin y Clientes) - todo lazy
  // ------------------------------------------
  {
    path: '',
    loadComponent: () =>
      import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [

      // ADMIN
      {
        path: 'admin',
        data: { role: 'admin' },
        children: [
          { path: 'lazy', loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES) },

          {
            path: 'dashboard',
            loadComponent: () =>
              import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
          },

          // Proyectos
          {
            path: 'projects',
            loadComponent: () =>
              import('./features/admin/projects/project-list/project-list.component').then(m => m.ProjectListComponent)
          },
          {
            path: 'projects/new',
            loadComponent: () =>
              import('./features/admin/projects/project-form/project-form.component').then(m => m.ProjectFormComponent)
          },
          {
            path: 'projects/edit/:id',
            loadComponent: () =>
              import('./features/admin/projects/project-form/project-form.component').then(m => m.ProjectFormComponent)
          },

          // Clientes
          {
            path: 'clients',
            loadComponent: () =>
              import('./features/admin/clients/client-list/client-list.component').then(m => m.ClientListComponent)
          },
          {
            path: 'clients/new',
            loadComponent: () =>
              import('./features/admin/clients/client-form/client-form.component').then(m => m.ClientFormComponent)
          },
          {
            path: 'clients/edit/:id',
            loadComponent: () =>
              import('./features/admin/clients/client-form/client-form.component').then(m => m.ClientFormComponent)
          },

          // Usuarios
          {
            path: 'users',
            loadComponent: () =>
              import('./features/admin/users/user-list/user-list.component').then(m => m.UserListComponent)
          },
          {
            path: 'users/new',
            loadComponent: () =>
              import('./features/admin/users/user-form/user-form.component').then(m => m.UserFormComponent)
          },
          {
            path: 'users/edit/:id',
            loadComponent: () =>
              import('./features/admin/users/user-form/user-form.component').then(m => m.UserFormComponent)
          },

          // Pagos
          {
            path: 'payments',
            loadComponent: () =>
              import('./features/admin/payments/payment-list/payment-list.component').then(m => m.PaymentListComponent)
          },
          {
            path: 'payments/new',
            loadComponent: () =>
              import('./features/admin/payments/payment-form/payment-form.component').then(m => m.PaymentFormComponent)
          },
          {
            path: 'payments/edit/:id',
            loadComponent: () =>
              import('./features/admin/payments/payment-form/payment-form.component').then(m => m.PaymentFormComponent)
          },

          // Servicios
          {
            path: 'services',
            loadComponent: () =>
              import('./features/admin/services/service-list/service-list.component').then(m => m.ServiceListComponent)
          },
          {
            path: 'services/new',
            loadComponent: () =>
              import('./features/admin/services/service-form/service-form.component').then(m => m.ServiceFormComponent)
          },
          {
            path: 'services/edit/:id',
            loadComponent: () =>
              import('./features/admin/services/service-form/service-form.component').then(m => m.ServiceFormComponent)
          },
        ]
      },

      // CLIENTES
      {
        path: 'client',
        data: { role: 'client' },
        loadChildren: () => import('./features/client/client.routes').then(m => m.CLIENT_ROUTES)
      }
    ]
  },

  // 404 → home
  { path: '**', redirectTo: '' }
];