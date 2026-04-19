import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { DashboardData } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getDashboardSummary(): Observable<DashboardData> {
    // El JWT Interceptor que ya configuramos añadirá automáticamente el token aquí
    return this.http.get<DashboardData>(`${this.apiUrl}/admin/dashboard`);
  }
}