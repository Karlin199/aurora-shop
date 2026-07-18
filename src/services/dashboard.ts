import { getDashboardOrders } from "./orders";
import { getProduction } from "./production";
import { getInventory } from "./inventory";

function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay(); // Sunday = 0

  // Monday as first day of week
  const diff = day === 0 ? -6 : 1 - day;

  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);

  return d;
}

export async function getDashboardData() {
  const [orders, production, inventory] = await Promise.all([
     getDashboardOrders(),
     getProduction(),
     getInventory(),
  ]);

  const outstandingOrders = orders.filter(
    (order) => order.status !== "Completed"
  ).length;

  const weekStart = startOfWeek(new Date());

  const completedThisWeek = orders.filter((order) => {
    if (order.status !== "Completed") return false;
    if (!order.completedDate) return false;

    const completed = new Date(order.completedDate);

    return completed >= weekStart;
  }).length;

  const partsToCut = production.reduce(
    (machineTotal, machine) =>
      machineTotal +
      machine.parts.reduce(
        (partTotal, part) =>
          partTotal +
          part.colours.reduce(
            (colourTotal, colour) =>
              colourTotal + colour.toCut,
            0
          ),
        0
      ),
    0
  );

  const inventoryAlerts = inventory.filter(
   (item) => item.quantity < item.warning
  ).length;

  return {
    outstandingOrders,
    partsToCut,
    inventoryAlerts,
    completedThisWeek,

    orders: orders
      .filter((order) => order.status !== "Completed")
      .sort(
        (a, b) =>
          new Date(a.dueDate).getTime() -
          new Date(b.dueDate).getTime()
      ),
  };
}