import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ProjectService } from '../../../../core/services/project.service';
import { ClientService } from '../../../../core/services/client.service';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './project-form.component.html'
})
export class ProjectFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private clientService = inject(ClientService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  projectForm!: FormGroup;
  isSubmitting = signal(false);
  serverError = signal<string | null>(null);
  
  // Lista de clientes para el Dropdown
  clients = signal<any[]>([]);

  projectId: number | null = null;
  isEditMode = signal(false);

  // Mapeo de Enums basados en tu Backend
  projectTypes = [
    { value: 'website', label: 'Sitio Web' },
    { value: 'frontend', label: 'Frontend' },
    { value: 'web_application', label: 'Aplicación Web' },
    { value: 'desktop', label: 'Escritorio' },
    { value: 'backend', label: 'Backend' },
    { value: 'flutter_app', label: 'App Flutter' },
    { value: 'fullstack', label: 'Fullstack' },
    { value: 'other', label: 'Otro' }
  ];

  projectStatuses = [
    { value: 'quoted', label: 'Cotizado' },
    { value: 'development', label: 'En Desarrollo' },
    { value: 'completed', label: 'Completado' },
    { value: 'suspended', label: 'Suspendido' }
  ];

  ngOnInit() {
    this.initForm();
    this.loadClientsForDropdown();
    this.checkIfEditMode();
  }

  private initForm() {
    this.projectForm = this.fb.group({
      client_id: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      type: ['web_application', [Validators.required]],
      status: ['quoted', [Validators.required]],
      total_price: [0, [Validators.required, Validators.min(0)]],
      currency: ['MXN', [Validators.required]]
    });
  }

  // Principio DRY: Reutilizamos la lógica de extracción segura
  private loadClientsForDropdown() {
    this.clientService.getClients().subscribe({
      next: (response: any) => {
        let data = response?.data || response;
        if (data && data.data && Array.isArray(data.data)) data = data.data;
        this.clients.set(Array.isArray(data) ? data : []);
      },
      error: () => this.serverError.set('No se pudieron cargar los clientes. Verifica tu conexión.')
    });
  }

  private checkIfEditMode() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.projectId = Number(idParam);
      this.isEditMode.set(true);
      this.loadProjectData(this.projectId);
    }
  }

  private loadProjectData(id: number) {
    this.projectService.getProject(id).subscribe({
      next: (response: any) => {
        const data = response.data || response;
        this.projectForm.patchValue({
          client_id: data.client_id,
          name: data.name,
          type: data.type,
          status: data.status,
          total_price: data.total_price,
          currency: data.currency
        });
      },
      error: () => this.serverError.set('No se pudo cargar la información del proyecto.')
    });
  }

  onSubmit() {
    this.serverError.set(null);
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formData = this.projectForm.value;

    const request$ = this.isEditMode() 
      ? this.projectService.updateProject(this.projectId!, formData)
      : this.projectService.createProject(formData);

    request$.subscribe({
      next: () => this.router.navigate(['/admin/projects']),
      error: (err) => {
        this.isSubmitting.set(false);
        if (err.status === 422 && err.error?.errors) {
          const firstErrorKey = Object.keys(err.error.errors)[0];
          this.serverError.set(err.error.errors[firstErrorKey][0]);
        } else {
          this.serverError.set('Error interno al guardar el proyecto.');
        }
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin/projects']);
  }
}