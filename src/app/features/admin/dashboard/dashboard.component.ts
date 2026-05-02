import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard.service';
import { DashboardData } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  providers: [CurrencyPipe],
  templateUrl: './dashboard.component.html',
  styles: [`
    :host { display: block; }

    /* ── Cards ────────────────────────────────────────────────────── */
    /* Dark mode por defecto (clase dark en <html>) */
    :host-context(html.dark) .dash-card {
      background: #141720;
      border: 1px solid #1e2235;
    }

    /* Light mode: sin clase dark en <html> */
    .dash-card {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      box-shadow: 0 1px 3px rgba(0,0,0,.06);
      border-radius: 14px;
      padding: 1rem 1.25rem;
    }

    :host-context(html.dark) .dash-card:hover {
      border-color: #2a3050;
      box-shadow: 0 4px 24px rgba(0,0,0,.3);
    }

    .dash-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,.08);
    }

    /* ── KPI helpers ──────────────────────────────────────────────── */
    .kpi-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #6b7280;
      margin-bottom: 4px;
    }

    /* ── KPI value ────────────────────────────────────────────────── */
    .kpi-value {
      font-size: 22px;
      font-weight: 700;
      color: #111827;
      line-height: 1.2;
    }

    :host-context(html.dark) .kpi-value { color: #f1f5f9; }

    .kpi-sub {
      font-size: 11px;
      font-weight: 500;
      margin-top: 4px;
    }

    /* ── Section title ────────────────────────────────────────────── */
    .section-title {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #6b7280;
      margin: 1.25rem 0 0.6rem;
      display: flex;
      align-items: center;
    }

    /* ── Status badge ─────────────────────────────────────────────── */
    .status-badge {
      display: inline-block;
      font-size: 10px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid transparent;
    }

    /* ── Col label (tablas) ───────────────────────────────────────── */
    .col-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #4b5563;
    }

    /* ── Nav tabs fondo light ─────────────────────────────────────── */
    :host-context(.light) .tabs-bar,
    :host-context([data-theme="light"]) .tabs-bar {
      background: #ffffff;
      border-color: #e5e7eb;
    }

    /* ── Scrollbar ────────────────────────────────────────────────── */
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #1e2235; border-radius: 99px; }
  `]
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private currencyPipe     = inject(CurrencyPipe);

  // ── State ─────────────────────────────────────────────────────────────
  dashboardData = signal<DashboardData | null>(null);
  isLoading     = signal(true);
  error         = signal<string | null>(null);
  maxRevenue    = signal(0);

  activeTab   = signal<'overview' | 'revenue' | 'services' | 'notifs'>('overview');
  notifFilter = signal<string>('all');

  readonly today = new Date().toLocaleDateString('es-MX', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  // Íconos Material Symbols (outlined) — más profesionales que mat-icon
  readonly tabs: { id: 'overview' | 'revenue' | 'services' | 'notifs'; label: string; icon: string }[] = [
    { id: 'overview', label: 'Resumen',       icon: 'grid_view'      },
    { id: 'revenue',  label: 'Ingresos',       icon: 'trending_up'   },
    { id: 'services', label: 'Servicios',       icon: 'dns'           },
    { id: 'notifs',   label: 'Notificaciones',  icon: 'notifications' },
  ];

  // ── Computed ──────────────────────────────────────────────────────────
  marginPct = computed(() => {
    const d = this.dashboardData();
    if (!d || d.metrics.mrr === 0) return 0;
    return Math.round((d.metrics.monthlyProfit / d.metrics.mrr) * 100);
  });

  // ── Lifecycle ─────────────────────────────────────────────────────────
  ngOnInit(): void { this.loadData(); }

  // ── Data ──────────────────────────────────────────────────────────────
  loadData(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.dashboardService.getDashboardSummary().subscribe({
      next: (data: DashboardData) => {
        if (data.revenueChart?.length) {
          const max = Math.max(...data.revenueChart.map(p => Number(p.total)));
          this.maxRevenue.set(max * 1.1);
        }
        this.dashboardData.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('[Dashboard]', err);
        this.error.set('No se pudo cargar el dashboard. Revisa tu conexión.');
        this.isLoading.set(false);
      }
    });
  }

  // ── Formatters ────────────────────────────────────────────────────────
  formatMoney(amount: number | string): string {
    const n = typeof amount === 'string' ? parseFloat(amount) : amount;
    return this.currencyPipe.transform(n, 'MXN', 'symbol', '1.0-0') ?? '$0';
  }

  // ── Chart ─────────────────────────────────────────────────────────────
  barHeight(total: number): number {
    const max = this.maxRevenue();
    return max > 0 ? Math.max((total / max) * 100, 2) : 2;
  }

  maxChartRevenue(chart: any[]): number {
    return Math.max(...chart.map(p => Number(p.total)));
  }

  // ── LTV ───────────────────────────────────────────────────────────────
  ltvPct(ltv: number, list: any[]): number {
    const max = Math.max(...list.map(c => c.ltv), 1);
    return Math.round((ltv / max) * 100);
  }

  // ── Project status ────────────────────────────────────────────────────
  statusLabel(status: string): string {
    const map: Record<string, string> = {
      completed:   'Completado',
      development: 'En desarrollo',
      quoted:      'Cotizado',
    };
    return map[status] ?? status;
  }

  statusBadgeClass(status: string): string {
    const map: Record<string, string> = {
      completed:   'bg-emerald-500/10 text-emerald-500 !border-emerald-500/20',
      development: 'bg-blue-500/10 text-blue-500 !border-blue-500/20',
      quoted:      'bg-slate-500/10 text-slate-400 !border-slate-500/20',
    };
    return map[status] ?? '';
  }

  // ── Urgency ───────────────────────────────────────────────────────────
  urgencyLabel(urgency: string): string {
    const map: Record<string, string> = {
      expired: 'Vencido', critical: 'Crítico',
      warning: 'Próximo', ok: 'Vigente',
    };
    return map[urgency] ?? urgency;
  }

  urgencyBadgeClass(urgency: string): string {
    const map: Record<string, string> = {
      expired:  'bg-red-500/10 text-red-500 !border-red-500/20',
      critical: 'bg-red-500/10 text-red-500 !border-red-500/20',
      warning:  'bg-amber-500/10 text-amber-500 !border-amber-500/20',
      ok:       'bg-emerald-500/10 text-emerald-500 !border-emerald-500/20',
    };
    return map[urgency] ?? '';
  }

  // ── Margins ───────────────────────────────────────────────────────────
  marginPctSvc(s: any): number {
    return s.mrr > 0 ? Math.round((s.margin_monthly / s.mrr) * 100) : 0;
  }

  cycleLabel(cycle: string): string {
    const map: Record<string, string> = {
      monthly: 'Mensual', quarterly: 'Trimestral',
      annually: 'Anual',  biennially: 'Bienal',
    };
    return map[cycle] ?? cycle;
  }

  // ── WhatsApp ──────────────────────────────────────────────────────────
  openWhatsApp(s: any): void {
    const msg = encodeURIComponent(
      `Hola ${s.client_name} 👋\nTe contactamos de *TechSolutions*.\n\nTu servicio *${s.name}* vence el *${s.expiration_date}* (en ${s.days_left} días).\n\n¿Deseas renovarlo? Te enviamos el link de pago de inmediato. 🙌`
    );
    const phone = s.client_phone?.replace(/\D/g, '') ?? '';
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  }

  // ── Notifications ─────────────────────────────────────────────────────
  notifChannels(summary: any) {
    return [
      { key: 'all',               label: 'Total',    icon: '🔔', val: summary.total,    color: '#f1f5f9' },
      { key: 'whatsapp_reminder', label: 'WhatsApp', icon: '💬', val: summary.whatsapp, color: '#25D366' },
      { key: 'email_invoice',     label: 'Email',    icon: '✉️',  val: summary.email,    color: '#60a5fa' },
      { key: 'push_alert',        label: 'Push',     icon: '📲', val: summary.push,     color: '#a78bfa' },
    ];
  }

  filteredNotifs(notifs: any[]): any[] {
    const f = this.notifFilter();
    return f === 'all' ? notifs : notifs.filter(n => n.type === f);
  }

  notifLabel(type: string): string {
    const map: Record<string, string> = {
      whatsapp_reminder: 'WhatsApp',
      email_invoice:     'Email',
      push_alert:        'Push',
    };
    return map[type] ?? type;
  }

  /** Material Symbol para el avatar de notificación */
  notifMaterialIcon(type: string): string {
    const map: Record<string, string> = {
      whatsapp_reminder: 'chat',
      email_invoice:     'mail',
      push_alert:        'notifications',
    };
    return map[type] ?? 'circle_notifications';
  }

  notifIconClass(type: string): string {
    const map: Record<string, string> = {
      whatsapp_reminder: 'bg-green-500/10 border-green-500/20 text-green-500',
      email_invoice:     'bg-blue-500/10 border-blue-500/20 text-blue-500',
      push_alert:        'bg-violet-500/10 border-violet-500/20 text-violet-500',
    };
    return map[type] ?? 'bg-slate-500/10 border-slate-500/20 text-slate-400';
  }

  notifBadgeClass(type: string): string {
    const map: Record<string, string> = {
      whatsapp_reminder: 'bg-green-500/10 text-green-500 !border-green-500/20',
      email_invoice:     'bg-blue-500/10 text-blue-500 !border-blue-500/20',
      push_alert:        'bg-violet-500/10 text-violet-500 !border-violet-500/20',
    };
    return map[type] ?? '';
  }
}