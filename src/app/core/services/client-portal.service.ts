import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientPortalService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Obtiene el resumen del dashboard exclusivo del cliente logueado
  getDashboardSummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/client/dashboard`);
  }
}