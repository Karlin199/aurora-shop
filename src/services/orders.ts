import { getSheetValues } from "@/lib/googleSheets";

export type OrderItem = {
  item: string;
  color: string;
  qty: string;
};

export type Order = {
  customer: string;
  dueDate: string;
  status: string;
  items: OrderItem[];
};

export async function getOrders(): Promise<Order[]> {
  const rows = await getSheetValues("Orders");

  if (rows.length <= 1) {
    return [];
  }

  const grouped = new Map<string, Order>();

  for (const row of rows.slice(1)) {
    const status = row[5] ?? "";

    // Hide completed orders for now
    if (status === "Completed") continue;

    const customer = row[0] ?? "";
    const dueDate = row[4] ?? "";

    const key = `${customer}|${dueDate}`;

    if (!grouped.has(key)) {
      grouped.set(key, {
        customer,
        dueDate,
        status,
        items: [],
      });
    }

    grouped.get(key)!.items.push({
      item: row[1] ?? "",
      color: row[2] ?? "",
      qty: row[3] ?? "",
    });
  }

  return [...grouped.values()];
}

import { appendSheetValues } from "@/lib/googleSheets";

export async function createOrder(
  customer: string,
  dueDate: string,
  products: {
    item: string;
    color: string;
    qty: number;
  }[]
) {
  const rows = products.map((product) => [
    customer,
    product.item,
    product.color,
    String(product.qty),
    dueDate,
    "Waiting",
    "",
  ]);

  await appendSheetValues("Orders", rows);
}