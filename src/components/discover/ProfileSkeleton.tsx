
import React from 'react';

const ProfileSkeleton = () => {
  return (
    <div className="animate-pulse h-[600px] w-full max-w-md mx-auto rounded-xl border border-gray-200 bg-gray-100 shadow-lg">
      <div className="h-full bg-gray-300 rounded-xl" />
    </div>
  );
};

export default ProfileSkeleton;
