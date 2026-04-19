import { Component, input, output, computed, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

// Contratos (Interfaces) para hacer el componente genérico
export interface TableColumn {
  key: string;           // El nombre de la propiedad en el objeto (ej. 'name')
  label: string;         // El texto que verá el usuario en el encabezado (ej. 'Nombre')
  type?: 'text' | 'currency' | 'badge'; // Cómo se va a renderizar
  badgeColors?: Record<string, string>; // Colores dinámicos para los estados
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
  // Inputs usando la nueva API de Signals de Angular 19
  title = input<string>('Registros');
  columns = input.required<TableColumn[]>();
  data = input.required<any[]>();
  actions = input<TableActionConfig[]>([]);

  // Outputs para emitir eventos al componente padre (ej. cuando den clic en "Editar")
  actionClicked = output<{ action: string; row: any }>();
  createClicked = output<void>();

  // Estado interno para el buscador
  searchTerm = signal('');

  constructor(private currencyPipe: CurrencyPipe) {}

  // Computed Signal: Filtra los datos automáticamente si el usuario escribe en el buscador
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

  // Emite el evento hacia el padre
  onAction(actionName: string, row: any) {
    this.actionClicked.emit({ action: actionName, row });
  }

  // Utilidad para formatear la moneda
  formatCurrency(value: number): string {
    return this.currencyPipe.transform(value, 'USD', 'symbol', '1.2-2') || '$0.00';
  }
}