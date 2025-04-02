import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ProfileSetupPage = () => {
  const { currentUser, updateUserProfile, uploadProfilePhoto } = useUser();
  const navigate = useNavigate();
  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [photo, setPhoto] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser?.name && currentUser?.bio) {
      // Profile already set up, redirect to discover page
      navigate('/discover');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data: Partial<any> = { name, bio };

      if (photo) {
        const photoUrl = await uploadProfilePhoto(photo);
        data.photos = [photoUrl];
      }

      await updateUserProfile(data);
      toast.success("Profile updated successfully!");
      navigate('/discover');
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    try {
      const photoUrl = await uploadProfilePhoto(file);
      setPhoto(file);
      toast.success("Photo uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload photo");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Set Up Your Profile</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            Name:
          </label>
          <input
            type="text"
            id="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="bio" className="block text-gray-700 text-sm font-bold mb-2">
            Bio:
          </label>
          <textarea
            id="bio"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="About You"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="photo" className="block text-gray-700 text-sm font-bold mb-2">
            Photo:
          </label>
          <input
            type="file"
            id="photo"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handlePhotoUpload(e.target.files[0]);
              }
            }}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default ProfileSetupPage;
