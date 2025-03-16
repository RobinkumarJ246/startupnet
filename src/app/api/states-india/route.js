import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export async function GET() {
  try {
    // Path to the CSV file
    const filePath = path.join(process.cwd(), 'src', 'app', 'utils', 'univ-col-india-db.csv');
    
    // Read the CSV file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse the CSV data
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });
    
    // Log the first record to see the structure
    if (records.length > 0) {
      console.log('First CSV record:', records[0]);
    }
    
    // Extract unique states - get column names directly from the first record
    const firstRecord = records[0] || {};
    const stateColumn = Object.keys(firstRecord).find(key => 
      key.toLowerCase().includes('state') || key === 'State'
    ) || 'State';
    
    const uniqueStates = [...new Set(records.map(record => record[stateColumn]))].filter(Boolean).sort();
    
    // Return the list of states
    return NextResponse.json({ states: uniqueStates });
  } catch (error) {
    console.error('Error fetching states:', error);
    return NextResponse.json(
      { error: 'Failed to fetch states' },
      { status: 500 }
    );
  }
} 