import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getClients(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/clients`);
  }

  // Obtener un solo cliente (Para la edición)
  getClient(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/clients/${id}`);
  }

  // Crear cliente
  createClient(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/clients`, data);
  }

  // Actualizar cliente
  updateClient(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/clients/${id}`, data);
  }

  deleteClient(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/clients/${id}`);
  }
}