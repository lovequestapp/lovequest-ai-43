
import React from 'react';

interface CardContentProps {
  profile: any;
  index: number;
}

const CardContent: React.FC<CardContentProps> = ({ profile, index }) => {
  return (
    <div 
      style={{
        backgroundImage: `url(${profile.photos?.[0] || '/placeholder.svg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        height: '100%',
        borderRadius: '10px',
      }}
    >
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-4">
        <h3 className="text-xl font-semibold">{profile.name || 'Anonymous'}, {profile.age || '?'}</h3>
        <p className="text-sm opacity-90 line-clamp-2">{profile.bio || 'No bio yet'}</p>
      </div>
    </div>
  );
};

export default CardContent;
