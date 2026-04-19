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

  // En Laravel, un apiResource index responde en GET /projects
  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/projects`);
  }

  // Preparando el terreno para eliminar (SoftDelete en Laravel)
  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/projects/${id}`);
  }
}