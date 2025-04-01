
import { supabase } from '@/lib/supabase';
import { User } from '@/types/user';
import { toast } from 'sonner';

/**
 * Updates a user's profile in the database
 */
export const updateProfileData = async (userId: string, profileData: Partial<User>): Promise<boolean> => {
  try {
    if (!userId) {
      console.error('No user ID provided for profile update');
      return false;
    }

    console.log('Updating profile for user:', userId, 'with data:', profileData);

    const { error } = await supabase
      .from('profiles')
      .update({
        name: profileData.name,
        bio: profileData.bio,
        age: profileData.age,
        location: profileData.location,
        interests: profileData.interests,
        gender: profileData.gender,
        interested_in: profileData.interestedIn,
        personality_traits: profileData.personalityTraits,
        photos: profileData.photos,
        // Handle voice intro if provided
        ...(profileData.voiceIntro ? { voice_intro: profileData.voiceIntro } : {})
      })
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating profile:', error);
      return false;
    }
    
    console.log('Profile updated successfully');
    return true;
  } catch (error: any) {
    console.error('Profile update error:', error.message);
    return false;
  }
};

/**
 * Uploads a photo to the user's profile
 */
export const uploadProfilePhoto = async (userId: string, file: File): Promise<string | null> => {
  try {
    if (!userId) {
      toast.error('You must be logged in to upload a photo');
      return null;
    }
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `profiles/${fileName}`;
    
    // First, ensure the bucket exists
    try {
      await supabase.storage.createBucket('profile-photos', {
        public: true,
        fileSizeLimit: 5242880 // 5MB in bytes
      });
    } catch (error) {
      // Bucket might already exist, which is fine
      console.log('Bucket creation:', error);
    }
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from('profile-photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) {
      console.error("Error uploading photo:", error);
      toast.error("Failed to upload photo", {
        description: error.message
      });
      return null;
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(data.path);
    
    return publicUrl;
  } catch (error: any) {
    console.error('Upload photo error:', error);
    toast.error("Failed to upload photo", {
      description: "An unexpected error occurred"
    });
    return null;
  }
};

/**
 * Saves an audio recording to the user's profile
 */
export const saveVoiceIntro = async (userId: string, audioData: string): Promise<boolean> => {
  try {
    if (!userId) {
      console.error('No user ID provided for voice intro save');
      return false;
    }

    console.log('Saving voice intro for user:', userId);

    const { error } = await supabase
      .from('profiles')
      .update({
        voice_intro: audioData
      })
      .eq('id', userId);
    
    if (error) {
      console.error("Error saving voice intro:", error);
      return false;
    }
    
    console.log('Voice intro saved successfully');
    return true;
  } catch (error: any) {
    console.error('Voice intro save error:', error.message);
    return false;
  }
};

/**
 * Retrieves a user's profile data
 */
export const fetchUserProfile = async (userId: string): Promise<User | null> => {
  try {
    if (!userId) {
      console.error('No user ID provided for profile fetch');
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
    
    if (!data) {
      console.error("No profile found for user:", userId);
      return null;
    }
    
    // Transform database record to User type
    return {
      id: data.id,
      name: data.name || '',
      email: data.email || '',
      age: data.age || 18,
      bio: data.bio || '',
      location: data.location || '',
      interests: data.interests || [],
      photos: data.photos || [],
      gender: data.gender as 'male' | 'female' | 'non-binary' || 'non-binary',
      interestedIn: data.interested_in as ('male' | 'female' | 'non-binary')[] || [],
      popularityPoints: data.popularity_points || 0,
      premiumStatus: data.premium_status as 'basic' | 'premium' | 'vip' | 'trial' || 'basic',
      giftInventory: data.gift_inventory || { rose: 0, heart: 0, teddy: 0 },
      receivedGifts: data.received_gifts || { rose: 0, heart: 0, teddy: 0 },
      compatibilityScore: 0,
      personalityTraits: data.personality_traits || [],
      role: data.role as 'admin' | 'moderator' | 'subscriber' | 'vip' | 'trial' || 'subscriber',
      isBanned: data.is_banned || false,
      verificationStatus: data.is_verified ? 'verified' : 'unverified',
      lastMessage: '',
      lastMessageTime: new Date(),
      status: 'online',
      favoriteMusic: data.favorite_music || [],
      voiceIntro: data.voice_intro || '',
      bankDetails: {
        accountName: '',
        accountNumber: '',
        bankName: '',
        routingNumber: '',
        accountType: ''
      }
    };
  } catch (error: any) {
    console.error('Profile fetch error:', error.message);
    return null;
  }
};
