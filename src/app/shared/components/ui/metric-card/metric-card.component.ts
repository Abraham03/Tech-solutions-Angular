import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="metric-card group">

      <!-- Encabezado: label + ícono -->
      <div class="flex justify-between items-start mb-4">
        <p class="metric-label">{{ title() }}</p>
        <div
          class="p-2 rounded-xl transition-transform duration-200 group-hover:scale-110"
          [ngClass]="iconContainerClass()">
          <!-- Material Symbols Outlined (más moderno que mat-icon) -->
          <span class="material-symbols-outlined text-[20px] leading-none">{{ icon() }}</span>
        </div>
      </div>

      <!-- Valor principal -->
      <p class="metric-value">{{ value() }}</p>

      <!-- Trend / subtítulo -->
      @if (trend()) {
        <div class="flex items-center gap-1 mt-2">
          <span
            class="material-symbols-outlined text-[14px] leading-none"
            [ngClass]="trendColorClass()">
            {{ trendIcon() }}
          </span>
          <span class="text-xs font-medium" [ngClass]="trendColorClass()">{{ trend() }}</span>
        </div>
      }

    </div>
  `,
  styles: [`
    .metric-card {
      background: #141720;
      border: 1px solid #1e2235;
      border-radius: 14px;
      padding: 1.1rem 1.25rem;
      position: relative;
      overflow: hidden;
      transition: box-shadow .2s, border-color .2s;
    }

    .metric-card:hover {
      border-color: #2a3050;
      box-shadow: 0 4px 24px rgba(0,0,0,.3);
    }

    /* Light mode */
    :host-context(.light) .metric-card,
    :host-context([data-theme="light"]) .metric-card {
      background: #ffffff;
      border-color: #e5e7eb;
      box-shadow: 0 1px 3px rgba(0,0,0,.06);
    }

    :host-context(.light) .metric-card:hover,
    :host-context([data-theme="light"]) .metric-card:hover {
      border-color: #d1d5db;
      box-shadow: 0 4px 12px rgba(0,0,0,.08);
    }

    .metric-label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      color: #6b7280;
      line-height: 1.3;
    }

    .metric-value {
      font-size: 26px;
      font-weight: 700;
      color: #f1f5f9;
      line-height: 1.15;
      letter-spacing: -0.02em;
    }

    :host-context(.light) .metric-value,
    :host-context([data-theme="light"]) .metric-value {
      color: #111827;
    }
  `]
})
export class MetricCardComponent {
  title              = input.required<string>();
  value              = input.required<string | number>();
  /** Nombre del ícono en Material Symbols Outlined */
  icon               = input.required<string>();
  iconContainerClass = input<string>('bg-blue-500/10 text-blue-500');
  trend              = input<string>('');
  trendColorClass    = input<string>('text-slate-500');
  /** 'up' | 'down' | 'neutral' — controla el ícono de flecha */
  trendDirection     = input<'up' | 'down' | 'neutral'>('neutral');

  trendIcon(): string {
    const map = { up: 'trending_up', down: 'trending_down', neutral: 'remove' };
    return map[this.trendDirection()];
  }
}