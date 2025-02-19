'use client';

const ProfileCard = ({ userType, name, role, completionPercentage }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm">
    <div className="text-center mb-4">
      <div className="w-20 h-20 bg-indigo-100 rounded-full mx-auto mb-3 flex items-center justify-center">
        <span className="text-2xl text-indigo-600 font-medium">
          {name[0]}
        </span>
      </div>
      <h3 className="font-semibold">{name}</h3>
      <p className="text-sm text-gray-600">{role}</p>
    </div>
    
    <div className="border-t pt-4">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-600">Profile Completion</span>
        <span className="text-indigo-600 font-medium">{completionPercentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
    </div>
  </div>
);

export default ProfileCard;