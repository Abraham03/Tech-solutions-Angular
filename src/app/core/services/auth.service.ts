import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { PushNotificationsService } from './push-notifications.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private push = inject(PushNotificationsService);
  private apiUrl = environment.apiUrl;

  // Signal reactivo para el estado del usuario
  public currentUser = signal<any | null>(null);

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  constructor() {
    // Solo rehidratamos si estamos en el navegador (no en prerender)
    if (this.isBrowser) {
      this.rehydrateAuth();
    }
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

        // FCM rota el token sin avisar, asi que lo reclamamos en cada arranque
        // con sesion activa y no solo al iniciar sesion.
        this.push.registerDevice();
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
        const freshUser = response.data || response;
        this.currentUser.set(freshUser);
        if (this.isBrowser) {
          localStorage.setItem('user_data', JSON.stringify(freshUser));
        }
      },
      error: () => {
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
        if (this.isBrowser) {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user_data', JSON.stringify(user));
        }

        // 2. Actualizar estado global reactivo
        this.currentUser.set(user);

        // 3. Registrar el dispositivo para notificaciones push.
        // Sin await: pedir el permiso no debe retrasar la entrada al panel.
        this.push.registerDevice();

        // 4. Redirigir según el rol
        this.redirectBasedOnRole(user.role);
      }),
      catchError((error: HttpErrorResponse) => {
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
    // Avisamos al backend ANTES de borrar nada del almacenamiento local: el
    // interceptor lee el Bearer de localStorage al suscribirse, y si lo
    // borraramos primero la peticion saldria sin autenticar. El servidor no
    // revocaria el token de Passport ni limpiaria el fcm_token, y este
    // navegador seguiria recibiendo los avisos de pagos despues de salir.
    if (this.isBrowser && this.getToken()) {
      this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
        error: (error) => {
          // La sesion local se cierra igual: no dejamos al usuario atrapado
          // dentro de la aplicacion porque el servidor no conteste.
          console.warn('No se pudo cerrar la sesion en el servidor:', error);
        }
      });
    }

    this.clearLocalSession();
  }

  private clearLocalSession() {
    // Limpieza total por seguridad
    if (this.isBrowser) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    return localStorage.getItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private redirectBasedOnRole(role: string) {
    if (role === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/client/dashboard']);
    }
  }
}