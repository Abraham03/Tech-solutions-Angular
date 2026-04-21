import { Component, input, output, computed, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'currency' | 'badge';
  badgeColors?: Record<string, string>;
}

export interface TableActionConfig {
  icon: string;
  tooltip: string;
  actionName: string;
  colorClass: string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  providers: [CurrencyPipe],
  templateUrl: './data-table.component.html'
})
export class DataTableComponent {
  title = input<string>('Registros');
  columns = input.required<TableColumn[]>();
  data = input.required<any[]>();
  actions = input<TableActionConfig[]>([]);
  
  // NUEVO INPUT: Controla la visibilidad del botón de creación (por defecto es true)
  showCreateButton = input<boolean>(true);

  actionClicked = output<{ action: string; row: any }>();
  createClicked = output<void>();

  searchTerm = signal('');

  constructor(private currencyPipe: CurrencyPipe) {}

  filteredData = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.data();

    return this.data().filter(row => {
      return this.columns().some(col => {
        const val = row[col.key];
        return val != null && val.toString().toLowerCase().includes(term);
      });
    });
  });

  onAction(actionName: string, row: any) {
    this.actionClicked.emit({ action: actionName, row });
  }

  formatCurrency(value: number): string {
    return this.currencyPipe.transform(value, 'MXN', 'symbol', '1.2-2') || '$0.00';
  }
}