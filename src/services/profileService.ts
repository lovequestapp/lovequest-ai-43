
import { supabase } from '@/integrations/supabase/client';
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
    // Convert the User object format to database format
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
    const filePath = `profile-photos/${userId}/${file.name}`;
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    const publicURL = `https://utrifqgsjrtjlkufyhol.supabase.co/storage/v1/object/public/${data.fullPath}`;
    return publicURL;
  } catch (error) {
    console.error('Unexpected error uploading image:', error);
    return null;
  }
};

// Function to delete a profile photo
export const deleteProfilePhoto = async (photoUrl: string): Promise<boolean> => {
  try {
    const filePath = photoUrl.replace("https://utrifqgsjrtjlkufyhol.supabase.co/storage/v1/object/public/avatars/", "");
    const { error } = await supabase.storage
      .from('avatars')
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

// Function to fetch users by location
export const fetchUsersByLocation = async (location: string): Promise<User[]> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('location', `%${location}%`);
  
      if (error) {
        console.error('Error fetching users by location:', error);
        return [];
      }
  
      if (!data) {
        console.log('No users found in this location');
        return [];
      }
  
      return data.map(record => mapDatabaseRecordToUser(record, record.id));
    } catch (error) {
      console.error('Unexpected error fetching users by location:', error);
      return [];
    }
  };

// Function to fetch users by interests
export const fetchUsersByInterest = async (interest: string): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .contains('interests', [interest]);

    if (error) {
      console.error('Error fetching users by interest:', error);
      return [];
    }

    if (!data) {
      console.log('No users found with this interest');
      return [];
    }

    return data.map(record => mapDatabaseRecordToUser(record, record.id));
  } catch (error) {
    console.error('Unexpected error fetching users by interest:', error);
    return [];
  }
};

// Function to fetch users by gender preference
export const fetchUsersByGenderPreference = async (gender: 'male' | 'female' | 'non-binary'): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .contains('interested_in', [gender]);

    if (error) {
      console.error('Error fetching users by gender preference:', error);
      return [];
    }

    if (!data) {
      console.log('No users found with this gender preference');
      return [];
    }

    return data.map(record => mapDatabaseRecordToUser(record, record.id));
  } catch (error) {
    console.error('Unexpected error fetching users by gender preference:', error);
    return [];
  }
};

// Function to update user location
export const updateUserLocation = async (userId: string, latitude: number, longitude: number): Promise<boolean> => {
  try {
    // First, attempt to get the city from reverse geocoding
    const reverseGeocodingUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
    const response = await fetch(reverseGeocodingUrl);
    const data = await response.json();

    let city = 'Unknown';
    if (data && data.address && data.address.city) {
      city = data.address.city;
    } else if (data && data.address && data.address.town) {
      city = data.address.town;
    } else if (data && data.address && data.address.village) {
      city = data.address.village;
    }

    // Update the profile with the city
    const { error } = await supabase
      .from('profiles')
      .update({ location: city })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user location:', error);
      return false;
    }

    console.log('User location updated successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error updating user location:', error);
    return false;
  }
};

// Update bank details
export const updateBankDetails = async (userId: string, bankDetails: {
  accountName: string;
  accountNumber: string;
  bankName: string;
  routingNumber: string;
  accountType: string;
}): Promise<boolean> => {
  try {
    // Create a serialized JSON object to store bank details
    const bankDetailsJson = JSON.stringify({
      accountName: bankDetails.accountName,
      accountNumber: bankDetails.accountNumber,
      bankName: bankDetails.bankName,
      routingNumber: bankDetails.routingNumber,
      accountType: bankDetails.accountType
    });
    
    // Use our new helper function to update
    const { error } = await supabase
      .from('profiles')
      .update({ bank_details: bankDetailsJson })
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

// Initiate withdrawal
export const initiateWithdrawal = async (
  userId: string,
  amount: number, 
  method: 'bank' | 'paypal'
): Promise<boolean> => {
  try {
    // In a real app, you would create a withdrawal record in your database
    // and potentially integrate with a payment processor
    console.log(`Withdrawal initiated: $${amount} via ${method} for user ${userId}`);
    
    // For demo purposes, we'll just return success
    // In a real app you might create a record in a withdrawals table
    return true;
  } catch (error) {
    console.error('Unexpected error initiating withdrawal:', error);
    return false;
  }
};

// Helper function to prepare user data for database update
const prepareUserDataForDatabase = (userData: Partial<User>): Record<string, any> => {
  const dbData: Record<string, any> = {};
  
  // Map User object fields to database column names
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
  
  // Handle bank details
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

// Update profile data with a single field or set of fields
export const updateProfileData = async (
  userId: string, 
  data: Partial<User>
): Promise<boolean> => {
  try {
    // Use our helper function to prepare data for the database
    const dbData = prepareUserDataForDatabase(data);
    
    const { error } = await supabase
      .from('profiles')
      .update(dbData)
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

export const mapDatabaseRecordToUser = (record: any, userId: string = ''): User => {
  // Ensure default values are provided for all fields
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

  // Convert premium status from database to our standardized format
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

  // Parse bank details if they exist
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
