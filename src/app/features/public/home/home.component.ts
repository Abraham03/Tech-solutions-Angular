import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // ── Hero stats ─────────────────────────────────────────────────────────
  heroStats = [
    { icon: 'calendar_month', value: '+5 años',  label: 'de experiencia' },
    { icon: 'group',          value: '15+',       label: 'proyectos entregados' },
    { icon: 'star',           value: '100%',      label: 'satisfacción' },
  ];

  heroBars = [
    { label: 'Angular',   pct: '92%', color: 'linear-gradient(90deg,#dd0031,#c3002f)' },
    { label: 'Laravel',   pct: '85%', color: 'linear-gradient(90deg,#f55247,#ff6b6b)' },
    { label: 'Flutter',   pct: '80%', color: 'linear-gradient(90deg,#54c5f8,#01579b)' },
    { label: 'Spring',    pct: '75%', color: 'linear-gradient(90deg,#6db33f,#3c763d)' },
  ];

  // ── Counter stats ──────────────────────────────────────────────────────
  counterStats = [
    { icon: 'folder_open',  value: '15+',  label: 'Proyectos entregados', color: '#60a5fa', bgColor: 'rgba(96,165,250,0.1)'  },
    { icon: 'group',        value: '10+',  label: 'Clientes satisfechos', color: '#34d399', bgColor: 'rgba(52,211,153,0.1)'  },
    { icon: 'code',         value: '8+',   label: 'Tecnologías dominadas', color: '#a78bfa', bgColor: 'rgba(167,139,250,0.1)' },
    { icon: 'emoji_events', value: '5+',   label: 'Años de experiencia',  color: '#fbbf24', bgColor: 'rgba(251,191,36,0.1)'  },
  ];

  // ── About features ─────────────────────────────────────────────────────
  aboutFeatures = [
    { icon: 'speed',          title: 'Entrega ágil',         desc: 'Resultados en semanas, no meses.',          color: '#60a5fa', bgColor: 'rgba(96,165,250,0.1)'  },
    { icon: 'lock',           title: 'Código de calidad',    desc: 'Limpio, seguro y escalable.',               color: '#34d399', bgColor: 'rgba(52,211,153,0.1)'  },
    { icon: 'support_agent',  title: 'Soporte continuo',     desc: 'Acompañamiento post-lanzamiento.',          color: '#a78bfa', bgColor: 'rgba(167,139,250,0.1)' },
    { icon: 'handshake',      title: 'Comunicación directa', desc: 'Sin intermediarios ni burocracia.',         color: '#fbbf24', bgColor: 'rgba(251,191,36,0.1)'  },
  ];

  // ── Tech stack ─────────────────────────────────────────────────────────
  techStack = [
    { name: 'Angular',      iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angular/angular-original.svg', color: '#dd0031' },
    { name: 'Laravel',      iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg', color: '#f55247' },
    { name: 'Flutter',      iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg', color: '#54c5f8' },
    { name: 'Spring Boot',  iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg', color: '#6db33f' },
    { name: 'MySQL',        iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg', color: '#00758f' },
    { name: 'Docker',       iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg', color: '#2496ed' },
    { name: 'TypeScript',   iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg', color: '#3178c6' },
    { name: 'Tailwind CSS', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg', color: '#38bdf8' },
    { name: 'Firebase',     iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg', color: '#ffca28' },
    { name: 'Google Cloud', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg', color: '#4285f4' },
    { name: 'Java',         iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg', color: '#f89820' },
    { name: 'JavaScript',   iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg', color: '#f7df1e' }
  ];

  // ── Servicios ──────────────────────────────────────────────────────────
  servicios = [
    {
      icon: 'laptop_mac',
      title: 'Aplicaciones Web',
      desc: 'SaaS, dashboards y portales complejos que automatizan procesos y centralizan la operación de tu negocio.',
      tags: ['Angular', 'Laravel', 'MySQL'],
      iconColor: '#60a5fa', iconBg: 'rgba(96,165,250,0.12)',
      glow: 'radial-gradient(ellipse at top left, rgba(96,165,250,0.08) 0%, transparent 70%)',
    },
    {
      icon: 'rocket_launch',
      title: 'Páginas de Impacto',
      desc: 'Sitios rápidos, atractivos y optimizados para convertir visitantes en clientes desde el primer scroll.',
      tags: ['Angular', 'Tailwind', 'SEO'],
      iconColor: '#34d399', iconBg: 'rgba(52,211,153,0.12)',
      glow: 'radial-gradient(ellipse at top left, rgba(52,211,153,0.08) 0%, transparent 70%)',
    },
    {
      icon: 'phone_iphone',
      title: 'Apps Móviles',
      desc: 'Aplicaciones nativas para iOS y Android de alto rendimiento construidas con Flutter y Dart.',
      tags: ['Flutter', 'Dart', 'Firebase'],
      iconColor: '#a78bfa', iconBg: 'rgba(167,139,250,0.12)',
      glow: 'radial-gradient(ellipse at top left, rgba(167,139,250,0.08) 0%, transparent 70%)',
    },
    {
      icon: 'settings_suggest',
      title: 'Automatización',
      desc: 'Elimina tareas repetitivas con software a la medida. Más eficiencia, menos errores, mayor rentabilidad.',
      tags: ['API REST', 'Bots', 'Integraciones'],
      iconColor: '#fbbf24', iconBg: 'rgba(251,191,36,0.12)',
      glow: 'radial-gradient(ellipse at top left, rgba(251,191,36,0.08) 0%, transparent 70%)',
    },
  ];

  // ── Proceso ────────────────────────────────────────────────────────────
  proceso = [
    {
      icon: 'lightbulb',
      title: 'Descubrimiento y Estrategia',
      desc: 'Entendemos a fondo tus objetivos. Definimos alcance, funcionalidades clave y estrategia tecnológica ideal.',
      color: '#60a5fa',
      gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    },
    {
      icon: 'design_services',
      title: 'Prototipado y Diseño UX/UI',
      desc: 'Creamos un prototipo interactivo para validar la experiencia de usuario antes de escribir una sola línea de código.',
      color: '#a78bfa',
      gradient: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
    },
    {
      icon: 'code',
      title: 'Desarrollo Ágil',
      desc: 'Construimos con código limpio y escalable, manteniéndote informado con avances periódicos y demostraciones.',
      color: '#34d399',
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
    },
    {
      icon: 'rocket_launch',
      title: 'Revisión y Despliegue',
      desc: 'Pruebas exhaustivas y despliegue en producción seguro y optimizado. Con soporte post-lanzamiento incluido.',
      color: '#fbbf24',
      gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    },
  ];

  // ── Portafolio ─────────────────────────────────────────────────────────
  proyectos = [
    {
      icono: 'sports_basketball',
      titulo: 'Basket Pro — App Móvil',
      descripcion: 'App multiplataforma para control en tiempo real de partidos. Conexión vía IP/HDMI, gestión de alineaciones y generación de PDFs.',
      tags: ['Flutter', 'Dart', 'WebSockets', 'SQLite'],
      categoria: 'App Móvil',
      gradient: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
    },
    {
      icono: 'admin_panel_settings',
      titulo: 'Dashboard Admin para Ligas',
      descripcion: 'Panel backend para administración integral de ligas deportivas: equipos, jugadores, torneos y generación automática de calendarios.',
      tags: ['Angular', 'Spring Boot', 'MySQL', 'API REST'],
      categoria: 'SaaS',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
    },
    {
      icono: 'language',
      titulo: 'Portal Público de Baloncesto',
      descripcion: 'Página responsiva comunitaria con galerías, estadísticas en tiempo real, resultados y perfiles de equipos.',
      tags: ['Angular', 'Tailwind CSS', 'UX/UI'],
      categoria: 'Web',
      gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
    },
    {
      icono: 'cloud_done',
      titulo: 'SaaS de Gestión de Proyectos',
      descripcion: 'Plataforma para administrar proyectos, clientes y horas. Backend robusto dockerizado para despliegue ágil en la nube.',
      tags: ['Java 17', 'Spring Boot', 'Docker', 'Google Cloud'],
      categoria: 'SaaS',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    },
    {
      icono: 'package',
      titulo: 'Gestión de Rutas y Paquetes',
      descripcion: 'Aplicación movíl para gestionar rutas, evidencias, rastrear paquetes con la pagina web.',
      tags: ['Flutter', 'Laravel', 'JWT', 'PHP', 'MySQL'],
      categoria: 'Movíl y Backend',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    },
    {
      icono: 'groups',
      titulo: 'Sistema de Gestión Comunitaria',
      descripcion: 'App web para gestionar ciudadanos de una delegación comunitaria, controlando actividades y recursos eficientemente.',
      tags: ['Java 17', 'Spring', 'MySQL'],
      categoria: 'Web',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    },
  ];

  // ── Contacto ───────────────────────────────────────────────────────────
  contactInfo = [
    { icon: 'chat',     label: 'WhatsApp',  value: '+52 55 3994 8515',               href: 'https://wa.me/5215539948515',                        color: '#34d399', bgColor: 'rgba(52,211,153,0.1)'  },
    { icon: 'mail',     label: 'Email',     value: 'achave8627@gmail.com',            href: 'mailto:achave8627@gmail.com',                         color: '#60a5fa', bgColor: 'rgba(96,165,250,0.1)'  },
    { icon: 'work',     label: 'LinkedIn',  value: 'Abraham Chavez',                  href: 'https://linkedin.com/in/abraham-chavez-937758340',    color: '#a78bfa', bgColor: 'rgba(167,139,250,0.1)' },
    { icon: 'location_on', label: 'Ubicación', value: 'Hidalgo, México',            href: '#',                                                   color: '#fbbf24', bgColor: 'rgba(251,191,36,0.1)'  },
  ];

  whyMe = [
    'Consultoría inicial gratuita',
    'Entrega en plazos acordados',
    'Código documentado y escalable',
    'Soporte post-lanzamiento incluido',
    'Comunicación directa sin intermediarios',
  ];

  // ── Lifecycle ──────────────────────────────────────────────────────────
  ngOnInit() {
    const script = document.createElement('script');
    script.src = 'https://elfsightcdn.com/platform.js';
    script.async = true;
    document.body.appendChild(script);
  }

  // ── WhatsApp form ──────────────────────────────────────────────────────
  enviarWhatsApp(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const nombre   = (form.querySelector('input[type="text"]')  as HTMLInputElement).value;
    const email    = (form.querySelector('input[type="email"]') as HTMLInputElement).value;
    const tipo     = (form.querySelector('select')              as HTMLSelectElement).value;
    const proyecto = (form.querySelector('textarea')            as HTMLTextAreaElement).value;

    const msg = `¡Hola Tech Solutions! 👋\n\nMe interesa trabajar con ustedes.\n\n*Nombre:* ${nombre}\n*Correo:* ${email}\n*Tipo de proyecto:* ${tipo}\n\n*Descripción:*\n${proyecto}\n\n¡Quedo a la espera de su respuesta!`;
    window.open(`https://wa.me/5215539948515?text=${encodeURIComponent(msg)}`, '_blank')?.focus();
    form.reset();
  }
}