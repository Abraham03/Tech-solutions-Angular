export interface DashboardMetrics {
  mrr: number;
  activeClients: number;
  activeProjects: number;
  pendingInvoices: number;
}

export interface ProjectSummary {
  id: number;
  name: string;
  type: string; // 'web_app' | 'mobile_app' | 'ecommerce' | 'landing_page'
  status: string; // 'pending' | 'development' | 'testing' | 'completed' | 'cancelled'
  amount: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  recentProjects: ProjectSummary[];
}