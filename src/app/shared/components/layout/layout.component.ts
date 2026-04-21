import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  public authService = inject(AuthService);
  public isDarkMode = false;
  isMobileMenuOpen = signal(false);
  
  // Usamos el Signal para obtener los datos del usuario logueado
  public user = this.authService.currentUser;

  ngOnInit() {
    // Revisar si el usuario ya tenía el modo oscuro activo en su navegador
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.isDarkMode = true;
      document.documentElement.classList.add('dark');
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(val => !val);
  }

  // Cuando hagan clic en un enlace en celular, cerramos el menú
  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  logout() {
    this.authService.logout();
  }
}