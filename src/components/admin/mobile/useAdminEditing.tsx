
import { useState, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';

export const useAdminEditing = () => {
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [userFormData, setUserFormData] = useState<Record<string, any>>({});
  const { updateUserData } = useUser();
  
  const handleEditUser = useCallback((userId: number, userData: any) => {
    if (editingUser !== null) {
      handleCancelEdit();
    }
    
    setEditingUser(userId);
    setUserFormData(userData);
    const row = document.querySelector(`[data-user-id="${userId}"]`);
    if (row) {
      row.classList.add('edit-transition');
    }
  }, [editingUser]);
  
  const handleSaveUser = useCallback((userId: number) => {
    if (userFormData) {
      updateUserData(String(userId), userFormData);
    }
    
    setEditingUser(null);
    setUserFormData({});
    toast.success("User updated successfully", {
      description: "The user's information has been saved"
    });
    
    const row = document.querySelector(`[data-user-id="${userId}"]`);
    if (row) {
      row.classList.remove('edit-transition');
    }
    
    setTimeout(() => {
      document.body.style.pointerEvents = 'auto';
    }, 300);
  }, [userFormData, updateUserData]);
  
  const handleCancelEdit = useCallback(() => {
    const row = document.querySelector(`[data-user-id="${editingUser}"]`);
    if (row) {
      row.classList.remove('edit-transition');
    }
    
    setEditingUser(null);
    setUserFormData({});
    
    document.body.style.pointerEvents = 'auto';
  }, [editingUser]);
  
  return {
    editingUser,
    userFormData,
    setUserFormData,
    handleEditUser,
    handleSaveUser,
    handleCancelEdit
  };
};
