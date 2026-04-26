export interface DashboardMetrics {
  totalClients: number;
  activeProjects: number;
  pendingInvoices: number;
  mrr: number;
  monthlyProfit: number;
  totalReceivable: number;
  annualProjection: number;
  totalCollected: number;
  servicesExpiringSoon: number;
}

export interface NotificationLog {
  id: number;
  type: string;
  client_name: string;
  service_name: string;
  message_body: string;
  sent_at: string;
  sent_ago: string;
}

export interface NotificationsSummary {
  whatsapp: number;
  email: number;
  push: number;
  total: number;
}

export interface ClientLTV {
  id: number;
  name: string;
  contact_name: string;
  ltv: number;
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

export interface RevenuePeriod {
  total: number;
  count: number;
  period: string;
}

export interface RevenueYear {
  year: number;
  total: number;
  payments_count: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  recentProjects: any[]; 
  expiringServices: any[]; 
  revenueChart: any[]; 
  revenueByYear: RevenueYear[];
  revenueThisMonth: RevenuePeriod;
  revenueThisYear: RevenuePeriod;
  recentNotifications: NotificationLog[];
  notificationsSummary: NotificationsSummary;
  serviceMargins: any[];
  clientLTV: ClientLTV[];
}