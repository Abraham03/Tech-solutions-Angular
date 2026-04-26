import { Component, inject, OnInit, signal, computed } from '@angular/core';
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
  
  // Altura de gráfica
  maxRevenue = signal<number>(0);

  // Control para vista de ingresos
  revenueView = signal<'month' | 'year' | 'total'>('month');

  // Computed para mostrar el ingreso según el botón seleccionado
  displayedRevenue = computed(() => {
    const data = this.dashboardData();
    if (!data) return 0;
    if (this.revenueView() === 'month') return data.revenueThisMonth.total;
    if (this.revenueView() === 'year') return data.revenueThisYear.total;
    return data.metrics.totalCollected;
  });

  // Tablas
  columns: TableColumn[] = [
    { key: 'name', label: 'Proyecto' },
    { 
      key: 'status', label: 'Estado', type: 'badge',
      badgeColors: {
        'pending': 'bg-gray-100 text-gray-800',
        'development': 'bg-brand-primary/10 text-brand-primary',
        'completed': 'bg-status-success/10 text-status-success'
      }
    },
    { key: 'amount', label: 'Total', type: 'currency' },
    { key: 'balance', label: 'Resta', type: 'currency' }
  ];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.dashboardService.getDashboardSummary().subscribe({
      next: (data: DashboardData) => {
        if (data.revenueChart && data.revenueChart.length > 0) {
          this.maxRevenue.set(Math.max(...data.revenueChart.map(item => Number(item.total))) * 1.1);
        }
        this.dashboardData.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error:', err);
        this.error.set('No se pudo cargar el dashboard. Revisa la conexión.');
        this.isLoading.set(false);
      }
    });
  }

  setRevenueView(view: 'month' | 'year' | 'total') {
    this.revenueView.set(view);
  }

  formatMoney(amount: number | string): string {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return this.currencyPipe.transform(num, 'MXN', 'symbol', '1.2-2') || '$0.00';
  }
}