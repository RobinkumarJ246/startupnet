import { NextResponse } from 'next/server';

// Cache the fetched data to avoid making API calls on every request
const cache = {
  countries: null,
  universities: {},
  lastFetch: {}
};

// Cache expiration time (24 hours)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

// Function to fetch countries
async function fetchCountries() {
  if (cache.countries && (Date.now() - cache.lastFetch.countries < CACHE_EXPIRATION)) {
    return cache.countries;
  }
  
  try {
    const response = await fetch('http://universities.hipolabs.com/search?');
    const data = await response.json();
    
    // Extract unique countries
    const countries = [...new Set(data.map(uni => uni.country))].sort();
    
    // Update cache
    cache.countries = countries;
    cache.lastFetch.countries = Date.now();
    
    return countries;
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
}

// Function to fetch universities by country
async function fetchUniversitiesByCountry(country) {
  // Check cache first
  if (
    cache.universities[country] && 
    (Date.now() - (cache.lastFetch[country] || 0) < CACHE_EXPIRATION)
  ) {
    return cache.universities[country];
  }
  
  try {
    const encodedCountry = encodeURIComponent(country);
    const response = await fetch(`http://universities.hipolabs.com/search?country=${encodedCountry}`);
    const data = await response.json();
    
    // Process the data to match our format
    const universities = data.map(uni => ({
      name: uni.name,
      country: uni.country,
      alpha_two_code: uni.alpha_two_code,
      web_pages: uni.web_pages
    }));
    
    // Update cache
    cache.universities[country] = universities;
    cache.lastFetch[country] = Date.now();
    
    return universities;
  } catch (error) {
    console.error(`Error fetching universities for ${country}:`, error);
    throw error;
  }
}

export async function GET(request) {
  try {
    // Get the query parameters
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');
    
    if (!country) {
      return NextResponse.json(
        { error: 'Country parameter is required' },
        { status: 400 }
      );
    }
    
    // Fetch universities from Hipolabs API
    const response = await fetch(`http://universities.hipolabs.com/search?country=${encodeURIComponent(country)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch universities from API: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Map the data to our format
    const universities = data.map(uni => ({
      name: uni.name,
      country: uni.country,
      alpha_two_code: uni.alpha_two_code,
      web_pages: uni.web_pages
    }));
    
    // Return the list of universities
    return NextResponse.json({ universities });
  } catch (error) {
    console.error('Error fetching global universities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch universities' },
      { status: 500 }
    );
  }
} 