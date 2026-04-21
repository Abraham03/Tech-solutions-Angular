import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getPayments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/payments`);
  }

  getPayment(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/payments/${id}`);
  }

  createPayment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/payments`, data);
  }

  updatePayment(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/payments/${id}`, data);
  }

  deletePayment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/payments/${id}`);
  }
}