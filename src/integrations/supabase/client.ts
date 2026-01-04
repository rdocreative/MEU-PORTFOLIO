import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ghhvmlwonbsqurewzwhi.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoaHZtbHdvbmJzcXVyZXd6d2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NTYwMDgsImV4cCI6MjA4MzEzMjAwOH0.4gKmMEhJXc2AaFlGXYzdbMI0TDWfsJFFizfWi76KoU4";

export const supabase = createClient(supabaseUrl, supabaseKey);