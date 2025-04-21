
// Only showing the relevant parts updated for photo upload/delete

import { supabase } from '@/lib/supabase';
import { User } from '@/types/user';
import { convertPremiumStatus } from '@/utils/subscription';

// Function to fetch a user profile by ID
export const fetchUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    if (!data) {
      console.log('Profile not found');
      return null;
    }

    return mapDatabaseRecordToUser(data, userId);
  } catch (error) {
    console.error('Unexpected error fetching profile:', error);
    return null;
  }
};

// Function to fetch all user profiles
export const fetchAllUserProfiles = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) {
      console.error('Error fetching all profiles:', error);
      return [];
    }

    if (!data) {
      console.log('No profiles found');
      return [];
    }

    return data.map(record => mapDatabaseRecordToUser(record, record.id));
  } catch (error) {
    console.error('Unexpected error fetching all profiles:', error);
    return [];
  }
};

// Function to update a user profile
export const updateUserProfile = async (userId: string, updates: Partial<User>): Promise<User | null> => {
  try {
    const dbUpdates = prepareUserDataForDatabase(updates);
    console.log('Updating profile with data:', dbUpdates);

    const { data, error } = await supabase
      .from('profiles')
      .update(dbUpdates)
      .eq('id', userId)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }

    if (!data) {
      console.log('Profile not found or update failed');
      return null;
    }

    return mapDatabaseRecordToUser(data, userId);
  } catch (error) {
    console.error('Unexpected error updating profile:', error);
    return null;
  }
};

// Function to delete a user profile
export const deleteUserProfile = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Error deleting profile:', error);
      return false;
    }

    console.log('Profile deleted successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error deleting profile:', error);
    return false;
  }
};

// Function to upload a profile photo
export const uploadProfilePhoto = async (userId: string, file: File): Promise<string | null> => {
  try {
    // Use bucket 'profile-photos' and proper folder 'profiles/<userId>/'
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `profiles/${userId}/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('profile-photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    // Get the public URL correctly using the storage bucket/public path
    const { data: publicData } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(filePath);
    return publicData.publicUrl;
  } catch (error) {
    console.error('Unexpected error uploading image:', error);
    return null;
  }
};

// Function to delete a profile photo
export const deleteProfilePhoto = async (photoUrl: string): Promise<boolean> => {
  try {
    if (!photoUrl) {
      console.warn('No photo URL provided for deletion');
      return false;
    }
    // Extract the file path relative to the bucket public URL
    const baseUrl = `https://utrifqgsjrtjlkufyhol.supabase.co/storage/v1/object/public/profile-photos/`;
    if (!photoUrl.startsWith(baseUrl)) {
      console.error('Photo URL does not belong to profile-photos bucket:', photoUrl);
      return false;
    }
    const filePath = photoUrl.substring(baseUrl.length);

    const { error } = await supabase.storage
      .from('profile-photos')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error deleting image:', error);
    return false;
  }
};

// Function to update bank details
export const updateBankDetails = async (userId: string, bankDetails: {
  accountName: string;
  accountNumber: string;
  bankName: string;
  routingNumber: string;
  accountType: string;
}): Promise<boolean> => {
  try {
    const bankDetailsJson = JSON.stringify(bankDetails);
    
    const { error } = await supabase
      .from('profiles')
      .update({ bank_details: bankDetailsJson } as any)
      .eq('id', userId);

    if (error) {
      console.error('Error updating bank details:', error);
      return false;
    }

    console.log('Bank details updated successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error updating bank details:', error);
    return false;
  }
};

// Function to initiate a withdrawal
export const initiateWithdrawal = async (
  userId: string, 
  amount: number, 
  method: 'bank' | 'paypal'
): Promise<boolean> => {
  try {
    console.log(`Withdrawal initiated: $${amount} via ${method} for user ${userId}`);
    
    console.log('Simulating withdrawal processing');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return true;
  } catch (error) {
    console.error('Unexpected error processing withdrawal:', error);
    return false;
  }
};

// Update profile data with a single field or set of fields
export const updateProfileData = async (
  userId: string, 
  data: Partial<User>
): Promise<boolean> => {
  try {
    const dbData = prepareUserDataForDatabase(data);
    
    const { error } = await supabase
      .from('profiles')
      .update(dbData as any)
      .eq('id', userId);

    if (error) {
      console.error('Error updating profile data:', error);
      return false;
    }

    console.log('Profile data updated successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error updating profile data:', error);
    return false;
  }
};

