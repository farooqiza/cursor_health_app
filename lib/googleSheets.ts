import { google } from 'googleapis';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

// Define the return type for sheet data
interface SheetDataRow {
  [key: string]: string;
}

export async function getSheets() {
  const scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
  
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;

  if (!privateKey || !clientEmail) {
    throw new Error("Missing Google Sheets credentials in .env.local");
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes,
  });

  const sheets = google.sheets({ version: 'v4', auth });
  return sheets;
}

export async function getSheetData(): Promise<SheetDataRow[]> {
  const cacheKey = 'sheetData';
  const cachedData = cache.get<SheetDataRow[]>(cacheKey);

  if (cachedData) {
    console.log("Returning cached data");
    return cachedData;
  }

  console.log("Fetching fresh data from Google Sheets");
  const sheets = await getSheets();
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!sheetId) {
    throw new Error("Missing GOOGLE_SHEET_ID in .env.local");
  }

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sheet1', // Assumes data is on a sheet named 'Sheet1'
    });

    const rows = response.data.values;
    if (rows && rows.length) {
      // Assuming the first row is the header
      const headers = rows[0].map((h: string) => h.toLowerCase().replace(/\s+/g, ''));
      
      const data: SheetDataRow[] = rows.slice(1).map((row: string[]) => {
        const rowData: SheetDataRow = {};
        headers.forEach((header: string, index: number) => {
          rowData[header] = row[index] || '';
        });
        return rowData;
      });

      cache.set(cacheKey, data);
      return data;
    }
    return [];
  } catch (err) {
    console.error("Error fetching sheet data:", err);
    throw new Error("Failed to fetch data from Google Sheets.");
  }
} 