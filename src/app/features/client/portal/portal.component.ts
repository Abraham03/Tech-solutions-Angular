import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientPortalService } from '../../../core/services/client-portal.service';
import { MetricCardComponent } from '../../../shared/components/ui/metric-card/metric-card.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-portal',
  standalone: true,
  imports: [CommonModule, MetricCardComponent, MatIconModule],
  templateUrl: './portal.component.html'
})
export class PortalComponent implements OnInit {
  private portalService = inject(ClientPortalService);

  isLoading = signal(true);
  error = signal<string | null>(null);
  dashboardData = signal<any>(null);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.portalService.getDashboardSummary().subscribe({
      next: (response) => {
        // Asignamos la data recibida del backend
        this.dashboardData.set(response.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando el dashboard', err);
        this.error.set('No se pudo cargar la información. Por favor, intenta de nuevo.');
        this.isLoading.set(false);
      }
    });
  }
}