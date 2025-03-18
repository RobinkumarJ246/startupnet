'use client';

import { 
  User, 
  Mail, 
  Link as LinkIcon, 
  Edit, 
  MapPin, 
  GraduationCap, 
  Building, 
  Users, 
  Briefcase,
  CalendarDays,
  Phone,
  Globe,
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProfileHeader({ user, onEditClick }) {
  if (!user) return null;

  // Get user-specific data based on type
  const getUserSpecificData = () => {
    switch (user.type) {
      case 'student':
        // Format the education information properly - show college with priority
        let educationInfo = '';
        if (user.college && user.college !== '') {
          educationInfo = `Student at ${user.college}`;
        } else if (user.university) {
          educationInfo = `Student at ${user.university.split(',')[0]}`;
        }
        
        return {
          icon: <GraduationCap className="h-6 w-6 text-white" />,
          iconBgClass: 'bg-indigo-600',
          title: user.name || user.fullName || 'Student User',
          subtitle: educationInfo || 'Student',
          gradientClass: 'from-indigo-500 to-purple-600',
          details: [
            { icon: <MapPin className="h-5 w-5 text-gray-400" />, label: 'Location', value: user.location },
            // Only show university if different from college
            ...(user.college && user.university && user.college !== user.university ? 
              [{ icon: <GraduationCap className="h-5 w-5 text-gray-400" />, label: 'University', value: user.university }] : 
              user.university && !user.college ? 
              [{ icon: <GraduationCap className="h-5 w-5 text-gray-400" />, label: 'University', value: user.university }] : 
              []),
            { icon: <Briefcase className="h-5 w-5 text-gray-400" />, label: 'Major', value: user.major },
            { icon: <CalendarDays className="h-5 w-5 text-gray-400" />, label: 'Graduation Year', value: user.graduationYear },
          ],
        };
      case 'startup':
        return {
          icon: <Building className="h-6 w-6 text-white" />,
          iconBgClass: 'bg-emerald-600',
          title: user.companyName || user.name || 'Startup',
          subtitle: user.industry ? `${user.stage || ''} Startup • ${user.industry}` : 'Startup',
          gradientClass: 'from-emerald-500 to-teal-600',
          details: [
            { icon: <Briefcase className="h-5 w-5 text-gray-400" />, label: 'Industry', value: user.industry },
            { icon: <Building className="h-5 w-5 text-gray-400" />, label: 'Stage', value: user.stage },
            { icon: <CalendarDays className="h-5 w-5 text-gray-400" />, label: 'Founded', value: user.foundingDate },
            { icon: <MapPin className="h-5 w-5 text-gray-400" />, label: 'Location', value: user.location },
          ],
        };
      case 'club':
        return {
          icon: <Users className="h-6 w-6 text-white" />,
          iconBgClass: 'bg-purple-600',
          title: user.clubName || user.name || 'Club',
          subtitle: user.parentOrganization ? `University Club at ${user.parentOrganization.split(',')[0]}` : 'University Club',
          gradientClass: 'from-purple-500 to-indigo-600',
          details: [
            { icon: <Building className="h-5 w-5 text-gray-400" />, label: 'Parent Organization', value: user.parentOrganization },
            { icon: <Users className="h-5 w-5 text-gray-400" />, label: 'Member Count', value: user.memberCount },
            { icon: <CalendarDays className="h-5 w-5 text-gray-400" />, label: 'Founded', value: user.foundedYear },
            { icon: <MapPin className="h-5 w-5 text-gray-400" />, label: 'Location', value: user.location },
          ],
        };
      default:
        return {
          icon: <User className="h-6 w-6 text-white" />,
          iconBgClass: 'bg-gray-600',
          title: user.name || 'User',
          subtitle: 'User',
          gradientClass: 'from-gray-500 to-gray-600',
          details: [],
        };
    }
  };

  const typeSpecificData = getUserSpecificData();

  // Helper function to safely render array values 
  const formatArrayValue = (value) => {
    if (!value) return null;
    
    // If it's already a string, return it
    if (typeof value === 'string') return value;
    
    // If it's an array, join with commas
    if (Array.isArray(value)) return value.join(', ');
    
    // For any other object, stringify it
    return JSON.stringify(value);
  };

  // Format a value for display
  const formatValue = (value) => {
    if (value === null || value === undefined) return 'Not specified';
    
    if (typeof value === 'string') {
      // Check if this might be a stringified JSON object
      if (value.startsWith('{') && value.endsWith('}')) {
        try {
          // Try to parse it as JSON
          const parsedValue = JSON.parse(value);
          
          // Handle location objects specifically
          if (parsedValue.street || parsedValue.city || parsedValue.state || parsedValue.country) {
            const parts = [];
            if (parsedValue.street) parts.push(parsedValue.street);
            if (parsedValue.city) parts.push(parsedValue.city);
            if (parsedValue.state) parts.push(parsedValue.state);
            if (parsedValue.country) parts.push(parsedValue.country);
            return parts.join(', ');
          }
          
          // Other objects, convert to string representation
          return Object.values(parsedValue).filter(Boolean).join(', ');
        } catch (e) {
          // If parsing fails, just return the original string
          return value;
        }
      }
      return value;
    }
    
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    
    // Handle location objects directly
    if (typeof value === 'object' && value !== null) {
      if (value.street || value.city || value.state || value.country) {
        const parts = [];
        if (value.street) parts.push(value.street);
        if (value.city) parts.push(value.city);
        if (value.state) parts.push(value.state);
        if (value.country) parts.push(value.country);
        return parts.join(', ');
      }
      
      // For other objects, join non-empty values
      return Object.values(value).filter(Boolean).join(', ');
    }
    
    return String(value);
  };

  // Filter out any details that are already shown elsewhere
  const filterVisibleDetails = (details) => {
    return details.filter(detail => {
      // Skip location for startups as it's shown in the main section
      if (user.type === 'startup' && detail.label === 'Location') return false;
      
      const value = detail.value;
      
      // Check for null/undefined/empty string
      if (value === null || value === undefined || value === '') return false;
      
      // Check for empty objects
      if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) return false;
      
      // Check for empty arrays
      if (Array.isArray(value) && value.length === 0) return false;
      
      // For strings that are "Not specified"
      if (value === 'Not specified') return false;
      
      // Otherwise keep it
      return true;
    });
  };

  // Get filtered details to display
  const visibleDetails = filterVisibleDetails(typeSpecificData.details);

  // Extract skills if available - ensure we don't get an error if skills is null
  let skillsList = [];
  if (user.skills) {
    if (typeof user.skills === 'string') {
      skillsList = user.skills.split(',').map(s => s.trim()).filter(s => s);
    } else if (Array.isArray(user.skills)) {
      skillsList = user.skills.map(s => s.trim()).filter(s => s);
    }
  }
  
  const hasSkills = skillsList.length > 0;

  // Check if user has a profile picture - Check multiple possible field names
  const hasProfilePic = user.profileImage || user.profilePicture || user.avatar || user.logo;
  const profilePicUrl = hasProfilePic 
    ? `/api/profile/image/${user._id}`
    : null;
    
  console.log('Profile pic data:', { hasProfilePic, userId: user._id });

  return (
    <div className="bg-white shadow rounded-xl overflow-hidden mb-8">
      {/* Cover Photo */}
      <div className={`h-40 md:h-56 bg-gradient-to-r ${typeSpecificData.gradientClass} relative`}>
        <button
          onClick={onEditClick}
          className="absolute top-4 right-4 bg-white bg-opacity-20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-opacity-30 transition-colors z-10"
        >
          <Edit className="h-5 w-5" />
        </button>
      </div>

      {/* Profile Info Section */}
      <div className="relative px-6 pb-6">
        {/* Profile Photo */}
        <div className="absolute -top-16 left-6">
          <div className={`${profilePicUrl ? '' : typeSpecificData.iconBgClass} h-28 w-28 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg overflow-hidden`}>
            {profilePicUrl ? (
              <Image 
                src={profilePicUrl} 
                alt={typeSpecificData.title}
                width={112}
                height={112}
                className="w-full h-full object-cover"
              />
            ) : (
              typeSpecificData.icon
            )}
          </div>
        </div>

        {/* Profile Info - with enough margin to clear the profile pic */}
        <div className="pt-20 pb-2">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="flex-1 mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-gray-900">{typeSpecificData.title}</h1>
              <p className="text-gray-600">
                {typeSpecificData.subtitle}
              </p>
              
              {/* Bio directly under name & subtitle - prominent placement */}
              {user.bio && (
                <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <p className="text-gray-700 whitespace-pre-line">
                    {user.bio}
                  </p>
                </div>
              )}
            </div>
            
            {/* External Links - moved to right side on desktop */}
            {(user.website || user.linkedIn || user.twitter) && (
              <div className="flex flex-wrap gap-2 md:justify-end">
                {user.website && (
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                  >
                    <Globe className="h-4 w-4 mr-1" />
                    Website
                  </a>
                )}
                {user.linkedIn && (
                  <a
                    href={user.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                  >
                    <LinkIcon className="h-4 w-4 mr-1" />
                    LinkedIn
                  </a>
                )}
                {user.twitter && (
                  <a
                    href={user.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-sky-100 text-sky-800 hover:bg-sky-200 transition-colors"
                  >
                    <LinkIcon className="h-4 w-4 mr-1" />
                    Twitter
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Skills if available - displayed prominently below bio */}
          {hasSkills && (
            <div className="mt-5 border-t border-gray-100 pt-5">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skillsList.map((skill, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile details - only showing important ones publicly */}
        <div className="mt-4 border-t border-gray-100 pt-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {visibleDetails.map((detail, index) => 
              detail.value ? (
                <div key={index} className="flex items-center">
                  {detail.icon}
                  <div className="ml-2">
                    <p className="text-sm text-gray-500">{detail.label}</p>
                    <p className="font-medium text-gray-900">{formatValue(detail.value)}</p>
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 