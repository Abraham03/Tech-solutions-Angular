import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard.service';
import { DashboardData } from '../../../core/models/dashboard.model';
import { MetricCardComponent } from '../../../shared/components/ui/metric-card/metric-card.component';
import { DataTableComponent, TableColumn } from '../../../shared/components/ui/data-table/data-table.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, MetricCardComponent, DataTableComponent],
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

  // Configuración de la tabla para proyectos recientes
  columns: TableColumn[] = [
    { key: 'name', label: 'Proyecto' },
    { 
      key: 'type', 
      label: 'Tipo',
      type: 'badge',
      badgeColors: {
        'web_app': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        'mobile_app': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
        'ecommerce': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
        'landing_page': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
      }
    },
    { 
      key: 'status', 
      label: 'Estado',
      type: 'badge',
      badgeColors: {
        'pending': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
        'development': 'bg-brand-primary/10 text-brand-primary',
        'testing': 'bg-status-warning/10 text-status-warning',
        'completed': 'bg-status-success/10 text-status-success',
        'cancelled': 'bg-status-error/10 text-status-error'
      }
    },
    { key: 'amount', label: 'Valor', type: 'currency' }
  ];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // 1. Corregimos el nombre del método a getDashboardSummary()
    this.dashboardService.getDashboardSummary().subscribe({
      // 2. Le decimos a TypeScript que 'data' es de tipo DashboardData
      next: (data: DashboardData) => {
        this.dashboardData.set(data);
        this.error.set(null);
        this.isLoading.set(false);
      },
      // 3. Le decimos a TypeScript que 'err' puede ser cualquier error (any)
      error: (err: any) => {
        console.error('Error cargando métricas:', err);
        this.loadMockDataFallback(); 
      }
    });
  }

  // Utilidad para formatear dinero de forma limpia
  formatMoney(amount: number): string {
    return this.currencyPipe.transform(amount, 'MXN', 'symbol', '1.2-2') || '$0.00';
  }

  // Fallback temporal si la API falla o está desconectada
  private loadMockDataFallback() {
    this.dashboardData.set({
      metrics: { mrr: 14500.00, activeClients: 12, activeProjects: 15, pendingInvoices: 3 },
      recentProjects: [
        { id: 1, name: 'Basket Pro', type: 'mobile_app', status: 'development', amount: 3500 },
        { id: 2, name: 'Sistema de Riego', type: 'web_app', status: 'testing', amount: 800 },
        { id: 3, name: 'E-commerce Ropa', type: 'ecommerce', status: 'pending', amount: 15000 }
      ]
    });
    this.error.set('Modo Local: Mostrando datos de prueba porque la API no respondió.');
    this.isLoading.set(false);
  }
}