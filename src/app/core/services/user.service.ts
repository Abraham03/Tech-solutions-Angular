import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { ListParams, Paginated } from '../models/pagination.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  /**
   * Listado paginado. page, perPage y search viajan al servidor: la
   * busqueda mira toda la tabla y no solo la pagina cargada.
   */
  getUsers(params: ListParams = {}): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/users`, {
      params: buildListParams(params)
    });
  }

  getUser(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/users/${id}`);
  }

  createUser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/users`, data);
  }

  updateUser(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/users/${id}`, data);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/users/${id}`);
  }
}

/**
 * Solo se mandan los parametros con valor. Enviar search vacio haria que el
 * backend filtrara por cadena vacia en vez de no filtrar.
 */
function buildListParams(params: ListParams): HttpParams {
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
