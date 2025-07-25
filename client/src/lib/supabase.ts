// Note: We're using Drizzle directly as per the blueprint instructions
// This file is kept for potential future Supabase Auth integration

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
export const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// For now, we'll use our custom auth API instead of Supabase Auth
export const API_BASE_URL = import.meta.env.DEV ? '/api' : '/api';
