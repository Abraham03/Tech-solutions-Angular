import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListState } from '../../../../core/models/list-state';
import { Router } from '@angular/router';
import { ServiceService } from '../../../../core/services/service.service';
import { DataTableComponent, TableColumn } from '../../../../shared/components/ui/data-table/data-table.component';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './service-list.component.html'
})
export class ServiceListComponent implements OnInit {
  private serviceService = inject(ServiceService);
  private router = inject(Router);

  /** Pagina actual, tamano, busqueda y resultados del listado. */
  lista = new ListState<any>();

  columns: TableColumn[] = [
    { key: 'project_name', label: 'Proyecto' },
    { key: 'name', label: 'Nombre / Dominio' },
    { key: 'provider', label: 'Proveedor' },
    { 
      key: 'type', 
      label: 'Tipo', 
      type: 'badge',
      badgeColors: {
        'domain': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        'shared_hosting': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
        'vps': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
        'maintenance': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
        'updates': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
        'backup': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
        'other': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
      }
    },
    { 
      key: 'billing_cycle', // <-- AGREGADO A LA TABLA
      label: 'Ciclo',
      type: 'badge',
      badgeColors: {
        'monthly': 'bg-gray-100 text-gray-800',
        'quarterly': 'bg-orange-100 text-orange-800',
        'annually': 'bg-green-100 text-green-800',
        'biennially': 'bg-blue-100 text-blue-800',
        'one-time': 'bg-purple-100 text-purple-800'
      }
    },
    { 
      key: 'status', 
      label: 'Estado', 
      type: 'badge',
      badgeColors: {
        'active': 'bg-status-success/10 text-status-success',
        'expired': 'bg-status-error/10 text-status-error',
        'cancelled': 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
      }
    },
    { key: 'expiration_date', label: 'Vencimiento' },
    { key: 'price_mxn', label: 'Precio al Cliente', type: 'currency' }
  ];

  actions = [
    { actionName: 'edit', icon: 'edit', colorClass: 'text-gray-400 hover:text-brand-primary', tooltip: 'Editar' },
    { actionName: 'delete', icon: 'delete', colorClass: 'text-gray-400 hover:text-status-error', tooltip: 'Eliminar' }
  ];

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.lista.loading.set(true);

    this.serviceService.getServices(this.lista.params()).subscribe({
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
    this.loadServices();
  }

  onPageSizeChange(tamano: number) {
    this.lista.changePageSize(tamano);
    this.loadServices();
  }

  onSearchChange(termino: string) {
    this.lista.changeSearch(termino);
    this.loadServices();
  }

  handleAction(event: { action: string; row: any }) {
    if (event.action === 'edit') {
      this.router.navigate(['/admin/services/edit', event.row.id]);
    } else if (event.action === 'delete') {
      if (confirm(`¿Estás seguro de eliminar el servicio: ${event.row.name}?`)) {
        this.serviceService.deleteService(event.row.id).subscribe({
          next: () => this.loadServices(),
          error: () => alert('Error al eliminar el servicio.')
        });
      }
    }
  }

  createNewService() {
    this.router.navigate(['/admin/services/new']);
  }
}