'use client';

const UserMenu = ({ userType, onToggleType }) => (
  <button 
    onClick={onToggleType}
    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
  >
    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
      <span className="text-indigo-600 font-medium">
        {userType === 'student' ? 'S' : 'O'}
      </span>
    </div>
  </button>
);

export default UserMenu;