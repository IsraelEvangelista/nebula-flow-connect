// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hznfupsegatwmdlmfnfe.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6bmZ1cHNlZ2F0d21kbG1mbmZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0NjU2NzcsImV4cCI6MjA1NzA0MTY3N30.TTNLWIKKeIUqq0bWmGgpxvF5GLrPFHvfMrxue-wBJWM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);