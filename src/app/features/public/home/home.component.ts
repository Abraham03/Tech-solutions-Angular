import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser'; // Importación para SEO
import { InteractiveMenuComponent } from '../../../shared/components/ui/interactive-menu/interactive-menu.component';
import { ContainerScrollComponent } from '../../../shared/components/ui/container-scroll/container-scroll.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, InteractiveMenuComponent, NgOptimizedImage],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // ✅ Inyección de dependencias para el SEO
  constructor(private meta: Meta, private title: Title) {}

  // ✅ MENÚ ITEMS CON NOMBRES DE ICONOS (sin componentes lucide)
  menuItems = [
    { label: 'Inicio', icon: 'home', id: 'inicio', targetId: 'inicio' },
    { label: 'Servicios', icon: 'briefcase', id: 'servicios', targetId: 'servicios' },
    { label: 'Proyectos', icon: 'folder-open', id: 'proyectos', targetId: 'proyectos' },
    { label: 'Reseñas', icon: 'star', id: 'reviews', targetId: 'reviews' },
    { label: 'Contacto', icon: 'mail', id: 'contacto', targetId: 'contacto' },
  ];

  heroStats = [
    { icon: 'calendar_month', value: '+5 años',  label: 'de experiencia' },
    { icon: 'group',          value: '15+',       label: 'proyectos entregados' },
    { icon: 'star',           value: '100%',      label: 'satisfacción' },
  ];

  heroBars = [
    { label: 'Angular',  pct: '92%', color: 'linear-gradient(90deg,#dd0031,#c3002f)' },
    { label: 'Laravel',  pct: '85%', color: 'linear-gradient(90deg,#f55247,#ff6b6b)' },
    { label: 'Flutter',  pct: '80%', color: 'linear-gradient(90deg,#54c5f8,#01579b)' },
    { label: 'Spring',   pct: '75%', color: 'linear-gradient(90deg,#6db33f,#3c763d)' },
  ];

  counterStats = [
    { icon: 'folder_open',  value: '15+',  label: 'Proyectos entregados', color: '#60a5fa', bgColor: 'rgba(96,165,250,0.1)'  },
    { icon: 'group',        value: '10+',  label: 'Clientes satisfechos', color: '#34d399', bgColor: 'rgba(52,211,153,0.1)'  },
    { icon: 'code',         value: '8+',   label: 'Tecnologías dominadas', color: '#a78bfa', bgColor: 'rgba(167,139,250,0.1)' },
    { icon: 'emoji_events', value: '5+',   label: 'Años de experiencia',  color: '#fbbf24', bgColor: 'rgba(251,191,36,0.1)'  },
  ];

  aboutFeatures = [
    { icon: 'speed',          title: 'Entrega ágil',         desc: 'Resultados en semanas, no meses.',         color: '#60a5fa', bgColor: 'rgba(96,165,250,0.1)'  },
    { icon: 'lock',           title: 'Código de calidad',    desc: 'Limpio, seguro y escalable.',              color: '#34d399', bgColor: 'rgba(52,211,153,0.1)'  },
    { icon: 'support_agent',  title: 'Soporte continuo',     desc: 'Acompañamiento post-lanzamiento.',         color: '#a78bfa', bgColor: 'rgba(167,139,250,0.1)' },
    { icon: 'handshake',      title: 'Comunicación directa', desc: 'Sin intermediarios ni burocracia.',         color: '#fbbf24', bgColor: 'rgba(251,191,36,0.1)'  },
  ];

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
      numero: '1/5',
      image: 'img/services/Pagina Web.webp',
      title: 'Páginas Web (Presencia Digital)',
      desc: 'Para negocios locales que necesitan existir en Google y captar clientes vía WhatsApp.',
      problema: '¿Tus clientes potenciales no te encuentran en Google?',
      beneficios: [
        'Posicionamiento en buscadores',
        'Captura de leads automática por WhatsApp',
        'Disponible 24/7 para nuevos clientes'
      ],
      tags: ['HTML5', 'JS', 'Tailwind CSS']
    },
    {
      numero: '2/5',
      image: 'img/services/Dashboard.webp',
      title: 'Aplicaciones Web (Gestión Operativa)',
      desc: 'Sistemas a la medida para clínicas o empresas.',
      problema: '¿Pierdes tiempo en procesos manuales y archivos dispersos?',
      beneficios: [
        'Gestión centralizada de datos',
        'Reportes automáticos en tiempo real',
        'Control de acceso por perfiles'
      ],
      tags: ['Angular', 'Laravel', 'MySQL']
    },
    {
      numero: '3/5',
      image: 'img/services/Web Page.webp',
      title: 'App Web Progresiva (PWA)',
      desc: 'Software de campo instalable en la pantalla del celular.',
      problema: '¿Necesitas trabajar sin conexión a internet?',
      beneficios: [
        'Funciona completamente offline',
        'Se instala como app nativa',
        'Sincroniza automáticamente al conectar'
      ],
      tags: ['Angular', 'Service Workers']
    },
    {
      numero: '4/5',
      image: 'img/services/App Moviles.webp',
      title: 'Aplicaciones Móviles Nativas',
      desc: 'Presencia en App Store y Google Play.',
      problema: '¿Necesitas acceso total al hardware del dispositivo?',
      beneficios: [
        'Publicado en App Store y Google Play',
        'Mejor rendimiento y velocidad',
        'Experiencia nativa y familiar'
      ],
      tags: ['Flutter', 'Dart', 'Firebase']
    },
    {
      numero: '5/5',
      image: 'img/services/Cloud Hosting.webp',
      title: 'Tech Solutions Care & Automatización',
      desc: 'Mantenimiento mensual, alojamiento en la nube, seguridad SSL.',
      problema: '¿Te preocupa la seguridad y el mantenimiento continuo?',
      beneficios: [
        'Soporte técnico 24/7 incluido',
        'Actualizaciones automáticas de seguridad',
        'Hosting en infraestructura confiable'
      ],
      tags: ['Soporte', 'Hosting', 'Automatización']
    }
  ];

  proceso = [
    { icon: 'lightbulb', title: 'Descubrimiento y Estrategia', desc: 'Entendemos a fondo tus objetivos.', color: '#60a5fa', gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)' },
    { icon: 'design_services', title: 'Prototipado y Diseño UX/UI', desc: 'Creamos un prototipo interactivo.', color: '#a78bfa', gradient: 'linear-gradient(135deg, #8b5cf6, #d946ef)' },
    { icon: 'code', title: 'Desarrollo Ágil', desc: 'Construimos con código limpio y escalable.', color: '#34d399', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
    { icon: 'rocket_launch', title: 'Revisión y Despliegue', desc: 'Pruebas exhaustivas y despliegue en producción.', color: '#fbbf24', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
  ];

  // ── Portafolio Actualizado a Mockups ─────────────────────────────────────
  proyectos = [
    {
      imagen: 'img/proyects/App Movil Basket.webp',
      titulo: 'Basket Pro — App Móvil',
      descripcion: 'Digitalización integral de partidos. Eliminó el uso de papel en mesas de control y automatizó la generación de reportes en tiempo real.',
      tags: ['Flutter', 'WebSockets', 'SQLite'],
      categoria: 'Solución Móvil',
    },
    {
      imagen: 'img/proyects/Dashboard Basketball.webp',
      titulo: 'Dashboard Admin para Ligas',
      descripcion: 'SaaS de gestión deportiva que reduce horas de trabajo administrativo centralizando equipos, finanzas y calendarios automáticos.',
      tags: ['Angular', 'Spring Boot', 'MySQL'],
      categoria: 'Plataforma SaaS',
    },
    {
      imagen: 'img/proyects/Pagina Web Basket.webp',
      titulo: 'Portal Público de Baloncesto',
      descripcion: 'Centro de información comunitaria diseñado para soportar altos volúmenes de tráfico durante torneos, con estadísticas en vivo.',
      tags: ['Angular', 'Tailwind CSS', 'UX/UI'],
      categoria: 'Presencia Web',
    },
    {
      imagen: 'img/proyects/GBS Renovation.webp',
      titulo: 'GBS Renovations LLC',
      descripcion: 'Sistema a la medida de Gestión centralizada de datos de una empresa de remodelación y renovación de viviendas ubicada en Greenville, Carolina del Sur',
      tags: ['Angular', 'Laravel','Tailwind CSS', 'UX/UI'],
      categoria: 'Aplicacion Web',
    },  
    {
      imagen: 'img/proyects/Gestion de Proyectos.webp',
      titulo: 'SaaS de Gestión de Proyectos',
      descripcion: 'Entorno de control operativo y financiero. Permite a las empresas rastrear rentabilidad, horas hombre y facturación desde la nube.',
      tags: ['Java 17', 'Docker', 'G-Cloud'],
      categoria: 'Gestión Empresarial',
    },
    {
      imagen: 'img/proyects/Paqueteria.webp',
      titulo: 'Gestión de Rutas y Paquetes',
      descripcion: 'Sistema de logística con rastreo satelital. Optimizó los tiempos de entrega y transparentó la recolección de evidencias para los clientes.',
      tags: ['Flutter', 'Angular' ,'Laravel', 'JWT'],
      categoria: 'Logística & Operación',
    },
    {
      imagen: 'img/proyects/Gestion Comunitaria.webp',
      titulo: 'Sistema de Gestión Comunitaria',
      descripcion: 'Plataforma administrativa para delegaciones. Agilizó el control de recursos, censos ciudadanos y la organización de actividades locales.',
      tags: ['Java', 'Spring', 'MySQL'],
      categoria: 'Sector Público',
    },
  ];

  contactInfo = [
    { icon: 'chat', label: 'WhatsApp', value: '+52 55 3994 8515', href: 'https://wa.me/5215539948515', color: '#34d399', bgColor: 'rgba(52,211,153,0.1)' },
    { icon: 'mail', label: 'Email', value: 'achave8627@gmail.com', href: 'mailto:achave8627@gmail.com', color: '#60a5fa', bgColor: 'rgba(96,165,250,0.1)' },
    { icon: 'work', label: 'LinkedIn', value: 'Abraham Chavez', href: 'https://linkedin.com/in/abraham-chavez-937758340', color: '#a78bfa', bgColor: 'rgba(167,139,250,0.1)' },
    { icon: 'location_on', label: 'Ubicación', value: 'Hidalgo, México', href: '#', color: '#fbbf24', bgColor: 'rgba(251,191,36,0.1)' },
  ];

  whyMe = ['Consultoría inicial gratuita', 'Entrega en plazos acordados', 'Código documentado y escalable', 'Soporte post-lanzamiento incluido', 'Comunicación directa sin intermediarios'];

  ngOnInit() {
    // ✅ Optimización SEO Local
    this.title.setTitle('Tech Solutions | Desarrollo de Software e Infraestructura Web');
    this.meta.addTags([
      { name: 'description', content: 'Agencia de desarrollo web y aplicaciones móviles. Creamos sistemas de gestión a la medida para empresas en Ixmiquilpan, Hidalgo y todo México.' },
      { name: 'keywords', content: 'desarrollo web Hidalgo, programador Ixmiquilpan, aplicaciones móviles, sistemas web, Angular, Laravel, Flutter' }
    ]);

    // ✅ Carga diferida del script de Elfsight (mejora rendimiento)
    setTimeout(() => {
      const script = document.createElement('script');
      script.src = 'https://elfsightcdn.com/platform.js';
      script.async = true;
      document.body.appendChild(script);
    }, 3000);
  }

  enviarWhatsApp(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const nombre = (form.querySelector('input[type="text"]') as HTMLInputElement).value;
    const email = (form.querySelector('input[type="email"]') as HTMLInputElement).value;
    const tipo = (form.querySelector('select') as HTMLSelectElement).value;
    const proyecto = (form.querySelector('textarea') as HTMLTextAreaElement).value;
    const msg = `¡Hola Tech Solutions! 👋\n\nMe interesa trabajar con ustedes.\n\n*Nombre:* ${nombre}\n*Correo:* ${email}\n*Tipo de proyecto:* ${tipo}\n\n*Descripción:*\n${proyecto}\n\n¡Quedo a la espera de su respuesta!`;
    window.open(`https://wa.me/5215539948515?text=${encodeURIComponent(msg)}`, '_blank')?.focus();
    form.reset();
  }
}