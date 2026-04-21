import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  userForm!: FormGroup;
  isSubmitting = signal(false);
  serverError = signal<string | null>(null);
  
  userId: number | null = null;
  isEditMode = signal(false);

  roles = [
    { value: 'admin', label: 'Administrador' },
    { value: 'client', label: 'Cliente' }
  ];

  ngOnInit() {
    this.initForm();
    this.checkIfEditMode();
  }

  private initForm() {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(8)]], // Opcional por defecto, lo volvemos requerido si es Nuevo
      role: ['client', [Validators.required]]
    });
  }

  private checkIfEditMode() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.userId = Number(idParam);
      this.isEditMode.set(true);
      this.loadUserData(this.userId);
    } else {
      // Si es un usuario nuevo, la contraseña SÍ es obligatoria
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  private loadUserData(id: number) {
    this.userService.getUser(id).subscribe({
      next: (response: any) => {
        const data = response.data || response;
        this.userForm.patchValue({
          name: data.name,
          email: data.email,
          role: data.role
        });
      },
      error: () => this.serverError.set('No se pudo cargar la información del usuario.')
    });
  }

  onSubmit() {
    this.serverError.set(null);
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    
    // Clonamos los valores del formulario
    const formData = { ...this.userForm.value };

    // Regla de Negocio: Si estamos editando y dejaron la contraseña en blanco, no la enviamos
    if (this.isEditMode() && !formData.password) {
      delete formData.password;
    }

    const request$ = this.isEditMode() 
      ? this.userService.updateUser(this.userId!, formData)
      : this.userService.createUser(formData);

    request$.subscribe({
      next: () => this.router.navigate(['/admin/users']),
      error: (err) => {
        this.isSubmitting.set(false);
        if (err.status === 422 && err.error?.errors) {
          const firstErrorKey = Object.keys(err.error.errors)[0];
          this.serverError.set(err.error.errors[firstErrorKey][0]);
        } else {
          this.serverError.set('Error interno al guardar el usuario.');
        }
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin/users']);
  }
}