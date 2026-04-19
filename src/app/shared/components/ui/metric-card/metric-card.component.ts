import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="ui-card p-6">
      <div class="flex justify-between items-start">
        <span class="text-gray-500 dark:text-gray-400 text-sm font-medium">{{ title() }}</span>
        <div class="p-2 rounded-lg" [ngClass]="iconContainerClass()">
          <mat-icon class="scale-75">{{ icon() }}</mat-icon>
        </div>
      </div>
      <h3 class="text-2xl font-bold text-gray-900 dark:text-white mt-4">{{ value() }}</h3>
      <span class="text-xs font-medium" [ngClass]="trendColorClass()">{{ trend() }}</span>
    </div>
  `
})
export class MetricCardComponent {
  // Inputs modernos de Angular 19
  title = input.required<string>();
  value = input.required<string | number>();
  icon = input.required<string>();
  iconContainerClass = input<string>('');
  trend = input<string>('');
  trendColorClass = input<string>('text-gray-500');
}