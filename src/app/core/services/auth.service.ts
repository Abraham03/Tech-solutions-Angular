import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;

  // Signal reactivo para el estado del usuario
  public currentUser = signal<any | null>(null);

  constructor() {
    // Cuando Angular arranca, rehidratamos la sesión inmediatamente
    this.rehydrateAuth();
  }

  /**
   * Lee el almacenamiento persistente para restaurar la sesión instantáneamente
   * tras presionar F5, y verifica la validez con el servidor.
   */
  private rehydrateAuth() {
    const token = this.getToken();
    const savedUser = localStorage.getItem('user_data');

    if (token && savedUser) {
      try {
        // Restauración síncrona (Evita el parpadeo blanco en el menú)
        this.currentUser.set(JSON.parse(savedUser));
        
        // Validación asíncrona de seguridad con el backend
        this.validateSessionSilently();
      } catch (error) {
        console.error('Corrupción en datos de sesión local. Limpiando...', error);
        this.logout();
      }
    }
  }

  /**
   * Llama a tu endpoint /me para asegurar que el token no haya expirado
   * o el usuario no haya sido deshabilitado en la base de datos.
   */
  private validateSessionSilently() {
    this.http.get<any>(`${this.apiUrl}/me`).subscribe({
      next: (response) => {
        // Actualizamos con datos frescos de la BD si algo cambió
        const freshUser = response.data || response; // Depende de cómo responda tu /me
        this.currentUser.set(freshUser);
        localStorage.setItem('user_data', JSON.stringify(freshUser));
      },
      error: () => {
        // Si el servidor rechaza el token (401), cerramos sesión forzosamente
        this.logout();
      }
    });
  }

  login(credentials: { email: string; password: string }) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        const token = response.data.access_token;
        const user = response.data.user;

        // 1. Guardar token y datos del usuario persistentes
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
        
        // 2. Actualizar estado global reactivo
        this.currentUser.set(user);
        
        // 3. Redirigir según el rol
        this.redirectBasedOnRole(user.role);
      }),
      catchError((error: HttpErrorResponse) => {
        // Manejo de errores profesional según el código de estado HTTP
        let errorMessage = 'Ocurrió un error inesperado al conectar con el servidor.';
        
        if (error.status === 401) {
          errorMessage = 'Correo o contraseña incorrectos.';
        } else if (error.status === 422) {
          errorMessage = 'Los datos enviados no tienen el formato correcto.';
        } else if (error.status === 0) {
          errorMessage = 'No hay conexión con el servidor. Revisa tu internet.';
        }

        console.error('Error de autenticación:', error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  logout() {
    // Limpieza total por seguridad
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private redirectBasedOnRole(role: string) {
    if (role === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/client/portal']);
    }
  }
}