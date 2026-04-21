import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { PaymentService } from '../../../../core/services/payment.service';
import { ClientService } from '../../../../core/services/client.service';
import { ProjectService } from '../../../../core/services/project.service';
import { ServiceService } from '../../../../core/services/service.service';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './payment-form.component.html'
})
export class PaymentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private paymentService = inject(PaymentService);
  private clientService = inject(ClientService);
  private projectService = inject(ProjectService);
  private infraService = inject(ServiceService); // Alias para Service (Infraestructura)
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  paymentForm!: FormGroup;
  isSubmitting = signal(false);
  serverError = signal<string | null>(null);
  
  clients = signal<any[]>([]);
  projects = signal<any[]>([]);
  services = signal<any[]>([]);

  paymentId: number | null = null;
  isEditMode = signal(false);

  paymentTypes = [
    { value: 'advance', label: 'Anticipo de Proyecto' },
    { value: 'final', label: 'Finiquito de Proyecto' },
    { value: 'renewal', label: 'Renovación de Servicio' }
  ];

  paymentMethods = [
    { value: 'transfer', label: 'Transferencia Bancaria' },
    { value: 'cash', label: 'Efectivo' },
    { value: 'stripe', label: 'Tarjeta (Stripe)' }
  ];

  paymentStatuses = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'completed', label: 'Completado' },
    { value: 'failed', label: 'Fallido' },
    { value: 'refunded', label: 'Reembolsado' }
  ];

  ngOnInit() {
    this.initForm();
    this.loadRelations();
    this.checkIfEditMode();
  }

  private initForm() {
    this.paymentForm = this.fb.group({
      client_id: ['', [Validators.required]],
      project_id: [''], // Opcional (Depende de si es Proyecto o Servicio)
      service_id: [''], // Opcional
      amount: [0, [Validators.required, Validators.min(0.01)]],
      payment_type: ['advance', [Validators.required]],
      payment_method: ['transfer', [Validators.required]],
      status: ['completed', [Validators.required]],
      paid_at: [new Date().toISOString().split('T')[0]] // Hoy por defecto
    });
  }

  private loadRelations() {
    // Clientes
    this.clientService.getClients().subscribe(res => {
      let data = res?.data || res;
      if (data?.data) data = data.data;
      this.clients.set(Array.isArray(data) ? data : []);
    });
    // Proyectos
    this.projectService.getProjects().subscribe(res => {
      let data = res?.data || res;
      if (data?.data) data = data.data;
      this.projects.set(Array.isArray(data) ? data : []);
    });
    // Servicios de Infra
    this.infraService.getServices().subscribe(res => {
      let data = res?.data || res;
      if (data?.data) data = data.data;
      this.services.set(Array.isArray(data) ? data : []);
    });
  }

  private checkIfEditMode() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.paymentId = Number(idParam);
      this.isEditMode.set(true);
      this.loadPaymentData(this.paymentId);
    }
  }

  private loadPaymentData(id: number) {
    this.paymentService.getPayment(id).subscribe({
      next: (response: any) => {
        const data = response.data || response;
        this.paymentForm.patchValue({
          client_id: data.client_id,
          project_id: data.project_id || '',
          service_id: data.service_id || '',
          amount: data.amount,
          payment_type: data.payment_type,
          payment_method: data.payment_method,
          status: data.status,
          paid_at: data.paid_at ? data.paid_at.split(' ')[0] : ''
        });
      },
      error: () => this.serverError.set('No se pudo cargar el pago.')
    });
  }

  onSubmit() {
    this.serverError.set(null);
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formData = this.paymentForm.value;

    const request$ = this.isEditMode() 
      ? this.paymentService.updatePayment(this.paymentId!, formData)
      : this.paymentService.createPayment(formData);

    request$.subscribe({
      next: () => this.router.navigate(['/admin/payments']),
      error: (err) => {
        this.isSubmitting.set(false);
        // Atrapamos la validación de tu Regla de Negocio (El abono excede el saldo)
        if (err.status === 422 && err.error?.errors) {
          const firstErrorKey = Object.keys(err.error.errors)[0];
          this.serverError.set(err.error.errors[firstErrorKey][0]);
        } else {
          this.serverError.set('Error interno al guardar el pago.');
        }
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin/payments']);
  }
}