import {
  appendSheetValues,
  getSheetValues,
  replaceSheetValues,
} from "@/lib/googleSheets";

export type OrderItem = {
  item: string;
  color: string;
  qty: string;
};

export type Order = {
  id: string;
  customer: string;
  dueDate: string;
  status: string;
  items: OrderItem[];
};

function generateOrderId(existingIds: string[]) {
  const today = new Date();

  const date =
    today.getFullYear().toString() +
    String(today.getMonth() + 1).padStart(2, "0") +
    String(today.getDate()).padStart(2, "0");

  const todaysOrders = existingIds.filter((id) =>
    id.startsWith(`ORD-${date}-`)
  );

  let next = 1;

  if (todaysOrders.length > 0) {
    const highest = Math.max(
      ...todaysOrders.map((id) =>
        Number(id.split("-")[2])
      )
    );

    next = highest + 1;
  }

  return `ORD-${date}-${String(next).padStart(3, "0")}`;
}

export async function getOrders(): Promise<Order[]> {
  const rows = await getSheetValues("Orders");

  if (rows.length <= 1) {
    return [];
  }

  const grouped = new Map<string, Order>();

  for (const row of rows.slice(1)) {

    const id = row[0] ?? "";
    const customer = row[1] ?? "";
    const item = row[2] ?? "";
    const color = row[3] ?? "";
    const qty = row[4] ?? "";
    const dueDate = row[5] ?? "";
    const status = row[6] ?? "";

    if (status === "Completed") {
      continue;
    }

    if (!grouped.has(id)) {

      grouped.set(id, {
        id,
        customer,
        dueDate,
        status,
        items: [],
      });

    }

    grouped.get(id)!.items.push({
      item,
      color,
      qty,
    });

  }

  return [...grouped.values()];
}

export async function createOrder(
  customer: string,
  dueDate: string,
  products: {
    item: string;
    color: string;
    qty: number;
  }[]
) {

  const rows = await getSheetValues("Orders");

  const existingIds = rows
    .slice(1)
    .map((row) => row[0] ?? "");

  const orderId =
    generateOrderId(existingIds);

  const values = products.map((product) => [
    orderId,
    customer,
    product.item,
    product.color,
    String(product.qty),
    dueDate,
    "Waiting",
    "",
  ]);

  await appendSheetValues(
    "Orders",
    values
  );

  return orderId;
}

export async function updateOrder(
  orderId: string,
  customer: string,
  dueDate: string,
  products: {
    item: string;
    color: string;
    qty: number;
  }[]
) {

  const sheet = await getSheetValues("Orders");

  if (sheet.length <= 1) {
    throw new Error("Orders sheet is empty.");
  }

  const header = sheet[0];

  const remainingRows = sheet
    .slice(1)
    .filter((row) => row[0] !== orderId);

  const updatedRows = products.map((product) => [
    orderId,
    customer,
    product.item,
    product.color,
    String(product.qty),
    dueDate,
    "Waiting",
    "",
  ]);

  await replaceSheetValues(
    "Orders",
    [
      ...remainingRows,
      ...updatedRows,
    ]
  );

}

export async function deleteOrder(
  orderId: string
) {
  const sheet = await getSheetValues("Orders");

  if (sheet.length <= 1) {
    return;
  }

  const remainingRows = sheet
    .slice(1)
    .filter((row) => row[0] !== orderId);

  await replaceSheetValues(
    "Orders",
    remainingRows
  );
}