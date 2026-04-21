import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface ProyectoPortafolio {
  icono: string;
  titulo: string;
  descripcion: string;
  tags: string[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  
  proyectos: ProyectoPortafolio[] = [
    {
      icono: 'sports_basketball',
      titulo: 'Basket Pro - App Móvil',
      descripcion: 'Aplicación móvil multiplataforma para el control en tiempo real de partidos de baloncesto. Conexión a dispositivos externos vía IP y HDMI, gestión de alineaciones y generación automática de PDFs.',
      tags: ['Flutter', 'Dart', 'WebSockets', 'SQLite']
    },
    {
      icono: 'admin_panel_settings',
      titulo: 'Dashboard Admin para Ligas',
      descripcion: 'Panel de control backend a la medida para la administración integral de ligas deportivas. Permite gestionar equipos, jugadores, torneos y automatizar la creación de calendarios.',
      tags: ['Angular', 'Spring Boot', 'MySQL', 'API REST']
    },
    {
      icono: 'language',
      titulo: 'Portal Público de Baloncesto',
      descripcion: 'Página web responsiva orientada a la comunidad. Permite visualizar galerías de fotos, estadísticas en tiempo real, resultados de los partidos y perfiles de los equipos.',
      tags: ['Angular', 'Tailwind CSS', 'UX/UI']
    },
    {
      icono: 'cloud_done',
      titulo: 'SaaS para Gestión de Proyectos',
      descripcion: 'Plataforma para administrar proyectos, clientes y horas trabajadas. Construida con un backend robusto, totalmente dockerizada para un despliegue ágil en la nube.',
      tags: ['Java 17', 'Spring Boot', 'Docker', 'Google Cloud']
    },
    {
      icono: 'security',
      titulo: 'API Segura con Roles y JWT',
      descripcion: 'Backend robusto con Spring Security para gestionar usuarios y roles, utilizando JSON Web Tokens (JWT) para la autenticación.',
      tags: ['Spring Security', 'JWT', 'Java']
    },
    {
      icono: 'groups',
      titulo: 'Sistema de Gestión Comunitaria',
      descripcion: 'Aplicación web desarrollada para gestionar ciudadanos de una delegación comunitaria, controlando actividades y recursos de forma eficiente.',
      tags: ['Java 17', 'Spring', 'MySQL']
    }
  ];

  ngOnInit() {
    // Carga dinámica del script de Elfsight para los testimonios de Google
    const script = document.createElement('script');
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    document.body.appendChild(script);
  }

  // Lógica para enviar el mensaje de WhatsApp
  enviarWhatsApp(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const nombre = (form.querySelector('input[type="text"]') as HTMLInputElement).value;
    const email = (form.querySelector('input[type="email"]') as HTMLInputElement).value;
    const proyecto = (form.querySelector('textarea') as HTMLTextAreaElement).value;
    
    const telefono = "5215539948515";
    const mensajeWhatsApp = `¡Hola Tech Solutions! \n\nEstoy interesado en sus servicios y me gustaría iniciar una conversación.\n\n*Nombre:* ${nombre}\n*Correo:* ${email}\n*Sobre mi proyecto:*\n${proyecto}\n\nQuedo a la espera de su contacto. ¡Gracias!`;
    const mensajeCodificado = encodeURIComponent(mensajeWhatsApp);
    
    window.open(`https://wa.me/${telefono}?text=${mensajeCodificado}`, "_blank")?.focus();
    form.reset();
  }
}