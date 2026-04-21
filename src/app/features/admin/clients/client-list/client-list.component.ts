import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, TableColumn, TableActionConfig } from '../../../../shared/components/ui/data-table/data-table.component';
import { ClientService } from '../../../../core/services/client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './client-list.component.html'
})
export class ClientListComponent implements OnInit {
  private clientService = inject(ClientService);
  private router = inject(Router);

  // Estado reactivo para inyectar a la tabla
  clients = signal<any[]>([]);

  // 1. Contrato de Columnas (Basado en la migración de tu BD)
  tableColumns: TableColumn[] = [
    { key: 'company_name', label: 'Empresa / Cliente', type: 'text' },
    { key: 'contact_name', label: 'Contacto Principal', type: 'text' },
    { key: 'email', label: 'Correo Electrónico', type: 'text' },
    { key: 'phone', label: 'Teléfono', type: 'text' }
  ];

  // 2. Configuración de Acciones
  tableActions: TableActionConfig[] = [
    { actionName: 'view', icon: 'visibility', tooltip: 'Ver Historial', colorClass: 'text-gray-400 hover:text-brand-primary' },
    { actionName: 'edit', icon: 'edit', tooltip: 'Editar Cliente', colorClass: 'text-gray-400 hover:text-brand-accent' },
    { actionName: 'delete', icon: 'delete', tooltip: 'Eliminar', colorClass: 'text-gray-400 hover:text-status-error' }
  ];

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getClients().subscribe({
      next: (response: any) => {
        let extractedData = response?.data || response;
        
        if (extractedData && extractedData.data && Array.isArray(extractedData.data)) {
          extractedData = extractedData.data;
        }

        this.clients.set(Array.isArray(extractedData) ? extractedData : []);
      },
      error: (err) => {
        console.error('Error cargando el directorio de clientes', err);
        this.clients.set([]);
      }
    });
  }

  // 3. Recepción de eventos desde la tabla reutilizable
  handleAction(event: { action: string; row: any }) {
    if (event.action === 'edit') {
      this.router.navigate(['/admin/clients/edit', event.row.id]);
    } else if (event.action === 'delete') {
      // Validación básica antes de una acción destructiva
      if (confirm(`¿Estás seguro de eliminar a ${event.row.name}? Se ocultará del sistema (SoftDelete).`)) {
        this.clientService.deleteClient(event.row.id).subscribe({
          next: () => this.loadClients(),
          error: () => alert('Ocurrió un error al intentar eliminar.')
        });
      }
    }
  }

  createNewClient() {
    this.router.navigate(['/admin/clients/new']);
  }
}