
import React from 'react';
import { Save, X } from 'lucide-react';

interface EditControlsProps {
  editingUser: number | null;
  handleSaveUser: (id: number) => void;
  handleCancelEdit: () => void;
}

const EditControls = ({ editingUser, handleSaveUser, handleCancelEdit }: EditControlsProps) => {
  if (editingUser === null) return null;
  
  return (
    <div className="fixed bottom-16 right-4 p-4 bg-white shadow-lg rounded-lg z-50 flex space-x-3 border border-love-100">
      <button 
        onClick={() => handleSaveUser(editingUser)}
        className="flex items-center justify-center p-2 bg-gradient-to-r from-love-500 to-passion-500 text-white rounded-full hover:shadow-md transition-all duration-200"
      >
        <Save className="h-5 w-5" />
      </button>
      <button 
        onClick={handleCancelEdit}
        className="flex items-center justify-center p-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all duration-200"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default EditControls;
