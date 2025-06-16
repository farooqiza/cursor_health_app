import { NextResponse } from 'next/server';
import { getSheetData } from '@/lib/googleSheets';
import { searchWebForProcedure } from '@/lib/webSearch';
import { Procedure } from '@/components/ProcedureCard';

// Define a type that can handle both sheet data and procedure data
type SheetDataRow = { [key: string]: string };
type ApiData = Procedure[] | SheetDataRow[];

export async function GET() {
  try {
    let data: ApiData = await getSheetData();

    // If the primary data source is empty, use the web search fallback.
    // In a real app, this would be more sophisticated, likely checking
    // if a *specific* search query yielded zero results from the sheet.
    if (!data || data.length === 0) {
      console.log("Primary data source empty, initiating web search fallback...");
      data = await searchWebForProcedure("general health checkup");
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: 'Failed to fetch sheet data' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 