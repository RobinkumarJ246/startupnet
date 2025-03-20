import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { db } = await connectToDatabase();
    const data = await request.json();

    // Validate required fields
    const requiredFields = [
      'title', 'description', 'startDate', 'endDate', 
      'organizer', 'organizerType', 'type'
    ];
    
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Validate contact info
    if (!data.contactInfo || !data.contactInfo.email || !data.contactInfo.phone) {
      return NextResponse.json(
        { error: "Contact email and phone are required" },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(data.contactInfo.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }
    
    // Validate phone format
    const phoneRegex = /^\+?[0-9\s-]{10,15}$/;
    if (!phoneRegex.test(data.contactInfo.phone)) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }
    
    // Validate website URL if provided
    if (data.contactInfo.website) {
      const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/;
      if (!urlRegex.test(data.contactInfo.website)) {
        return NextResponse.json(
          { error: "Invalid website URL format" },
          { status: 400 }
        );
      }
    }
    
    // Validate social media URLs if provided
    if (data.contactInfo.socialMedia) {
      const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/;
      const socialMedia = data.contactInfo.socialMedia;
      
      for (const [platform, url] of Object.entries(socialMedia)) {
        if (url && !urlRegex.test(url)) {
          return NextResponse.json(
            { error: `Invalid ${platform} URL format` },
            { status: 400 }
          );
        }
      }
    }
    
    // Validate additional publishing modes if enabled
    if (data.additionalPublishing && data.additionalPublishing.enabled) {
      const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/;
      
      if (data.additionalPublishing.problemStatementUrl && 
          !urlRegex.test(data.additionalPublishing.problemStatementUrl)) {
        return NextResponse.json(
          { error: "Invalid problem statement URL format" },
          { status: 400 }
        );
      }
      
      if (data.additionalPublishing.externalFormUrl && 
          !urlRegex.test(data.additionalPublishing.externalFormUrl)) {
        return NextResponse.json(
          { error: "Invalid external form URL format" },
          { status: 400 }
        );
      }
    }

    // Validate event phases if provided
    if (data.phases) {
      // Validate registration phase
      if (data.phases.registration && data.phases.registration.active) {
        if (!data.phases.registration.startDate || !data.phases.registration.endDate) {
          return NextResponse.json(
            { error: "Registration phase requires start and end dates" },
            { status: 400 }
          );
        }
      }
      
      // Validate shortlisting phase if active
      if (data.phases.shortlisting && data.phases.shortlisting.active) {
        if (!data.phases.shortlisting.startDate || 
            !data.phases.shortlisting.endDate || 
            !data.phases.shortlisting.resultsDate) {
          return NextResponse.json(
            { error: "Shortlisting phase requires start date, end date, and results date" },
            { status: 400 }
          );
        }
      }
      
      // Validate event phase
      if (data.phases.event && data.phases.event.active) {
        if (!data.phases.event.startDate || !data.phases.event.endDate) {
          return NextResponse.json(
            { error: "Event phase requires start and end dates" },
            { status: 400 }
          );
        }
      }
      
      // Validate results phase if active
      if (data.phases.results && data.phases.results.active) {
        if (!data.phases.results.announcementDate) {
          return NextResponse.json(
            { error: "Results phase requires announcement date" },
            { status: 400 }
          );
        }
      }
    }
    
    // Validate document submission requirements if enabled
    if (data.submissionRequirements && data.submissionRequirements.requireDocuments) {
      // Ensure at least one document type is required
      if ((!data.submissionRequirements.abstract || !data.submissionRequirements.abstract.required) &&
          (!data.submissionRequirements.presentation || !data.submissionRequirements.presentation.required)) {
        return NextResponse.json(
          { error: "At least one document type must be required when document submission is enabled" },
          { status: 400 }
        );
      }
      
      // Check if abstract is required but no file types are allowed
      if (data.submissionRequirements.abstract && 
          data.submissionRequirements.abstract.required && 
          (!data.submissionRequirements.abstract.allowedFileTypes || 
           data.submissionRequirements.abstract.allowedFileTypes.length === 0)) {
        return NextResponse.json(
          { error: "At least one file type must be allowed for abstract submissions" },
          { status: 400 }
        );
      }
      
      // Check if presentation is required but no file types are allowed
      if (data.submissionRequirements.presentation && 
          data.submissionRequirements.presentation.required && 
          (!data.submissionRequirements.presentation.allowedFileTypes || 
           data.submissionRequirements.presentation.allowedFileTypes.length === 0)) {
        return NextResponse.json(
          { error: "At least one file type must be allowed for presentation submissions" },
          { status: 400 }
        );
      }
    }
    
    // Validate custom registration form if enabled
    if (data.registrationForm && data.registrationForm.enabled) {
      // If using custom template, ensure at least one question exists
      if (data.registrationForm.template === 'custom' && 
          (!data.registrationForm.questions || data.registrationForm.questions.length === 0)) {
        return NextResponse.json(
          { error: "Custom registration form must have at least one question" },
          { status: 400 }
        );
      }
    }

    // Add metadata
    data.createdAt = new Date().toISOString();
    data.updatedAt = new Date().toISOString();
    data.status = 'active';
    
    // Set current phase based on dates
    const now = new Date();
    if (data.phases) {
      if (data.phases.registration && 
          data.phases.registration.active && 
          new Date(data.phases.registration.startDate) <= now && 
          new Date(data.phases.registration.endDate) >= now) {
        data.currentPhase = 'registration';
      } else if (data.phases.shortlisting && 
                data.phases.shortlisting.active && 
                new Date(data.phases.shortlisting.startDate) <= now && 
                new Date(data.phases.shortlisting.endDate) >= now) {
        data.currentPhase = 'shortlisting';
      } else if (data.phases.event && 
                data.phases.event.active && 
                new Date(data.phases.event.startDate) <= now && 
                new Date(data.phases.event.endDate) >= now) {
        data.currentPhase = 'event';
      } else if (data.phases.results && 
                data.phases.results.active && 
                new Date(data.phases.results.announcementDate) <= now) {
        data.currentPhase = 'results';
      } else if (data.phases.registration && 
                data.phases.registration.active && 
                new Date(data.phases.registration.startDate) > now) {
        data.currentPhase = 'upcoming';
      } else {
        data.currentPhase = 'draft';
      }
    }
    
    // Track submissions
    data.submissions = [];
    
    // Insert the event into the database
    const result = await db.collection('events').insertOne(data);
    
    return NextResponse.json({ 
      success: true, 
      eventId: result.insertedId,
      message: 'Hackathon event created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating hackathon event:', error);
    return NextResponse.json(
      { error: 'Failed to create hackathon event' },
      { status: 500 }
    );
  }
} 