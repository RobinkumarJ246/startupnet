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
      key.toLowerCase().includes('state') || key === 'State Name'
    ) || 'State Name';
    
    const districtColumn = Object.keys(firstRecord).find(key => 
      key.toLowerCase().includes('district') || key === 'District Name'
    ) || 'District Name';
    
    const universityColumn = Object.keys(firstRecord).find(key => 
      key.toLowerCase().includes('university') || key === 'University Name'
    ) || 'University Name';
    
    const collegeColumn = Object.keys(firstRecord).find(key => 
      key.toLowerCase().includes('college') || key === 'College Name'
    ) || 'College Name';
    
    // Helper function to normalize university name for comparison
    const normalizeUniversityName = (name) => {
      // Remove any ID and trim
      return name.replace(/\s*\(Id:\s*[^\)]+\)\s*$/, '').trim();
    };
    
    // Function to extract university ID for better matching
    const extractUniversityId = (name) => {
      const match = name.match(/\(Id:\s*([^\)]+)\)/);
      return match ? match[1] : null;
    };
    
    // We need more flexible matching to find the university
    // Try to match by exact string first
    let filteredRecords = records.filter(record => record[universityColumn] === university);
    
    // If no matches found, try matching by ID if available
    if (filteredRecords.length === 0) {
      const universityId = extractUniversityId(university);
      if (universityId) {
        filteredRecords = records.filter(record => {
          const recordId = extractUniversityId(record[universityColumn]);
          return recordId === universityId;
        });
      }
    }
    
    // If still no matches, try matching by normalized name
    if (filteredRecords.length === 0) {
      const normalizedUniversity = normalizeUniversityName(university);
      filteredRecords = records.filter(record => {
        const normalizedRecord = normalizeUniversityName(record[universityColumn]);
        return normalizedRecord === normalizedUniversity;
      });
    }
    
    // Apply additional filters if provided
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