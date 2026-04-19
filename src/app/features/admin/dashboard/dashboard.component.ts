import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DashboardService } from '../../../core/services/dashboard.service';
import { DashboardData } from '../../../core/models/dashboard.model';
import { MetricCardComponent } from '../../../shared/components/ui/metric-card/metric-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, MetricCardComponent],
  providers: [CurrencyPipe],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private currencyPipe = inject(CurrencyPipe);

  // Estados Reactivos (Signals)
  dashboardData = signal<DashboardData | null>(null);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.dashboardService.getDashboardSummary().subscribe({
      next: (data) => {
        this.dashboardData.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando métricas:', err);
        // Si Laravel aún no tiene el endpoint, cargaremos datos de prueba (Mock) provisionales
        this.loadMockDataFallback(); 
      }
    });
  }

  // Utilidad para formatear dinero de forma limpia
  formatMoney(amount: number): string {
    return this.currencyPipe.transform(amount, 'USD', 'symbol', '1.2-2') || '$0.00';
  }

  // Fallback temporal mientras construyes el endpoint en Laravel
  private loadMockDataFallback() {
    this.dashboardData.set({
      metrics: { mrr: 14500.00, activeClients: 12, activeProjects: 15, pendingInvoices: 3 },
      recentProjects: [
        { id: 1, name: 'Basket Pro', type: 'SaaS App', status: 'Activo', amount: 3500 },
        { id: 2, name: 'Sistema de Riego', type: 'Infraestructura', status: 'Mantenimiento', amount: 800 }
      ]
    });
    this.error.set('Modo Local: Mostrando datos de prueba porque la API no respondió.');
    this.isLoading.set(false);
  }
}