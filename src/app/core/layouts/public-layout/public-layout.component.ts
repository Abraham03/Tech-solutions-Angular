import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterModule, MatIconModule],
  templateUrl: './public-layout.component.html'
})
export class PublicLayoutComponent {
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