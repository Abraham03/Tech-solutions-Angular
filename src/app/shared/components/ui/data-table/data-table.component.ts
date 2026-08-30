import { Component, input, output, signal, effect, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { PaginationMeta, PAGE_SIZES, DEFAULT_PAGE_SIZE, emptyMeta } from '../../../../core/models/pagination.model';

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

  readonly pageSizes = PAGE_SIZES;
  readonly defaultPageSize = DEFAULT_PAGE_SIZE;

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

  // ── Paginación ────────────────────────────────────────────────────────

  get hasPrevious(): boolean {
    return this.meta().current_page > 1;
  }

  get hasNext(): boolean {
    return this.meta().current_page < this.meta().last_page;
  }

  goToPage(pagina: number | '...'): void {
    if (pagina === '...') {
      return;
    }

    const { last_page, current_page } = this.meta();

    if (pagina < 1 || pagina > last_page || pagina === current_page) {
      return;
    }

    this.pageChanged.emit(pagina);
  }

  onPageSizeChange(valor: string | number): void {
    this.pageSizeChanged.emit(Number(valor));
  }

  /**
   * Numeros de pagina a mostrar, con elipsis cuando hay muchas: con 40 paginas
   * no tiene sentido pintar 40 botones.
   */
  get visiblePages(): (number | '...')[] {
    const { current_page: actual, last_page: ultima } = this.meta();

    if (ultima <= 7) {
      return Array.from({ length: ultima }, (_, i) => i + 1);
    }

    const paginas: (number | '...')[] = [1];

    const desde = Math.max(2, actual - 1);
    const hasta = Math.min(ultima - 1, actual + 1);

    if (desde > 2) {
      paginas.push('...');
    }

    for (let i = desde; i <= hasta; i++) {
      paginas.push(i);
    }

    if (hasta < ultima - 1) {
      paginas.push('...');
    }

    paginas.push(ultima);

    return paginas;
  }

  /** "Mostrando 11–20 de 137" */
  get rangeLabel(): string {
    const { from, to, total } = this.meta();

    if (!total) {
      return 'Sin registros';
    }

    return `Mostrando ${from ?? 0}–${to ?? 0} de ${total}`;
  }

  // ── Acciones y formato ────────────────────────────────────────────────

  onAction(actionName: string, row: any) {
    this.actionClicked.emit({ action: actionName, row });
  }

  formatCurrency(value: number): string {
    return this.currencyPipe.transform(value, 'MXN', 'symbol', '1.2-2') || '$0.00';
  }
}
