import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './public-layout.component.html'
})
export class PublicLayoutComponent {
  // Inyectamos el servicio de autenticación
  private authService = inject(AuthService);
  
  // Exponemos el usuario como un Signal a la vista HTML
  public user = this.authService.currentUser;

  // Año dinámico que siempre estará actualizado
  currentYear = new Date().getFullYear();

  // Variable para controlar el menú móvil
  isMenuOpen: boolean = false;

  // Función para abrir/cerrar al tocar el icono de hamburguesa
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Función para cerrar el menú cuando hagan clic en un enlace
  closeMenu() {
    this.isMenuOpen = false;
  }
}