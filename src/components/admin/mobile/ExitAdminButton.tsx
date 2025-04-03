
import React from 'react';
import { Home } from 'lucide-react';

interface ExitAdminButtonProps {
  onClick: () => void;
}

const ExitAdminButton = ({ onClick }: ExitAdminButtonProps) => {
  return (
    <div 
      className="exit-admin" 
      title="Exit to App"
      onClick={onClick}
    >
      <Home className="h-5 w-5" />
    </div>
  );
};

export default ExitAdminButton;
