
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const ADMIN_EMAIL = 'hunainm.qureshi@gmail.com'

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing environment variables')
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const body = await req.json()
    const { action, userId, verificationId, documentUrl, selfieUrl, biometricScore } = body

    // Check if this is a notification request (new verification submission)
    if (action === 'notify_admin') {
      if (!userId || !verificationId) {
        return new Response(
          JSON.stringify({ error: 'Missing required parameters' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email, name')
        .eq('id', userId)
        .single()

      if (profileError) {
        console.error('Error fetching profile:', profileError)
        throw new Error('Failed to fetch user profile')
      }

      // Create notification email content
      const emailSubject = `New Identity Verification Request: ${verificationId}`
      const emailBody = `
        <h1>New Identity Verification Request</h1>
        <p><strong>Verification ID:</strong> ${verificationId}</p>
        <p><strong>User:</strong> ${profile.name} (${profile.email})</p>
        <p><strong>Submitted:</strong> ${new Date().toISOString()}</p>
        <p><strong>Biometric Match Score:</strong> ${biometricScore || 'N/A'}</p>
        <hr>
        <p>Please review the verification documents in the Supabase dashboard.</p>
        <p>Selfie URL: ${selfieUrl || 'Not provided'}</p>
        <p>Document URL: ${documentUrl || 'Not provided'}</p>
      `

      // Send email to admin (in a real-world scenario, you'd use a service like Resend, SendGrid, etc.)
      console.log(`Would send email to ${ADMIN_EMAIL}:`)
      console.log(`Subject: ${emailSubject}`)
      console.log(`Body: ${emailBody}`)

      // Create or update notification record
      const { error: notificationError } = await supabase
        .from('verification_notifications')
        .upsert({ 
          user_id: userId,
          verification_id: verificationId,
          email: profile.email,
          name: profile.name,
          status: 'notified'
        })

      if (notificationError) {
        console.error('Error creating notification record:', notificationError)
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Admin notified' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // For email confirmation redirect
    if (action === 'email_confirmed') {
      const redirectUrl = `${SUPABASE_URL.replace('.supabase.co', '.app')}/auth/confirm-email?success=true`
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          Location: redirectUrl,
        }
      })
    }

    // For verification approval
    if (action === 'approve_verification') {
      if (!verificationId) {
        return new Response(
          JSON.stringify({ error: 'Missing verification ID' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Update verification request
      const { data: verificationData, error: verificationError } = await supabase
        .from('verification_requests')
        .update({ 
          verification_status: 'approved',
          verified_at: new Date().toISOString(),
          admin_notes: body.notes || 'Approved'
        })
        .eq('verification_id', verificationId)
        .select('user_id')
        .single()

      if (verificationError || !verificationData) {
        console.error('Error updating verification request:', verificationError)
        throw new Error('Failed to update verification request')
      }

      // Update user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          verification_status: 'verified',
          is_verified: true
        })
        .eq('id', verificationData.user_id)

      if (profileError) {
        console.error('Error updating user profile:', profileError)
        throw new Error('Failed to update user profile')
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Verification approved' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
