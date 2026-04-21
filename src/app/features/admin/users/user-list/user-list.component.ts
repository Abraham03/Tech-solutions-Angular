import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  users = signal<any[]>([]);

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
    this.userService.getUsers().subscribe({
      next: (response: any) => {
        let data = response?.data || response;
        if (data && data.data && Array.isArray(data.data)) data = data.data; // Extraer si viene paginado
        this.users.set(Array.isArray(data) ? data : []);
      },
      error: (err) => console.error('Error al cargar usuarios', err)
    });
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