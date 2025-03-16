import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export async function GET(request) {
  try {
    // Get the selected state from the query parameters
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    
    if (!state) {
      return NextResponse.json(
        { error: 'State parameter is required' },
        { status: 400 }
      );
    }
    
    // Path to the CSV file
    const filePath = path.join(process.cwd(), 'src', 'app', 'utils', 'univ-col-india-db.csv');
    
    // Read the CSV file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse the CSV data
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });
    
    // Get column names from the first record
    const firstRecord = records[0] || {};
    const stateColumn = Object.keys(firstRecord).find(key => 
      key.toLowerCase().includes('state') || key === 'State'
    ) || 'State';
    
    const districtColumn = Object.keys(firstRecord).find(key => 
      key.toLowerCase().includes('district') || key === 'District'
    ) || 'District';
    
    // Filter records by state and extract unique districts
    const uniqueDistricts = [...new Set(
      records
        .filter(record => record[stateColumn] === state)
        .map(record => record[districtColumn])
    )].filter(Boolean).sort();
    
    // Return the list of districts
    return NextResponse.json({ districts: uniqueDistricts });
  } catch (error) {
    console.error('Error fetching districts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch districts' },
      { status: 500 }
    );
  }
} 