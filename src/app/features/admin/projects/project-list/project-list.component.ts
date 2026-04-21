import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, TableColumn, TableActionConfig } from '../../../../shared/components/ui/data-table/data-table.component';
import { ProjectService } from '../../../../core/services/project.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './project-list.component.html'
})
export class ProjectListComponent implements OnInit {
  private projectService = inject(ProjectService);
  private router = inject(Router);

  // Estado reactivo para los datos
  projects = signal<any[]>([]);

  // 1. Configuración de las columnas exactas que queremos ver
  tableColumns: TableColumn[] = [
    { key: 'name', label: 'Nombre del Proyecto', type: 'text' },
    { key: 'type', label: 'Tipo', type: 'badge' },
    { 
      key: 'status', 
      label: 'Estado', 
      type: 'badge',
      badgeColors: {
        'completed': 'bg-status-success/10 text-status-success',
        'development': 'bg-brand-primary/10 text-brand-primary',
        'quoted': 'bg-gray-100 text-gray-700 dark:bg-surface-border dark:text-gray-300',
        'suspended': 'bg-status-error/10 text-status-error'
      }
    },
    { key: 'total_price', label: 'Precio Total', type: 'currency' }
  ];

  // 2. Configuración de los botones de acción
  tableActions: TableActionConfig[] = [
    { actionName: 'view', icon: 'visibility', tooltip: 'Ver Detalles', colorClass: 'text-gray-400 hover:text-brand-primary' },
    { actionName: 'edit', icon: 'edit', tooltip: 'Editar Proyecto', colorClass: 'text-gray-400 hover:text-brand-accent' },
    { actionName: 'delete', icon: 'delete', tooltip: 'Eliminar', colorClass: 'text-gray-400 hover:text-status-error' }
  ];

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe({
      next: (response: any) => {
        // 1. Extraemos la data (Laravel Resource suele enviarlo en 'data')
        let extractedData = response?.data || response;
        
        // 2. Si Laravel manda paginación nativa, la data real está un nivel más adentro
        if (extractedData && extractedData.data && Array.isArray(extractedData.data)) {
          extractedData = extractedData.data;
        }

        // 3. Validación estricta: Si no es un Array, forzamos un Array vacío
        this.projects.set(Array.isArray(extractedData) ? extractedData : []); 
      },
      error: (err) => {
        console.error('Error cargando proyectos', err);
        // Si hay error 500 o 404, evitamos que la tabla se rompa
        this.projects.set([]); 
      }
    });
  }

  // 3. Manejador de eventos (Cuando hacen clic en algún botón de la tabla)
  handleAction(event: { action: string; row: any }) {
    if (event.action === 'edit') {
      this.router.navigate(['/admin/projects/edit', event.row.id]);
    } else if (event.action === 'delete') {
      if (confirm(`¿Estás seguro de eliminar el proyecto ${event.row.name}?`)) {
        this.projectService.deleteProject(event.row.id).subscribe(() => this.loadProjects());
      }
    }
  }

  createNewProject() {
    this.router.navigate(['/admin/projects/new']);
  }
}