// Read-only, server-side verification. Never prints raw orders or transport errors.
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import nextEnv from '@next/env';

nextEnv.loadEnvConfig(process.cwd(), false, { info() {}, error() {} });
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('@/')) {
      return nextResolve(pathToFileURL(resolve('src', specifier.slice(2)) + '.ts').href, context);
    }
    if (specifier.startsWith('.') && context.parentURL?.endsWith('.ts') && !specifier.endsWith('.ts')) {
      const candidate = new URL(specifier + '.ts', context.parentURL);
      if (existsSync(fileURLToPath(candidate))) return nextResolve(candidate.href, context);
    }
    return nextResolve(specifier, context);
  },
});

try {
  const { getSheetValues } = await import('../src/lib/googleSheets.ts');
  const tabs = ['Orders', 'BOM', 'Shop Parts Inventory', 'Parts', 'CNC Files', 'Colours'];
  const rows = Object.fromEntries(await Promise.all(tabs.map(async (tab) => [tab, await getSheetValues(tab)])));
  console.log(JSON.stringify({ sheetCounts: Object.fromEntries(tabs.map((tab) => [tab, rows[tab].length - 1])) }));
  console.log(JSON.stringify({
    completedRowsWithBlankId: rows.Orders.slice(1).filter((r) => !String(r[0] ?? '').trim() && r[6] === 'Completed').length,
    unknownStatusRows: rows.Orders.slice(1).filter((r) => !['Waiting', 'Completed'].includes(r[6])).length,
  }));
  for (const name of ['Sapphire Table Top', 'Luxe Table Top', 'Luxe Logo Slat', 'Base Bottoms', 'Table Uprights']) {
    console.log(JSON.stringify({ name,
      bomRows: rows.BOM.flatMap((r, i) => r[1] === name ? [i + 1] : []),
      inventory: rows['Shop Parts Inventory'].flatMap((r, i) => r[0] === name ? [{ row: i + 1, color: r[1], quantity: r[2] }] : []),
      parts: rows.Parts.flatMap((r, i) => r[0] === name ? [{ row: i + 1, machine: r[1], cncFile: r[2] }] : []),
    }));
  }
  console.log(JSON.stringify({ cncHeaders: rows['CNC Files'][0], cnc: rows['CNC Files'].slice(1).map((r, i) => ({ row: i + 2, file: r[0], part: r[1], qtyPerBoard: r[2], boardsPerFile: r[3], multiColor: r[4], fixedColor: r[5] ?? '', runDriver: r[6] ?? '' })) }));
  const { getOrders } = await import('../src/services/orders.ts');
  const { getBom } = await import('../src/services/bom.ts');
  const { getInventory } = await import('../src/services/inventory.ts');
  const { getParts, getCNCFiles } = await import('../src/services/parts.ts');
  const { calculateProductionPlan } = await import('../src/lib/domain/productionCalculations.ts');
  const [orders, bom, inventory, parts, cncFiles] = await Promise.all([getOrders(), getBom(), getInventory(), getParts(), getCNCFiles()]);
  console.log(JSON.stringify({ activeOrders: orders.length, activeLines: orders.reduce((n, o) => n + o.items.length, 0), activeUnits: orders.reduce((n, o) => n + o.items.reduce((s, i) => s + Number(i.qty), 0), 0), inventoryZero: inventory.filter((i) => i.quantity === 0).length }));
  const plan = calculateProductionPlan(orders.map((o) => ({ status: o.status, items: o.items.map((i) => ({ ...i, qty: Number(i.qty) })) })), bom, inventory, parts, cncFiles);
  console.log(JSON.stringify({
    duplicateInventoryKeys: inventory.length - new Set(inventory.map((i) => `${i.part}|${i.colour}`)).size,
    invalidInventoryQuantities: inventory.filter((i) => !Number.isInteger(i.quantity) || i.quantity < 0).length,
    obsoleteTopNames: [bom.map((i) => i.part), parts.map((i) => i.name), inventory.map((i) => i.part), cncFiles.map((i) => i.partName)].flat().filter((name) => ['Sapphire Sapphire Top', 'Luxe Top'].includes(name)).length,
    groupedRuns: plan.cncRuns.map((r) => ({ file: r.fileName, runs: r.completeRunsRequired })),
    physicalBoards: plan.cncRuns.reduce((n, r) => n + r.completeRunsRequired * r.totalBoardsPerRun, 0),
    fixedColorBoards: plan.cncRuns.reduce((n, r) => n + r.completeRunsRequired * r.fixedColorBoardsPerRun, 0),
    customerColorBoards: plan.cncRuns.reduce((n, r) => n + r.completeRunsRequired * r.customerColorBoardsPerRun, 0),
    uncoveredCncShortages: plan.requirements.filter((r) => r.machine === 'CNC' && plan.cncRuns.flatMap((run) => run.outputs).filter((o) => o.partName === r.part && o.color === r.color).reduce((n, o) => n + o.quantityCredited, 0) < r.shortage).length,
  }));
  console.log(JSON.stringify({ totals: { requirementRows: plan.requirements.length, requiredParts: plan.requirements.reduce((s, r) => s + r.required, 0), shortageRows: plan.requirements.filter((r) => r.shortage > 0).length, shortageParts: plan.requirements.reduce((s, r) => s + r.shortage, 0), nonCncShortageRows: plan.requirements.filter((r) => r.machine !== 'CNC' && r.shortage > 0).length, nonCncShortageParts: plan.requirements.filter((r) => r.machine !== 'CNC').reduce((s, r) => s + r.shortage, 0), cncFiles: plan.cncRuns.length, cncRuns: plan.cncRuns.reduce((s, r) => s + r.completeRunsRequired, 0) }, baseBottom: plan.cncRuns.filter((r) => r.fileName === '5x12 Base Bottom'), validation: plan.cncRuns.flatMap((r) => r.validationErrors) }, null, 2));
} catch (error) {
  if (error?.name === 'SheetValidationError') console.error(JSON.stringify({ sheet: error.sheet, row: error.row, field: error.field }));
  console.error(JSON.stringify({ errorType: error?.constructor?.name, code: typeof error?.code === 'string' && /^[A-Z_]+$/.test(error.code) ? error.code : undefined, httpStatus: error?.response?.status, configured: ['GOOGLE_PROJECT_ID', 'GOOGLE_CLIENT_EMAIL', 'GOOGLE_PRIVATE_KEY', 'GOOGLE_SHEET_ID'].every((key) => Boolean(process.env[key])) }));
  // Google transport errors can contain credentials and request URLs.
  const message = error instanceof Error ? error.message : '';
  console.error(/^(Duplicate CNC mappings|CNC metadata|CNC mapping|Inventory row is missing|CNC Files row)/.test(message) ? message : 'Verification failed; transport/unknown error details withheld.');
  process.exitCode = 1;
}

