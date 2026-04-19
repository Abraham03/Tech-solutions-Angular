export interface DashboardMetrics {
  mrr: number;
  activeClients: number;
  activeProjects: number;
  pendingInvoices: number;
}

export interface ProjectSummary {
  id: number;
  name: string;
  type: string;
  status: 'Activo' | 'En Progreso' | 'Mantenimiento';
  amount: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  recentProjects: ProjectSummary[];
}