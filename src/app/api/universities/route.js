import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// Cache the parsed data to avoid reading the file on every request
let cachedData = null;

// Function to read and parse the CSV file
const readCSVFile = () => {
  if (cachedData) return cachedData;
  
  try {
    const filePath = path.join(process.cwd(), 'src', 'app', 'utils', 'univ-col-india-db.csv');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse CSV content
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    
    // Process the data to create a structured format
    const universities = {};
    const states = new Set();
    const districts = {};
    
    records.forEach(record => {
      const universityName = record['University Name']?.trim();
      const collegeName = record['College Name']?.trim();
      const stateName = record['State Name']?.trim();
      const districtName = record['District Name']?.trim();
      
      if (stateName) {
        states.add(stateName);
        
        // Add district to the state
        if (districtName) {
          if (!districts[stateName]) {
            districts[stateName] = new Set();
          }
          districts[stateName].add(districtName);
        }
      }
      
      if (universityName) {
        if (!universities[universityName]) {
          universities[universityName] = {
            name: universityName,
            state: stateName,
            district: districtName,
            colleges: []
          };
        }
        
        if (collegeName) {
          universities[universityName].colleges.push({
            name: collegeName,
            type: record['College Type']?.trim() || 'Unknown'
          });
        }
      }
    });
    
    // Convert Sets to arrays and sort
    const statesArray = Array.from(states).sort();
    const districtsObject = {};
    
    Object.keys(districts).forEach(state => {
      districtsObject[state] = Array.from(districts[state]).sort();
    });
    
    // Create the final structured data
    cachedData = {
      states: statesArray,
      districts: districtsObject,
      universities: Object.values(universities)
    };
    
    return cachedData;
  } catch (error) {
    console.error('Error reading or parsing CSV file:', error);
    return null;
  }
};

export async function GET(request) {
  try {
    // Get the query parameters
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    const district = searchParams.get('district');
    
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
    
    // Filter records based on state and district
    let filteredRecords = records;
    
    if (state) {
      filteredRecords = filteredRecords.filter(record => record[stateColumn] === state);
    }
    
    if (district) {
      filteredRecords = filteredRecords.filter(record => record[districtColumn] === district);
    }
    
    // Extract unique universities
    const uniqueUniversities = [...new Set(
      filteredRecords.map(record => record[universityColumn])
    )].filter(Boolean).sort();
    
    // Return the list of universities
    return NextResponse.json({ universities: uniqueUniversities });
  } catch (error) {
    console.error('Error fetching universities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch universities' },
      { status: 500 }
    );
  }
} 