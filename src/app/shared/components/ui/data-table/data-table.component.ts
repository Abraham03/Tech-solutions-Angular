import { Component, input, output, signal, effect, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { PaginationMeta, emptyMeta } from '../../../../core/models/pagination.model';
import { PaginationComponent } from '../pagination/pagination.component';

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
  imports: [CommonModule, MatIconModule, FormsModule, PaginationComponent],
  providers: [CurrencyPipe],
  templateUrl: './data-table.component.html'
})
export class DataTableComponent implements OnDestroy {
  title = input<string>('Registros');
  columns = input.required<TableColumn[]>();
  data = input.required<any[]>();
  actions = input<TableActionConfig[]>([]);

  // NUEVO INPUT: Controla la visibilidad del botón de creación (por defecto es true)
  showCreateButton = input<boolean>(true);

  /** Datos de paginacion que devuelve el backend. */
  meta = input<PaginationMeta>(emptyMeta());

  /** Deshabilita los controles mientras llega la peticion. */
  loading = input<boolean>(false);

  actionClicked = output<{ action: string; row: any }>();
  createClicked = output<void>();

  /** El contenedor recarga los datos cuando cambia pagina, tamano o busqueda. */
  pageChanged = output<number>();
  pageSizeChanged = output<number>();
  searchChanged = output<string>();

  searchTerm = signal('');

  private searchTimer?: ReturnType<typeof setTimeout>;

  private primeraEmision = true;

  constructor(private currencyPipe: CurrencyPipe) {
    // La busqueda la resuelve ahora el servidor -antes filtraba solo la pagina
    // cargada-, asi que hay que esperar a que el usuario deje de escribir. Sin
    // esto se disparia una peticion por cada tecla pulsada.
    effect(() => {
      const termino = this.searchTerm();

      // El effect corre una vez al crearse; no queremos recargar por eso.
      if (this.primeraEmision) {
        this.primeraEmision = false;
        return;
      }

      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => this.searchChanged.emit(termino), 350);
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.searchTimer);
  }

  // ── Acciones y formato ────────────────────────────────────────────────

  onAction(actionName: string, row: any) {
    this.actionClicked.emit({ action: actionName, row });
  }

  formatCurrency(value: number): string {
    return this.currencyPipe.transform(value, 'MXN', 'symbol', '1.2-2') || '$0.00';
  }
}
