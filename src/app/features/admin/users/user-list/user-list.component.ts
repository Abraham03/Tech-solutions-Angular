import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListState } from '../../../../core/models/list-state';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { DataTableComponent, TableColumn } from '../../../../shared/components/ui/data-table/data-table.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  /** Pagina actual, tamano, busqueda y resultados del listado. */
  lista = new ListState<any>();

  columns: TableColumn[] = [
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Correo Electrónico' },
    { 
      key: 'role', 
      label: 'Rol', 
      type: 'badge',
      badgeColors: {
        'admin': 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
        'client': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      }
    },
    { key: 'created_at', label: 'Fecha de Registro' }
  ];

  actions = [
    { actionName: 'edit', icon: 'edit', colorClass: 'text-gray-400 hover:text-brand-primary', tooltip: 'Editar' },
    { actionName: 'delete', icon: 'delete', colorClass: 'text-gray-400 hover:text-status-error', tooltip: 'Eliminar' }
  ];

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.lista.loading.set(true);

    this.userService.getUsers(this.lista.params()).subscribe({
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
    this.loadUsers();
  }

  onPageSizeChange(tamano: number) {
    this.lista.changePageSize(tamano);
    this.loadUsers();
  }

  onSearchChange(termino: string) {
    this.lista.changeSearch(termino);
    this.loadUsers();
  }

  handleAction(event: { action: string; row: any }) {
    if (event.action === 'edit') {
      this.router.navigate(['/admin/users/edit', event.row.id]);
    } else if (event.action === 'delete') {
      if (confirm(`¿Estás seguro de eliminar el acceso de ${event.row.name}?`)) {
        this.userService.deleteUser(event.row.id).subscribe({
          next: () => this.loadUsers(),
          error: (err) => {
            // Manejamos el error 403 que programaste en Laravel (Evitar borrarse a sí mismo)
            if (err.status === 403) {
              alert(err.error.message || 'No puedes eliminar tu propia cuenta.');
            } else {
              alert('Error al intentar eliminar el usuario.');
            }
          }
        });
      }
    }
  }

  createNewUser() {
    this.router.navigate(['/admin/users/new']);
  }
}