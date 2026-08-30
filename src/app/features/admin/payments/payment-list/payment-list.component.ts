import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListState } from '../../../../core/models/list-state';
import { Router } from '@angular/router';
import { PaymentService } from '../../../../core/services/payment.service';
import { DataTableComponent, TableColumn } from '../../../../shared/components/ui/data-table/data-table.component';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './payment-list.component.html'
})
export class PaymentListComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private router = inject(Router);

  /** Pagina actual, tamano, busqueda y resultados del listado. */
  lista = new ListState<any>();

  columns: TableColumn[] = [
    { key: 'client_name', label: 'Cliente' },
    { key: 'project_name', label: 'Proyecto' },
    { 
      key: 'payment_type', 
      label: 'Concepto', 
      type: 'badge',
      badgeColors: {
        'advance': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        'final': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
        'renewal': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
      }
    },
    { 
      key: 'payment_method', 
      label: 'Método', 
      type: 'badge',
      badgeColors: {
        'cash': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        'transfer': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
        'stripe': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      }
    },
    { key: 'amount', label: 'Monto', type: 'currency' },
    { 
      key: 'status', 
      label: 'Estado', 
      type: 'badge',
      badgeColors: {
        'completed': 'bg-status-success/10 text-status-success',
        'pending': 'bg-status-warning/10 text-status-warning',
        'failed': 'bg-status-error/10 text-status-error',
        'refunded': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
      }
    },
    { key: 'paid_at', label: 'Pagado el' }
  ];

  actions = [
    { actionName: 'edit', icon: 'edit', colorClass: 'text-gray-400 hover:text-brand-primary', tooltip: 'Editar' },
    { actionName: 'delete', icon: 'delete', colorClass: 'text-gray-400 hover:text-status-error', tooltip: 'Eliminar' }
  ];

  ngOnInit() {
    this.loadPayments();
  }

  loadPayments() {
    this.lista.loading.set(true);

    this.paymentService.getPayments(this.lista.params()).subscribe({
      next: (response: any) => {
        this.lista.apply(response);
        this.lista.loading.set(false);
      },
      error: (err: unknown) => {
        console.error('Error cargando el listado', err);
        this.lista.fail();
        this.lista.loading.set(false);
      }
    });
  }

  // La paginacion y la busqueda las resuelve el servidor, asi que cada cambio
  // vuelve a pedir la pagina correspondiente.
  onPageChange(pagina: number) {
    this.lista.goToPage(pagina);
    this.loadPayments();
  }

  onPageSizeChange(tamano: number) {
    this.lista.changePageSize(tamano);
    this.loadPayments();
  }

  onSearchChange(termino: string) {
    this.lista.changeSearch(termino);
    this.loadPayments();
  }

  handleAction(event: { action: string; row: any }) {
    if (event.action === 'edit') {
      this.router.navigate(['/admin/payments/edit', event.row.id]);
    } else if (event.action === 'delete') {
      if (confirm(`¿Estás seguro de eliminar este pago de ${event.row.amount}?`)) {
        this.paymentService.deletePayment(event.row.id).subscribe({
          next: () => this.loadPayments(),
          error: () => alert('Error al eliminar el pago.')
        });
      }
    }
  }

  createNewPayment() {
    this.router.navigate(['/admin/payments/new']);
  }
}