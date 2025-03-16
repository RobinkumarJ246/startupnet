import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// List of IITs and NITs with their IDs
const SPECIAL_INSTITUTIONS = {
  IITs: [
    { name: 'Indian Institute of Technology, Delhi', id: 'U-IIT01' },
    { name: 'Indian Institute of Technology, Bombay', id: 'U-IIT02' },
    { name: 'Indian Institute of Technology, Madras', id: 'U-IIT03' },
    { name: 'Indian Institute of Technology, Kanpur', id: 'U-IIT04' },
    { name: 'Indian Institute of Technology, Kharagpur', id: 'U-IIT05' },
    { name: 'Indian Institute of Technology, Guwahati', id: 'U-IIT06' },
    { name: 'Indian Institute of Technology, Hyderabad', id: 'U-IIT07' },
    { name: 'Indian Institute of Technology, Gandhinagar', id: 'U-IIT08' },
    { name: 'Indian Institute of Technology, Ropar', id: 'U-IIT09' },
    { name: 'Indian Institute of Technology, Bhubaneswar', id: 'U-IIT10' },
    { name: 'Indian Institute of Technology, Jodhpur', id: 'U-IIT11' },
    { name: 'Indian Institute of Technology, Patna', id: 'U-IIT12' },
    { name: 'Indian Institute of Technology, Indore', id: 'U-IIT13' },
    { name: 'Indian Institute of Technology, Mandi', id: 'U-IIT14' },
    { name: 'Indian Institute of Technology, Varanasi (BHU)', id: 'U-IIT15' },
    { name: 'Indian Institute of Technology, Palakkad', id: 'U-IIT16' },
    { name: 'Indian Institute of Technology, Tirupati', id: 'U-IIT17' },
    { name: 'Indian Institute of Technology, Dhanbad (ISM)', id: 'U-IIT18' },
    { name: 'Indian Institute of Technology, Bhilai', id: 'U-IIT19' },
    { name: 'Indian Institute of Technology, Dharwad', id: 'U-IIT20' },
    { name: 'Indian Institute of Technology, Jammu', id: 'U-IIT21' },
    { name: 'Indian Institute of Technology, Goa', id: 'U-IIT22' },
    { name: 'Indian Institute of Technology (ISM), Dhanbad', id: 'U-IIT23' }
  ],
  NITs: [
    { name: 'National Institute of Technology, Tiruchirappalli', id: 'U-NIT01' },
    { name: 'National Institute of Technology, Surathkal', id: 'U-NIT02' },
    { name: 'National Institute of Technology, Warangal', id: 'U-NIT03' },
    { name: 'National Institute of Technology, Calicut', id: 'U-NIT04' },
    { name: 'National Institute of Technology, Rourkela', id: 'U-NIT05' },
    { name: 'National Institute of Technology, Kurukshetra', id: 'U-NIT06' },
    { name: 'National Institute of Technology, Durgapur', id: 'U-NIT07' },
    { name: 'National Institute of Technology, Silchar', id: 'U-NIT08' },
    { name: 'National Institute of Technology, Hamirpur', id: 'U-NIT09' },
    { name: 'National Institute of Technology, Jaipur', id: 'U-NIT10' },
    { name: 'National Institute of Technology, Jalandhar', id: 'U-NIT11' },
    { name: 'National Institute of Technology, Jamshedpur', id: 'U-NIT12' },
    { name: 'National Institute of Technology, Patna', id: 'U-NIT13' },
    { name: 'National Institute of Technology, Raipur', id: 'U-NIT14' },
    { name: 'National Institute of Technology, Srinagar', id: 'U-NIT15' },
    { name: 'National Institute of Technology, Agartala', id: 'U-NIT16' },
    { name: 'National Institute of Technology, Nagaland', id: 'U-NIT17' },
    { name: 'National Institute of Technology, Manipur', id: 'U-NIT18' },
    { name: 'National Institute of Technology, Meghalaya', id: 'U-NIT19' },
    { name: 'National Institute of Technology, Mizoram', id: 'U-NIT20' },
    { name: 'National Institute of Technology, Arunachal Pradesh', id: 'U-NIT21' },
    { name: 'National Institute of Technology, Sikkim', id: 'U-NIT22' },
    { name: 'National Institute of Technology, Uttarakhand', id: 'U-NIT23' },
    { name: 'National Institute of Technology, Andhra Pradesh', id: 'U-NIT24' },
    { name: 'National Institute of Technology, Delhi', id: 'U-NIT25' },
    { name: 'National Institute of Technology, Goa', id: 'U-NIT26' },
    { name: 'National Institute of Technology, Puducherry', id: 'U-NIT27' }
  ]
};

// Helper function to strip ID from university name
const stripId = (name) => {
  return name.replace(/\s*\(Id:\s*[^\)]+\)\s*$/, '').trim();
};

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
    
    // Read the CSV file
    const filePath = path.join(process.cwd(), 'src', 'app', 'utils', 'univ-col-india-db.csv');
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
    
    // Filter records based on state and district
    let filteredRecords = records;
    
    if (state) {
      filteredRecords = filteredRecords.filter(record => record[stateColumn] === state);
    }
    
    if (district) {
      filteredRecords = filteredRecords.filter(record => record[districtColumn] === district);
    }
    
    // Use a Map to avoid duplicates by keeping track of university IDs
    const universitiesMap = new Map();
    
    // Process filtered records to extract unique universities
    filteredRecords.forEach(record => {
      const universityNameWithId = record[universityColumn];
      // Extract ID and name using regex
      const idMatch = universityNameWithId.match(/\(Id:\s*([^\)]+)\)/);
      const id = idMatch ? idMatch[1] : '';
      const name = stripId(universityNameWithId);
      
      // Only add if this ID is not already in the map
      if (id && !universitiesMap.has(id)) {
        universitiesMap.set(id, { 
          name, 
          id,
          value: universityNameWithId // Keep the original value for exact matching
        });
      } else if (!id && !universitiesMap.has(name)) {
        // For universities without ID, use name as key
        universitiesMap.set(name, { 
          name, 
          id: '',
          value: universityNameWithId
        });
      }
    });

    // Convert Map to array
    let uniqueUniversities = Array.from(universitiesMap.values());

    // Add IITs and NITs if no state/district filter is applied
    let allUniversities = [...uniqueUniversities];
    
    if (!state && !district) {
      // Convert special institutions to the same format
      const formattedIITs = SPECIAL_INSTITUTIONS.IITs.map(iit => ({
        name: iit.name,
        id: iit.id,
        value: `${iit.name} (Id: ${iit.id})`
      }));
      
      const formattedNITs = SPECIAL_INSTITUTIONS.NITs.map(nit => ({
        name: nit.name,
        id: nit.id,
        value: `${nit.name} (Id: ${nit.id})`
      }));
      
      allUniversities = [
        ...formattedIITs,
        ...formattedNITs,
        ...uniqueUniversities
      ];
    }
    
    // Sort universities by name
    allUniversities.sort((a, b) => a.name.localeCompare(b.name));
    
    // Return the list of universities
    return NextResponse.json({ universities: allUniversities });
  } catch (error) {
    console.error('Error fetching universities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch universities' },
      { status: 500 }
    );
  }
} 