// Helper function to prepare user data for database update
const prepareUserDataForDatabase = (userData: Partial<User>): Record<string, any> => {
  const dbData: Record<string, any> = {};
  
  if (userData.name !== undefined) dbData.name = userData.name;
  if (userData.bio !== undefined) dbData.bio = userData.bio;
  if (userData.age !== undefined) dbData.age = userData.age;
  if (userData.location !== undefined) dbData.location = userData.location;
  if (userData.interests !== undefined) dbData.interests = userData.interests;
  if (userData.photos !== undefined) dbData.photos = userData.photos;
  if (userData.gender !== undefined) dbData.gender = userData.gender;
  if (userData.interestedIn !== undefined) dbData.interested_in = userData.interestedIn;
  if (userData.personalityTraits !== undefined) dbData.personality_traits = userData.personalityTraits;
  if (userData.favoriteMusic !== undefined) dbData.favorite_music = userData.favoriteMusic;
  if (userData.voiceIntro !== undefined) dbData.voice_intro = userData.voiceIntro;
  
  if (userData.bankDetails) {
    dbData.bank_details = JSON.stringify({
      accountName: userData.bankDetails.accountName,
      accountNumber: userData.bankDetails.accountNumber,
      bankName: userData.bankDetails.bankName,
      routingNumber: userData.bankDetails.routingNumber,
      accountType: userData.bankDetails.accountType
    });
  }
  
  dbData.updated_at = new Date().toISOString();
  
  return dbData;
};

// Function to map database record to User type
export const mapDatabaseRecordToUser = (record: any, userId: string = ''): User => {
  const gender = record.gender || 'non-binary';
  const validGender = (gender === 'male' || gender === 'female' || gender === 'non-binary')
    ? gender as 'male' | 'female' | 'non-binary'
    : 'non-binary' as const;

  const interestedIn = record.interested_in || [];
  const validInterestedIn = Array.isArray(interestedIn) ?
    interestedIn.filter((interest: string) =>
      interest === 'male' || interest === 'female' || interest === 'non-binary'
    ) as ('male' | 'female' | 'non-binary')[] :
    [] as ('male' | 'female' | 'non-binary')[];

  const premiumStatus = convertPremiumStatus(record.premium_status || 'standard');

  const role = record.role || 'subscriber';
  const validRole = (
    role === 'admin' ||
    role === 'moderator' ||
    role === 'subscriber' ||
    role === 'vip' ||
    role === 'trial'
  )
    ? role as 'admin' | 'moderator' | 'subscriber' | 'vip' | 'trial'
    : 'subscriber' as const;

  const verificationStatus = record.verification_status || 'unverified';
  const validVerificationStatus = (
    verificationStatus === 'verified' ||
    verificationStatus === 'unverified' ||
    verificationStatus === 'pending' ||
    verificationStatus === 'rejected'
  )
    ? verificationStatus as 'verified' | 'unverified' | 'pending' | 'rejected'
    : 'unverified' as const;

  let bankDetails = {
    accountName: '',
    accountNumber: '',
    bankName: '',
    routingNumber: '',
    accountType: ''
  };
  
  try {
    if (record.bank_details) {
      const bankData = typeof record.bank_details === 'string' 
        ? JSON.parse(record.bank_details)
        : record.bank_details;
        
      bankDetails = {
        accountName: bankData.accountName || '',
        accountNumber: bankData.accountNumber || '',
        bankName: bankData.bankName || '',
        routingNumber: bankData.routingNumber || '',
        accountType: bankData.accountType || ''
      };
    }
  } catch (e) {
    console.error('Error parsing bank details:', e);
  }

  return {
    id: userId || record.id || 'unknown',
    name: record.name || 'Unknown User',
    email: record.email || '',
    age: record.age || 18,
    bio: record.bio || '',
    location: record.location || '',
    interests: record.interests || [],
    photos: record.photos || [],
    gender: validGender,
    interestedIn: validInterestedIn,
    popularityPoints: record.popularity_points || 0,
    premiumStatus: premiumStatus,
    giftInventory: record.gift_inventory || { rose: 0, heart: 0, teddy: 0 },
    receivedGifts: record.received_gifts || { rose: 0, heart: 0, teddy: 0 },
    compatibilityScore: 0,
    personalityTraits: record.personality_traits || [],
    role: validRole,
    isBanned: record.is_banned || false,
    verificationStatus: validVerificationStatus,
    lastMessage: record.last_message || '',
    lastMessageTime: record.last_message_time ? new Date(record.last_message_time) : new Date(),
    status: record.status || 'offline',
    favoriteMusic: record.favorite_music || [],
    voiceIntro: record.voice_intro || '',
    bankDetails
  };
};

// Save voice intro for a user
export const saveVoiceIntro = async (
  userId: string, 
  voiceIntroUrl: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ voice_intro: voiceIntroUrl })
      .eq('id', userId);

    if (error) {
      console.error('Error saving voice intro:', error);
      return false;
    }

    console.log('Voice intro saved successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error saving voice intro:', error);
    return false;
  }
};
