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

  dashboardData = signal<DashboardData | null>(null);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Tabla: Proyectos con Balance
  columns: TableColumn[] = [
    { key: 'name', label: 'Proyecto' },
    { 
      key: 'status', 
      label: 'Estado',
      type: 'badge',
      badgeColors: {
        'pending': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
        'development': 'bg-brand-primary/10 text-brand-primary',
        'testing': 'bg-status-warning/10 text-status-warning',
        'completed': 'bg-status-success/10 text-status-success'
      }
    },
    { key: 'amount', label: 'Total', type: 'currency' },
    { key: 'balance', label: 'Resta', type: 'currency' }
  ];

  // Tabla: Alertas de Vencimiento
  expiringColumns: TableColumn[] = [
    { key: 'name', label: 'Servicio' },
    { key: 'client_name', label: 'Cliente' },
    { key: 'expires_at', label: 'Vence el' }, // Omitimos el type 'date' para evitar el error de TypeScript
    { key: 'profit_margin', label: 'Margen', type: 'currency' }
  ];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.dashboardService.getDashboardSummary().subscribe({
      next: (data: DashboardData) => {
        this.dashboardData.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error:', err);
        this.loadMockDataFallback();
      }
    });
  }

  formatMoney(amount: number): string {
    return this.currencyPipe.transform(amount, 'MXN', 'symbol', '1.2-2') || '$0.00';
  }

  private loadMockDataFallback() {
    this.dashboardData.set({
      metrics: { 
        mrr: 14500, activeClients: 12, activeProjects: 15, 
        pendingInvoices: 3, monthlyProfit: 8200, totalReceivable: 45000 
      },
      recentProjects: [
        { id: 1, name: 'Basket Pro', type: 'mobile_app', status: 'development', amount: 12000, balance: 3000 },
        { id: 2, name: 'E-commerce', type: 'ecommerce', status: 'pending', amount: 25000, balance: 25000 }
      ],
      expiringServices: [
        { id: 1, name: 'Hosting Anual', client_name: 'Abraham Ch.', expires_at: '2026-05-10', profit_margin: 450 },
        { id: 2, name: 'Mantenimiento', client_name: 'Tech Solutions', expires_at: '2026-05-15', profit_margin: 800 }
      ],
      revenueChart: [
        { month: '2026-04', total: 12000 }, { month: '2026-03', total: 9500 }
      ]
    });
    this.error.set('Modo Local: Datos de prueba activos.');
    this.isLoading.set(false);
  }
}