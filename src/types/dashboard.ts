export type DashboardOrderItem = {
  item: string;
  color: string;
  qty: string;
};

export type DashboardOrder = {
  id: string;
  customer: string;
  dueDate: string;
  status?: string;
  completedDate?: string;
  items: DashboardOrderItem[];
};

export type DashboardData = {
  outstandingOrders: number;
  partsToCut: number;
  inventoryAlerts: number;
  completedThisWeek: number;
  orders: DashboardOrder[];
};