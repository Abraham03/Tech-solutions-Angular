import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  login(credentials: { email: string; password: string }) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        // Leemos la estructura exacta de tu backend
        const token = response.data.access_token;
        const user = response.data.user;

        // 1. Guardar token
        localStorage.setItem('auth_token', token);
        
        // 2. Actualizar estado global
        this.currentUser.set(user);
        
        // 3. Redirigir según el rol
        this.redirectBasedOnRole(user.role);
      }),
      catchError(error => {
        console.error('Error de autenticación', error);
        return throwError(() => new Error('Credenciales incorrectas'));
      })
    );
  }

  logout() {
    localStorage.removeItem('auth_token');
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