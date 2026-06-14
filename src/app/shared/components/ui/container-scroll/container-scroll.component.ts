import { Component, Input, HostListener, OnInit, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-container-scroll',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './container-scroll.component.html',
  styleUrl: './container-scroll.component.scss'
})
export class ContainerScrollComponent implements OnInit, OnDestroy {
  @Input() title: string = 'Scroll Container';

  scrollProgress: number = 0;
  isMobile: boolean = false;
  scaleValue: number = 1;
  rotateValue: number = 0;
  translateYValue: number = 0;

  private elementTop: number = 0;
  private elementHeight: number = 0;
  private viewportHeight: number = 0;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.checkIsMobile();
    this.updateElementPosition();
  }

  ngAfterViewInit() {
    this.updateElementPosition();
  }

  ngOnDestroy() {
    // Limpiar listeners
  }

  @HostListener('window:scroll')
  onScroll() {
    this.calculateScrollAnimation();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkIsMobile();
    this.updateElementPosition();
  }

  private checkIsMobile() {
    this.isMobile = window.innerWidth <= 768;
  }

  private updateElementPosition() {
    const element = this.elementRef.nativeElement.querySelector('.scroll-container');
    if (element) {
      this.elementTop = element.offsetTop;
      this.elementHeight = element.offsetHeight;
      this.viewportHeight = window.innerHeight;
    }
  }

  private calculateScrollAnimation() {
    const windowScrollY = window.scrollY;
    const elementBottom = this.elementTop + this.elementHeight;
    const elementMidpoint = this.elementTop + this.elementHeight / 2;

    // Calcular el progreso de scroll (0 a 1)
    if (windowScrollY + this.viewportHeight < this.elementTop) {
      // Elemento no ha entrado en viewport
      this.scrollProgress = 0;
    } else if (windowScrollY > elementBottom) {
      // Elemento ha pasado el viewport
      this.scrollProgress = 1;
    } else {
      // Elemento está en viewport
      const scrollDelta = (windowScrollY + this.viewportHeight) - this.elementTop;
      const maxScroll = this.elementHeight + this.viewportHeight;
      this.scrollProgress = Math.min(1, Math.max(0, scrollDelta / maxScroll));
    }

    // Calcular transformaciones basadas en el progreso de scroll
    this.updateTransforms();
  }

  private updateTransforms() {
    // Scale: empieza en 0.8, termina en 1
    this.scaleValue = 0.8 + this.scrollProgress * 0.2;

    // Rotate X: empieza en 30deg, termina en 0deg
    this.rotateValue = 30 - this.scrollProgress * 30;

    // Translate Y: empieza en 100px, termina en 0px
    this.translateYValue = 100 - this.scrollProgress * 100;

    // Ajustar para mobile
    if (this.isMobile) {
      this.scaleValue = 0.9 + this.scrollProgress * 0.1; // Menos escala en móvil
      this.rotateValue = 15 - this.scrollProgress * 15; // Menos rotación en móvil
      this.translateYValue = 50 - this.scrollProgress * 50; // Menos translación
    }
  }

  // Getter para el transform style
  get containerTransform(): string {
    return `
      scale(${this.scaleValue.toFixed(2)})
      rotateX(${this.rotateValue.toFixed(2)}deg)
      translateY(${this.translateYValue.toFixed(2)}px)
    `;
  }

  // Getter para la opacidad
  get containerOpacity(): number {
    return Math.min(1, 0.5 + this.scrollProgress * 0.5);
  }
}