
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tfadujudemkywtagwvsy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmYWR1anVkZW1reXd0YWd3dnN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MDQ2MDIsImV4cCI6MjA4MzI4MDYwMn0.2TFqtALw3yWb3kYMp2DqRr6jlyvy_dsMqWIzsh2SxF0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
