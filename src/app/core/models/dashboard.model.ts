export interface DashboardMetrics {
  mrr: number;
  activeClients: number;
  activeProjects: number;
  pendingInvoices: number;
  monthlyProfit: number;
  totalReceivable: number;
}

export interface ProjectSummary {
  id: number;
  name: string;
  type: string;
  status: string;
  amount: number;
  balance: number;
}

export interface ExpiringService {
  id: number;
  name: string;
  client_name: string;
  expiration_date: string;
  profit_margin: number;
}

export interface RevenuePoint {
  total: number;
  month: string;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  recentProjects: ProjectSummary[];
  expiringServices?: ExpiringService[];
  revenueChart?: RevenuePoint[];
}