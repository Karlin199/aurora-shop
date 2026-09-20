export class SheetValidationError extends Error {
  readonly sheet: string;
  readonly row: number;
  readonly field: string;

  constructor(sheet: string, row: number, field: string, message: string) {
    super(`${sheet} row ${row}, ${field}: ${message}`);
    this.name = "SheetValidationError";
    this.sheet = sheet;
    this.row = row;
    this.field = field;
  }
}

export class SheetValidationAggregateError extends Error {
  readonly errors: SheetValidationError[];

  constructor(errors: SheetValidationError[]) {
    super(errors.map((error) => error.message).join("; "));
    this.name = "SheetValidationAggregateError";
    this.errors = errors;
  }
}

export function requiredText(sheet: string, row: number, field: string, value: string | undefined): string {
  const parsed = String(value ?? "").trim();
  if (!parsed) {
    throw new SheetValidationError(sheet, row, field, "value is required");
  }
  return parsed;
}

export function requiredNumber(sheet: string, row: number, field: string, value: string | undefined): number {
  const raw = String(value ?? "").trim();
  if (!raw) {
    throw new SheetValidationError(sheet, row, field, "value is unknown because the cell is blank");
  }

  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    throw new SheetValidationError(sheet, row, field, `invalid number: ${raw}`);
  }
  return parsed;
}

export function nonNegativeNumber(sheet: string, row: number, field: string, value: string | undefined): number {
  const parsed = requiredNumber(sheet, row, field, value);
  if (parsed < 0) {
    throw new SheetValidationError(sheet, row, field, "value must not be negative");
  }
  return parsed;
}

export function positiveInteger(sheet: string, row: number, field: string, value: string | undefined): number {
  const parsed = requiredNumber(sheet, row, field, value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new SheetValidationError(sheet, row, field, "value must be a positive integer");
  }
  return parsed;
}
