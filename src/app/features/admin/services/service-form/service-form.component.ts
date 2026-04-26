import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ServiceService } from '../../../../core/services/service.service';
import { ProjectService } from '../../../../core/services/project.service';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './service-form.component.html'
})
export class ServiceFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private serviceService = inject(ServiceService);
  private projectService = inject(ProjectService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  serviceForm!: FormGroup;
  isSubmitting = signal(false);
  serverError = signal<string | null>(null);
  
  // Lista de proyectos para el Dropdown
  projects = signal<any[]>([]);

  serviceId: number | null = null;
  isEditMode = signal(false);

  // Mapeo de Enums para Billing Cycle 
  billingCycles = [
    { value: 'monthly', label: 'Mensual' },
    { value: 'quarterly', label: 'Trimestral' },
    { value: 'annually', label: 'Anual' },
    { value: 'biennially', label: 'Bianual (2 años)' },
    { value: 'one-time', label: 'Pago Único' }
  ];

  // Mapeo de Enums (ServiceTypeEnum)
  serviceTypes = [
    { value: 'domain', label: 'Dominio' },
    { value: 'shared_hosting', label: 'Hosting Compartido' },
    { value: 'vps', label: 'Servidor VPS' },
    { value: 'maintenance', label: 'Mantenimiento' },
    { value: 'updates', label: 'Actualizaciones' },
    { value: 'backup', label: 'Respaldo' },
    { value: 'other', label: 'Otro' }
  ];

  // Mapeo de Enums (ServiceStatusEnum)
  serviceStatuses = [
    { value: 'active', label: 'Activo' },
    { value: 'expired', label: 'Vencido' },
    { value: 'cancelled', label: 'Cancelado' }
  ];

  ngOnInit() {
    this.initForm();
    this.loadProjectsForDropdown();
    this.checkIfEditMode();
  }

  private initForm() {
    this.serviceForm = this.fb.group({
      project_id: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      provider: ['', [Validators.required]],
      type: ['domain', [Validators.required]],
      cost_mxn: [0, [Validators.required, Validators.min(0)]],
      price_mxn: [0, [Validators.required, Validators.min(0)]],
      billing_cycle: ['monthly', [Validators.required]],
      expiration_date: ['', [Validators.required]],
      status: ['active', [Validators.required]]
    });
  }

  private loadProjectsForDropdown() {
    this.projectService.getProjects().subscribe({
      next: (response: any) => {
        let data = response?.data || response;
        if (data && data.data && Array.isArray(data.data)) data = data.data;
        this.projects.set(Array.isArray(data) ? data : []);
      },
      error: () => this.serverError.set('No se pudieron cargar los proyectos. Verifica tu conexión.')
    });
  }

  private checkIfEditMode() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.serviceId = Number(idParam);
      this.isEditMode.set(true);
      this.loadServiceData(this.serviceId);
    }
  }

  private loadServiceData(id: number) {
    this.serviceService.getService(id).subscribe({
      next: (response: any) => {
        const data = response.data || response;
        this.serviceForm.patchValue({
          project_id: data.project_id,
          name: data.name,
          provider: data.provider,
          type: data.type,
          cost_mxn: data.cost_mxn,
          price_mxn: data.price_mxn,
          billing_cycle: data.billing_cycle || 'monthly',
          expiration_date: data.expiration_date ? new Date(data.expiration_date).toISOString().split('T')[0] : '',
          status: data.status
        });
      },
      error: () => this.serverError.set('No se pudo cargar la información del servicio.')
    });
  }

  onSubmit() {
    this.serverError.set(null);
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formData = this.serviceForm.value;

    const request$ = this.isEditMode() 
      ? this.serviceService.updateService(this.serviceId!, formData)
      : this.serviceService.createService(formData);

    request$.subscribe({
      next: () => this.router.navigate(['/admin/services']),
      error: (err) => {
        this.isSubmitting.set(false);
        if (err.status === 422 && err.error?.errors) {
          const firstErrorKey = Object.keys(err.error.errors)[0];
          this.serverError.set(err.error.errors[firstErrorKey][0]);
        } else {
          this.serverError.set('Error interno al guardar el servicio de infraestructura.');
        }
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin/services']);
  }
}