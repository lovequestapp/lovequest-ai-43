
// This edge function adds an additional way to fetch profile data 
// when the database function encounters issues
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.24.0';

// Define CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { profileId, profileData, action } = body;
    
    if (!profileId) {
      return new Response(
        JSON.stringify({ error: 'Profile ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Edge function: ${action === 'update' ? 'Updating' : 'Fetching'} profile for ID: ${profileId}`);

    // Create a Supabase client with the admin role
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and key are required');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // If this is an update request
    if (action === 'update' && profileData) {
      console.log('Processing profile update with data:', profileData);
      
      try {
        // Convert any special fields as needed
        const updateData: Record<string, any> = {};
        
        // Map fields from client names to database column names
        if (profileData.name !== undefined) updateData.name = profileData.name;
        if (profileData.bio !== undefined) updateData.bio = profileData.bio;
        if (profileData.age !== undefined) updateData.age = profileData.age;
        if (profileData.location !== undefined) updateData.location = profileData.location;
        
        // Handle array fields properly
        if (profileData.interests !== undefined) {
          updateData.interests = Array.isArray(profileData.interests) ? profileData.interests : [];
        }
        
        if (profileData.gender !== undefined) updateData.gender = profileData.gender;
        
        if (profileData.interestedIn !== undefined) {
          updateData.interested_in = Array.isArray(profileData.interestedIn) ? profileData.interestedIn : [];
        }
        
        if (profileData.personalityTraits !== undefined) {
          updateData.personality_traits = Array.isArray(profileData.personalityTraits) ? profileData.personalityTraits : [];
        }
        
        if (profileData.photos !== undefined) {
          updateData.photos = Array.isArray(profileData.photos) ? profileData.photos : [];
        }
        
        if (profileData.favoriteMusic !== undefined) {
          updateData.favorite_music = Array.isArray(profileData.favoriteMusic) ? profileData.favoriteMusic : [];
        }
        
        if (profileData.voiceIntro !== undefined) updateData.voice_intro = profileData.voiceIntro;
        updateData.updated_at = new Date().toISOString();
        
        console.log('Performing update with data:', updateData);
        
        // Perform the update using the service role
        const { error: updateError } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', profileId);
        
        if (updateError) {
          console.error('Error updating profile:', updateError);
          return new Response(
            JSON.stringify({ error: updateError.message, success: false }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }
        
        return new Response(
          JSON.stringify({ success: true, message: 'Profile updated successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      } catch (updateErr) {
        console.error('Error processing update:', updateErr);
        return new Response(
          JSON.stringify({ error: updateErr.message, success: false }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
    }
    
    // Get the profile data directly using the service role
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    if (!data) {
      console.log(`No profile found for ID: ${profileId}`);
      return new Response(
        JSON.stringify({ data: null, message: 'Profile not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    console.log('Profile data retrieved successfully');

    // Return the profile data
    return new Response(
      JSON.stringify({ data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error handling request:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
