export type DashboardStats = {
  outstandingOrders: number;
  partsToCut: number;
  inventoryAlerts: number;
  completedThisWeek: number;
};

export type ProductionJob = {
  customer: string;
  item: string;
  due: string;
};

export type DueOrder = {
  customer: string;
  due: string;
  color: string;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  return {
    outstandingOrders: 18,
    partsToCut: 42,
    inventoryAlerts: 5,
    completedThisWeek: 21,
  };
}

export async function getProductionQueue(): Promise<ProductionJob[]> {
  return [
    {
      customer: "Smith",
      item: "2 Luxe Gliders",
      due: "Today",
    },
    {
      customer: "Brown",
      item: "4 Sapphire Chairs",
      due: "Tomorrow",
    },
    {
      customer: "Johnson",
      item: "1 Luxe Table",
      due: "Friday",
    },
  ];
}

export async function getDueOrders(): Promise<DueOrder[]> {
  return [
    {
      customer: "Smith",
      due: "Today",
      color: "text-red-400",
    },
    {
      customer: "Brown",
      due: "Tomorrow",
      color: "text-yellow-400",
    },
    {
      customer: "Johnson",
      due: "Friday",
      color: "text-green-400",
    },
  ];
}