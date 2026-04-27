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
  
  clientId: number | null = null;
  isEditMode = signal(false);

  ngOnInit() {
    this.initForm();
    this.checkIfEditMode();
  }

  private initForm() {
    this.clientForm = this.fb.group({
      // Se llaman 'name' y 'phone_number', igual que en Laravel
      name: ['', [Validators.required, Validators.minLength(3)]],
      contact_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]]
    });
  }

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
        
        // Traducimos DE la base de datos (company_name/phone) HACIA el formulario (name/phone_number)
        this.clientForm.patchValue({
          name: clientData.company_name, 
          contact_name: clientData.contact_name,
          email: clientData.email,
          phone_number: clientData.phone
        });
      },
      error: () => {
        this.serverError.set('No se pudo cargar la información del cliente.');
      }
    });
  }

  onSubmit() {
    this.serverError.set(null);
    
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    
    // Obtenemos los valores del formulario. 
    // Como ya se llaman 'name' y 'phone_number', están listos para Laravel.
    const formData = this.clientForm.value;

    const request$ = this.isEditMode() 
      ? this.clientService.updateClient(this.clientId!, formData)
      : this.clientService.createClient(formData);

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