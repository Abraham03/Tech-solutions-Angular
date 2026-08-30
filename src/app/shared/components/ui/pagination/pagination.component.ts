import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PaginationMeta, PAGE_SIZES, emptyMeta } from '../../../../core/models/pagination.model';

/**
 * Pie de paginacion reutilizable: rango, selector de tamano y numeros de pagina.
 *
 * Lo usan tanto la tabla de los modulos como las listas del dashboard, para que
 * paginar se vea y se comporte igual en todo el panel.
 */
@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    @if (meta().total > 0) {
      <div class="px-6 py-4 border-t border-gray-100 dark:border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4">

        <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>{{ rangeLabel }}</span>

          @if (showPageSize()) {
            <label class="flex items-center gap-2">
              <span class="hidden sm:inline">Por página</span>
              <select
                [ngModel]="meta().per_page"
                (ngModelChange)="pageSizeChange.emit(+$event)"
                [disabled]="loading()"
                aria-label="Registros por página"
                class="bg-gray-50 dark:bg-[#151822] border border-gray-200 dark:border-surface-border rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-brand-primary dark:text-white disabled:opacity-50">
                @for (size of pageSizes; track size) {
                  <option [value]="size">{{ size }}</option>
                }
              </select>
            </label>
          }
        </div>

        @if (meta().last_page > 1) {
          <nav class="flex items-center gap-1" aria-label="Paginación">
            <button
              type="button"
              (click)="goToPage(meta().current_page - 1)"
              [disabled]="!hasPrevious || loading()"
              aria-label="Página anterior"
              class="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-border transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              <mat-icon class="scale-75">chevron_left</mat-icon>
            </button>

            @for (pagina of visiblePages; track $index) {
              @if (pagina === '...') {
                <span class="px-2 text-gray-400 select-none">…</span>
              } @else {
                <button
                  type="button"
                  (click)="goToPage(+pagina)"
                  [disabled]="loading()"
                  [attr.aria-current]="pagina === meta().current_page ? 'page' : null"
                  [class]="pagina === meta().current_page
                    ? 'min-w-9 px-3 py-1.5 rounded-lg text-sm font-semibold bg-brand-primary text-white'
                    : 'min-w-9 px-3 py-1.5 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-border transition-colors disabled:opacity-40'">
                  {{ pagina }}
                </button>
              }
            }

            <button
              type="button"
              (click)="goToPage(meta().current_page + 1)"
              [disabled]="!hasNext || loading()"
              aria-label="Página siguiente"
              class="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-border transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              <mat-icon class="scale-75">chevron_right</mat-icon>
            </button>
          </nav>
        }

      </div>
    }
  `
})
export class PaginationComponent {
  meta = input<PaginationMeta>(emptyMeta());
  loading = input<boolean>(false);

  /** En listas cortas del dashboard el selector de tamaño estorba mas que ayuda. */
  showPageSize = input<boolean>(true);

  pageChange = output<number>();
  pageSizeChange = output<number>();

  readonly pageSizes = PAGE_SIZES;

  get hasPrevious(): boolean {
    return this.meta().current_page > 1;
  }

  get hasNext(): boolean {
    return this.meta().current_page < this.meta().last_page;
  }

  goToPage(pagina: number): void {
    const { last_page, current_page } = this.meta();

    if (pagina < 1 || pagina > last_page || pagina === current_page) {
      return;
    }

    this.pageChange.emit(pagina);
  }

  /**
   * Numeros a mostrar, con elipsis cuando hay muchas paginas: con 40 no tiene
   * sentido pintar 40 botones.
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

  get rangeLabel(): string {
    const { from, to, total } = this.meta();

    if (!total) {
      return 'Sin registros';
    }

    return `Mostrando ${from ?? 0}–${to ?? 0} de ${total}`;
  }
}
