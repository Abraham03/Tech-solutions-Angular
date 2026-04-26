import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ClientService } from '../../../../core/services/client.service';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './client-form.component.html'
})
export class ClientFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private clientService = inject(ClientService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  clientForm!: FormGroup;
  isSubmitting = signal(false);
  serverError = signal<string | null>(null);
  
  // Variables para saber si estamos en modo Edición o Creación
  clientId: number | null = null;
  isEditMode = signal(false);

  ngOnInit() {
    this.initForm();
    this.checkIfEditMode();
  }

  // 1. Configuración Estricta del Formulario (Validaciones Frontend)
  private initForm() {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      contact_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      // Regex estricto: SÓLO números del 0 al 9. Entre 10 y 15 dígitos. (Ideal para el código 52 + teléfono)
      phone_number: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]]
    });
  }

  // 2. Comprobar si la URL tiene un ID (Ej: /admin/clients/edit/5)
  private checkIfEditMode() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.clientId = Number(idParam);
      this.isEditMode.set(true);
      this.loadClientData(this.clientId);
    }
  }

  private loadClientData(id: number) {
    this.clientService.getClient(id).subscribe({
      next: (response: any) => {
        const clientData = response.data || response;
        // Rellenamos el formulario con los datos de Laravel
        this.clientForm.patchValue({
          name: clientData.name,
          contact_name: clientData.contact_name,
          email: clientData.email,
          phphone_numberone: clientData.phone_number
        });
      },
      error: () => {
        this.serverError.set('No se pudo cargar la información del cliente.');
      }
    });
  }

  // 3. Procesamiento del Formulario con Validación Backend
  onSubmit() {
    this.serverError.set(null);
    
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    
    // 1. Obtenemos los valores tal cual están en el formulario de Angular
    const rawFormData = this.clientForm.value;

    // 2. CREAMOS EL TRADUCTOR PARA LARAVEL
    // Mapeamos los campos de Angular hacia lo que exigen tus Requests de Laravel
    const payloadForLaravel = {
      name: rawFormData.company_name,         // Laravel espera 'name'
      contact_name: rawFormData.contact_name,
      email: rawFormData.email,
      phone_number: rawFormData.phone         // Laravel espera 'phone_number'
    };

    // 3. Enviamos el Payload traducido
    const request$ = this.isEditMode() 
      ? this.clientService.updateClient(this.clientId!, payloadForLaravel)
      : this.clientService.createClient(payloadForLaravel);

    request$.subscribe({
      next: () => {
        this.router.navigate(['/admin/clients']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        if (err.status === 422 && err.error?.errors) {
          const firstErrorKey = Object.keys(err.error.errors)[0];
          this.serverError.set(err.error.errors[firstErrorKey][0]);
        } else {
          this.serverError.set('Ocurrió un error inesperado al guardar el cliente.');
        }
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin/clients']);
  }
}