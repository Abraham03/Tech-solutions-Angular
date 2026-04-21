import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getProjects(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/projects`);
  }

  // Para rellenar el formulario al editar
  getProject(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/projects/${id}`);
  }

  // Guardar en base de datos
  createProject(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/projects`, data);
  }

  // Actualizar cambios
  updateProject(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/projects/${id}`, data);
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/projects/${id}`);
  }
}