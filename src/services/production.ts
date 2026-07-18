import { getOrders } from "./orders";
import { getBom } from "./bom";
import { getInventory } from "./inventory";
import { getParts } from "./parts";

export type ProductionPart = {
  part: string;

  required: number;
  inStock: number;
  toCut: number;

  cncFile: string;
  partsPerBoard: number;
  boardsRequired: number;
};

export type ProductionColour = {
  colour: string;

  required: number;
  inStock: number;
  toCut: number;

  cncFile: string;
  partsPerBoard: number;
  boardsRequired: number;
};

export type ProductionGroup = {
  part: string;
  colours: ProductionColour[];
};

export type ProductionMachine = {
  machine: string;
  parts: ProductionGroup[];
};

type ProductionRow = {
  part: string;
  color: string;

  required: number;
  inStock: number;
  toCut: number;

  primaryMachine: string;
  cncFile: string;
  partsPerBoard: number;
  boardsRequired: number;
};

export async function getProduction(): Promise<ProductionMachine[]> {

  const orders = await getOrders();
  const bom = await getBom();
  const inventory = await getInventory();
  const parts = await getParts();
  const bomLookup = new Map<string, typeof bom>();

  for (const item of bom) {

    const existing =
      bomLookup.get(item.product);

    if (existing) {

      existing.push(item);

    } else {

      bomLookup.set(
        item.product,
        [item]
      );

    }

  }

  const requirements = new Map<
    string,
    {
      part: string;
      color: string;
      required: number;
    }
  >();

  //
  // Calculate total required parts
  //

  for (const order of orders) {

    for (const item of order.items) {

      const bomItems =
        bomLookup.get(item.item) ?? [];

      for (const bomItem of bomItems) {

        const key = `${bomItem.part}|${item.color}`;

        const existing = requirements.get(key);

        const qtyRequired =
          bomItem.qtyPerUnit *
          Number(item.qty);

        if (existing) {

          existing.required += qtyRequired;

        } else {

          requirements.set(key, {
            part: bomItem.part,
            color: item.color,
            required: qtyRequired,
          });

        }

      }

    }

  }

  //
  // Compare against inventory
  //

  const production: ProductionRow[] = [];

  for (const requirement of requirements.values()) {

    const stock = inventory.find(
     (i) =>
       i.part === requirement.part &&
       i.colour === requirement.color
    );

    const inStock = stock?.quantity ?? 0;

    const toCut =
      Math.max(
        requirement.required - inStock,
        0
      );

    if (toCut > 0) {

     const partInfo =
      parts.find(
       (p) => p.name === requirement.part
      );

     const partsPerBoard =
       partInfo?.partsPerBoard ?? 0;

     const boardsRequired =
       partsPerBoard > 0
         ? Math.ceil(toCut / partsPerBoard)
         : 0;

     production.push({
       part: requirement.part,
       color: requirement.color,

       required: requirement.required,
       inStock,
       toCut,

       primaryMachine:
         partInfo?.primaryMachine ?? "",

       cncFile:
         partInfo?.cncFile ?? "",

       partsPerBoard,

       boardsRequired,
     });

    }

  }

  production.sort(
    (a, b) => b.toCut - a.toCut
  );

  const grouped = new Map<
   string,
   Map<string, ProductionColour[]>
  >();

  for (const item of production) {

    if (!grouped.has(item.primaryMachine)) {

     grouped.set(
       item.primaryMachine,
       new Map()
      );

    }

    const machine =
     grouped.get(item.primaryMachine)!;

    if (!machine.has(item.part)) {

     machine.set(
       item.part,
       []
      );

    }

    machine.get(item.part)!.push({

     colour: item.color,

     required: item.required,
     inStock: item.inStock,
     toCut: item.toCut,

     cncFile: item.cncFile,
     partsPerBoard: item.partsPerBoard,
     boardsRequired: item.boardsRequired,

    });

  }

  const result: ProductionMachine[] = [];

  for (const [machine, parts] of grouped) {

   result.push({

     machine,

     parts: [...parts.entries()].map(

       ([part, colours]) => ({

         part,

         colours: colours.sort(

           (a, b) =>

             b.toCut - a.toCut

          ),

        })

      ),

    });

  }

  result.sort(

   (a, b) =>

     a.machine.localeCompare(b.machine)

  );

 return result;

}