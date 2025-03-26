
import { createClient } from '@supabase/supabase-js';

// These will be populated from environment variables in a production setting
// You'll need to update these with your actual Supabase URL and anon key after connecting
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
