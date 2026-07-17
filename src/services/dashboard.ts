import { getDashboardOrders } from "./orders";

export async function getDashboardData() {
  const orders = await getDashboardOrders();

  const outstandingOrders =
    orders.filter(o => o.status !== "Completed").length;

  return {
    outstandingOrders,

    partsToCut: 0,
    inventoryAlerts: 0,
    completedThisWeek: 0,

    productionQueue: [],

    upcomingOrders: [],
  };
}