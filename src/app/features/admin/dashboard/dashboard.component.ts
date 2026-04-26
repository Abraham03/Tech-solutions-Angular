import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard.service';
import { DashboardData, RevenuePoint } from '../../../core/models/dashboard.model';
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
  // Señal para calcular el tope de la gráfica dinámica de CSS
  maxRevenue = signal<number>(0);
  revenuePeriod = signal<'monthly' | 'annual' | 'total'>('monthly');

  // Calcula dinámicamente qué ingreso mostrar según la pestaña seleccionada
  displayedRevenue = computed(() => {
    const data = this.dashboardData();
    if (!data) return 0;
    if (this.revenuePeriod() === 'monthly') return data.metrics.monthlyRevenue;
    if (this.revenuePeriod() === 'annual') return data.metrics.annualRevenue;
    return data.metrics.totalRevenue;
  });

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
    { key: 'expiration_date', label: 'Vence el' },
    { key: 'profit_margin', label: 'Margen', type: 'currency' }
  ];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.dashboardService.getDashboardSummary().subscribe({
      next: (data: DashboardData) => {
        // Preparar datos para la gráfica asegurando que sean numéricos
        if (data.revenueChart && data.revenueChart.length > 0) {
          data.revenueChart = data.revenueChart.map(item => ({
            ...item,
            total: Number(item.total)
          }));
          this.calculateMaxRevenue(data.revenueChart);
        }

        this.dashboardData.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error:', err);
        this.error.set('Error al conectar con el servidor.');
      }
    });
  }

  // Permite cambiar la vista desde el HTML
  setRevenuePeriod(period: 'monthly' | 'annual' | 'total') {
    this.revenuePeriod.set(period);
  }

  // Calcula el valor máximo + 10% para la escala de la gráfica de barras
  private calculateMaxRevenue(chartData: RevenuePoint[]) {
    if (!chartData || chartData.length === 0) return;
    const max = Math.max(...chartData.map(item => item.total));
    this.maxRevenue.set(max * 1.1); 
  }

  formatMoney(amount: number | string): string {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return this.currencyPipe.transform(numAmount, 'MXN', 'symbol', '1.2-2') || '$0.00';
  }


}