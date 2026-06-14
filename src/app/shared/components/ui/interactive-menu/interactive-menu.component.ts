import { Component, Input, ViewChildren, QueryList, ElementRef, HostListener, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export interface MenuItem {
  label: string;
  icon: string;
  id?: string;       // ID interno
  targetId?: string; // ID de la sección a la que navegar (#inicio, #servicios, etc)
}

@Component({
  selector: 'app-interactive-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './interactive-menu.component.html',
  styleUrl: './interactive-menu.component.scss'
})
export class InteractiveMenuComponent implements OnInit, AfterViewInit {
  @Input() items: MenuItem[] = [];
  @Input() accentColor: string = '#3b82f6';
  @ViewChildren('menuItem') menuItems!: QueryList<ElementRef>;

  activeIndex: number = 0;
  lineWidth: number = 0;
  lineOffset: number = 0;
  isMobile: boolean = false;

  // ✅ ICONOS SVG (Lucide icons)
  private iconSvgs: { [key: string]: string } = {
    'home': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    'briefcase': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    'folder-open': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2"/></svg>',
    'star': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    'mail': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>'
  };

  defaultItems: MenuItem[] = [
    { label: 'Inicio', icon: 'home', id: 'inicio', targetId: 'inicio' },
    { label: 'Servicios', icon: 'briefcase', id: 'servicios', targetId: 'servicios' },
    { label: 'Proyectos', icon: 'folder-open', id: 'proyectos', targetId: 'proyectos' },
    { label: 'Reseñas', icon: 'star', id: 'reviews', targetId: 'reviews' },
    { label: 'Contacto', icon: 'mail', id: 'contacto', targetId: 'contacto' },
  ];

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    if (!this.items || this.items.length === 0) {
      this.items = this.defaultItems;
    }
    this.checkMobile();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.calculateLineWidth();
    }, 100);
  }

  // ✅ NAVEGAR A SECCIÓN
  setActive(index: number) {
    this.activeIndex = index;
    this.calculateLineWidth();

    const item = this.items[index];
    if (item?.targetId) {
      this.scrollToSection(item.targetId);
    }
  }

  // ✅ SCROLL SUAVE A LA SECCIÓN
  private scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      // Offset por el menú desktop (sticky top)
      const offset = this.isMobile ? 0 : 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  // ✅ SCROLL SPY: detectar sección visible automáticamente
  @HostListener('window:scroll')
  onWindowScroll() {
    const scrollPosition = window.scrollY + window.innerHeight / 3;

    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      if (item?.targetId) {
        const element = document.getElementById(item.targetId);
        if (element && element.offsetTop <= scrollPosition) {
          if (this.activeIndex !== i) {
            this.activeIndex = i;
            this.calculateLineWidth();
          }
          break;
        }
      }
    }
  }

  calculateLineWidth() {
    if (this.menuItems && this.menuItems.length > this.activeIndex) {
      const activeElement = this.menuItems.toArray()[this.activeIndex];
      if (activeElement) {
        const element = activeElement.nativeElement;
        const width = element.offsetWidth;
        const left = element.offsetLeft;
        
        if (this.isMobile) {
          this.lineWidth = width - 8;
          this.lineOffset = left + 4;
        } else {
          this.lineWidth = width - 16;
          this.lineOffset = left + 8;
        }
      }
    }
  }

  checkMobile() {
    this.isMobile = window.innerWidth < 768;
  }

  @HostListener('window:resize')
  onResize() {
    this.checkMobile();
    setTimeout(() => this.calculateLineWidth(), 50);
  }

  getIconSvg(iconName: string): SafeHtml {
    const svg = this.iconSvgs[iconName] || this.iconSvgs['home'];
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}