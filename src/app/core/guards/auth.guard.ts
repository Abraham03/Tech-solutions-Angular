import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // Aquí puedes agregar lógica adicional para verificar Roles específicos
    // leyendo route.data['role'] si necesitas proteger rutas de admin contra clientes
    const expectedRole = route.data['role'];
    const currentUser = authService.currentUser();
    
    if (expectedRole && currentUser && currentUser.role !== expectedRole) {
      router.navigate(['/login']);
      return false;
    }
    
    return true;
  }

  router.navigate(['/login']);
  return false;
};