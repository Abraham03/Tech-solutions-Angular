import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { DashboardData } from '../models/dashboard.model';
import { ListParams, Paginated } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  /**
   * Metricas y recortes cortos para el primer pintado.
   * Cada pestana pide luego su pagina a los metodos de abajo.
   */
  getDashboardSummary(): Observable<DashboardData> {
    // El JWT Interceptor que ya configuramos añadirá automáticamente el token aquí
    return this.http.get<DashboardData>(`${this.apiUrl}/admin/dashboard`);
  }

  // ── Listados paginados, uno por pestaña ─────────────────────────────────

  getRecentProjects(params: ListParams = {}): Observable<Paginated<any>> {
    return this.http.get<Paginated<any>>(`${this.apiUrl}/admin/dashboard/recent-projects`, {
      params: buildParams(params)
    });
  }

  getClientLtv(params: ListParams = {}): Observable<Paginated<any>> {
    return this.http.get<Paginated<any>>(`${this.apiUrl}/admin/dashboard/client-ltv`, {
      params: buildParams(params)
    });
  }

  /** `days` amplía la ventana de vencimiento; el backend la acota a 365. */
  getExpiringServices(params: ListParams = {}, days?: number): Observable<Paginated<any>> {
    let httpParams = buildParams(params);

    if (days) {
      httpParams = httpParams.set('days', days);
    }

    return this.http.get<Paginated<any>>(`${this.apiUrl}/admin/dashboard/expiring-services`, {
      params: httpParams
    });
  }

  getServiceMargins(params: ListParams = {}): Observable<Paginated<any>> {
    return this.http.get<Paginated<any>>(`${this.apiUrl}/admin/dashboard/service-margins`, {
      params: buildParams(params)
    });
  }

  /**
   * `type` filtra por canal. Va al servidor a propósito: filtrarlo en el
   * navegador solo miraría la página cargada.
   */
  getNotifications(params: ListParams = {}, type?: string): Observable<Paginated<any>> {
    let httpParams = buildParams(params);

    if (type && type !== 'all') {
      httpParams = httpParams.set('type', type);
    }

    return this.http.get<Paginated<any>>(`${this.apiUrl}/admin/dashboard/notifications`, {
      params: httpParams
    });
  }
}

/**
 * Solo se mandan los parámetros con valor. Enviar search vacío haría que el
 * backend filtrara por cadena vacía en vez de no filtrar.
 */
function buildParams(params: ListParams): HttpParams {
  let httpParams = new HttpParams();

  if (params.page) {
    httpParams = httpParams.set('page', params.page);
  }
  if (params.perPage) {
    httpParams = httpParams.set('per_page', params.perPage);
  }
  if (params.search?.trim()) {
    httpParams = httpParams.set('search', params.search.trim());
  }

  return httpParams;
}
