import {
  getSheetValues,
  updateCell,
} from "@/lib/googleSheets";
import { canonicalColour, canonicalPartName } from "@/lib/domain/normalization";
import { nonNegativeNumber, requiredText } from "@/lib/domain/sheetParsing";

const SHEET = "Shop Parts Inventory";

const PART_COLUMN = 1;
const COLOUR_COLUMN = 2;
const QUANTITY_COLUMN = 3;
const MINIMUM_COLUMN = 4;
const WARNING_COLUMN = 5;

export type InventoryItem = {
  row: number;
  part: string;
  colour: string;

  quantity: number;
  minimum: number;
  warning: number;
};

export async function getInventory(): Promise<InventoryItem[]> {

  const rows = await getSheetValues(SHEET);

  return rows
    .slice(1)
    .map((row, index) => ({
      row: index + 2,
      part: canonicalPartName(requiredText(SHEET, index + 2, "Part Name", row[PART_COLUMN - 1])),
      colour: canonicalColour(requiredText(SHEET, index + 2, "Color", row[COLOUR_COLUMN - 1])),
      quantity: nonNegativeNumber(SHEET, index + 2, "In Stock", row[QUANTITY_COLUMN - 1]),
      minimum: nonNegativeNumber(SHEET, index + 2, "Min Level", row[MINIMUM_COLUMN - 1]),
      warning: nonNegativeNumber(SHEET, index + 2, "Warn Level", row[WARNING_COLUMN - 1]),
    }));

}

export async function addInventory(
  part: string,
  colour: string,
  quantity: number
) {

  const inventory = await getInventory();

  const item = inventory.find(
    (i) =>
      i.part === part &&
      i.colour === colour
  );

  if (!item) {
    throw new Error(
      `Inventory item not found: ${part} (${colour})`
    );
  }

  const newQuantity =
    item.quantity + quantity;

  await updateCell(
    SHEET,
    item.row,
    QUANTITY_COLUMN,
    newQuantity
  );

  return {
    success: true,
    previousQuantity: item.quantity,
    newQuantity,
  };

}

export async function removeInventory(
  part: string,
  colour: string,
  quantity: number
) {

  return addInventory(
    part,
    colour,
    -quantity
  );

}

export async function setInventory(
  part: string,
  colour: string,
  quantity: number
) {

  const inventory = await getInventory();

  const item = inventory.find(
    (i) =>
      i.part === part &&
      i.colour === colour
  );

  if (!item) {
    throw new Error(
      `Inventory item not found: ${part} (${colour})`
    );
  }

  await updateCell(
    SHEET,
    item.row,
    QUANTITY_COLUMN,
    quantity
  );

  return {
    success: true,
  };

}

export async function findInventory(
  part: string,
  colour: string
): Promise<InventoryItem | undefined> {

  const inventory =
    await getInventory();

  return inventory.find(
    (i) =>
      i.part === part &&
      i.colour === colour
  );

}