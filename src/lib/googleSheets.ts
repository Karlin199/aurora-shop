import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  credentials: {
    project_id: process.env.GOOGLE_PROJECT_ID,
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(
      /\\n/g,
      "\n"
    ),
  },
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
  ],
});

const sheets = google.sheets({
  version: "v4",
  auth,
});

const spreadsheetId = process.env.GOOGLE_SHEET_ID!;

export async function getSheetValues(
  sheetName: string
) {
  const response =
    await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:Z`,
    });

  return response.data.values ?? [];
}

export async function appendSheetValues(
  sheetName: string,
  values: string[][]
) {
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:Z`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values,
    },
  });
}

export async function updateSheetValues(
  range: string,
  values: string[][]
) {
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values,
    },
  });
}

export async function clearSheetRange(
  range: string
) {
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range,
    requestBody: {},
  });
}

export async function getSpreadsheet() {
  const response =
    await sheets.spreadsheets.get({
      spreadsheetId,
    });

  return response.data;
}

export async function deleteRows(
  sheetId: number,
  startIndex: number,
  endIndex: number
) {
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: "ROWS",
              startIndex,
              endIndex,
            },
          },
        },
      ],
    },
  });
}

export async function insertRows(
  sheetId: number,
  startIndex: number,
  endIndex: number
) {
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          insertDimension: {
            range: {
              sheetId,
              dimension: "ROWS",
              startIndex,
              endIndex,
            },
            inheritFromBefore: false,
          },
        },
      ],
    },
  });
}

export async function getSheetId(
  sheetName: string
): Promise<number> {

  const spreadsheet =
    await getSpreadsheet();

  const sheet =
    spreadsheet.sheets?.find(
      (sheet) =>
        sheet.properties?.title === sheetName
    );

  const sheetId = sheet?.properties?.sheetId;

  if (sheetId == null) {
   throw new Error(
     `Sheet "${sheetName}" not found.`
    );
  }

  return sheetId;

}

export async function replaceSheetValues(
  sheetName: string,
  values: string[][]
) {

  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: `${sheetName}!A2:Z`,
    requestBody: {},
  });

  if (values.length === 0) {
    return;
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${sheetName}!A2`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values,
    },
  });

}

export async function updateCell(
  sheetName: string,
  row: number,
  column: number,
  value: string | number
) {
  function columnLetter(col: number): string {
    let letter = "";

    while (col > 0) {
      const mod = (col - 1) % 26;
      letter = String.fromCharCode(65 + mod) + letter;
      col = Math.floor((col - mod) / 26);
    }

    return letter;
  }

  const cell = `${columnLetter(column)}${row}`;

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${sheetName}!${cell}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[value]],
    },
  });
}