import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard.service';
import { DashboardData } from '../../../core/models/dashboard.model';
import { MetricCardComponent } from '../../../shared/components/ui/metric-card/metric-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, MetricCardComponent],
  providers: [CurrencyPipe],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private currencyPipe     = inject(CurrencyPipe);

  // ── State ──────────────────────────────────────────────────────────────
  dashboardData = signal<DashboardData | null>(null);
  isLoading     = signal<boolean>(true);
  error         = signal<string | null>(null);

  /** Valor máximo para escalar las barras de la gráfica (con 10% de padding) */
  maxRevenue = signal<number>(0);

  /** Período seleccionado para la tarjeta de ingresos */
  revenueView = signal<'month' | 'year' | 'total'>('month');

  // ── Computed ───────────────────────────────────────────────────────────

  /** Ingreso mostrado según el botón activo */
  displayedRevenue = computed(() => {
    const data = this.dashboardData();
    if (!data) return 0;
    switch (this.revenueView()) {
      case 'month': return data.revenueThisMonth.total;
      case 'year':  return data.revenueThisYear.total;
      default:      return data.metrics.totalCollected;
    }
  });

  // ── Lifecycle ──────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadData();
  }

  // ── Methods ────────────────────────────────────────────────────────────
  loadData(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.dashboardService.getDashboardSummary().subscribe({
      next: (data: DashboardData) => {
        // Calcular techo de la gráfica
        if (data.revenueChart?.length) {
          const max = Math.max(...data.revenueChart.map(p => Number(p.total)));
          this.maxRevenue.set(max * 1.1);
        }
        this.dashboardData.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('[Dashboard] Error al cargar datos:', err);
        this.error.set('No se pudo cargar el dashboard. Revisa tu conexión.');
        this.isLoading.set(false);
      }
    });
  }

  setRevenueView(view: 'month' | 'year' | 'total'): void {
    this.revenueView.set(view);
  }

  formatMoney(amount: number | string): string {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return this.currencyPipe.transform(num, 'MXN', 'symbol', '1.2-2') ?? '$0.00';
  }

  /**
   * Helper para la gráfica: calcula el alto en % de cada barra.
   * Evita divisiones por cero.
   */
  barHeight(total: number): number {
    const max = this.maxRevenue();
    return max > 0 ? Math.max((total / max) * 100, 2) : 2;
  }

  /**
   * Devuelve la clase de color del punto de timeline
   * según el tipo de notificación.
   */
  notifDotClass(type: string): string {
    const map: Record<string, string> = {
      whatsapp_reminder: 'bg-green-500',
      email_invoice:     'bg-blue-500',
      push_alert:        'bg-purple-500',
    };
    return map[type] ?? 'bg-gray-400';
  }

  /**
   * Devuelve la etiqueta legible del tipo de notificación.
   */
  notifLabel(type: string): string {
    const map: Record<string, string> = {
      whatsapp_reminder: 'WhatsApp',
      email_invoice:     'Email',
      push_alert:        'Push',
    };
    return map[type] ?? type;
  }
}