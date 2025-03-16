import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export async function GET(request) {
  try {
    // Get the query parameters
    const { searchParams } = new URL(request.url);
    const university = searchParams.get('university');
    const state = searchParams.get('state');
    const district = searchParams.get('district');
    
    if (!university) {
      return NextResponse.json(
        { error: 'University parameter is required' },
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
    
    // Determine the column names based on the actual CSV structure
    const stateColumn = Object.keys(firstRecord).find(key => 
      key.toLowerCase().includes('state') || key === 'State'
    ) || 'State';
    
    const districtColumn = Object.keys(firstRecord).find(key => 
      key.toLowerCase().includes('district') || key === 'District'
    ) || 'District';
    
    const universityColumn = Object.keys(firstRecord).find(key => 
      key.toLowerCase().includes('university') || key === 'University'
    ) || 'University';
    
    const collegeColumn = Object.keys(firstRecord).find(key => 
      key.toLowerCase().includes('college') || key === 'College'
    ) || 'College';
    
    // Filter records based on university, state and district
    let filteredRecords = records.filter(record => record[universityColumn] === university);
    
    if (state) {
      filteredRecords = filteredRecords.filter(record => record[stateColumn] === state);
    }
    
    if (district) {
      filteredRecords = filteredRecords.filter(record => record[districtColumn] === district);
    }
    
    // Extract unique colleges
    const uniqueColleges = [...new Set(
      filteredRecords.map(record => record[collegeColumn])
    )].filter(Boolean).sort();
    
    // Return the list of colleges
    return NextResponse.json({ colleges: uniqueColleges });
  } catch (error) {
    console.error('Error fetching colleges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch colleges' },
      { status: 500 }
    );
  }
} 