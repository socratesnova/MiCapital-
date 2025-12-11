import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '/supabase'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            user_profiles: {
                Row: {
                    id: string
                    user_id: string
                    email: string
                    full_name: string | null
                    avatar_url: string | null
                    currency: string
                    timezone: string
                    language: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    email: string
                    full_name?: string | null
                    avatar_url?: string | null
                    currency?: string
                    timezone?: string
                    language?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    email?: string
                    full_name?: string | null
                    avatar_url?: string | null
                    currency?: string
                    timezone?: string
                    language?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            transactions: {
                Row: {
                    id: string
                    user_id: string
                    amount: number
                    category: string
                    description: string | null
                    date: string
                    type: 'income' | 'expense'
                    payment_method: string | null
                    notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    amount: number
                    category: string
                    description?: string | null
                    date?: string
                    type: 'income' | 'expense'
                    payment_method?: string | null
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    amount?: number
                    category?: string
                    description?: string | null
                    date?: string
                    type?: 'income' | 'expense'
                    payment_method?: string | null
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            budgets: {
                Row: {
                    id: string
                    user_id: string
                    category: string
                    amount: number
                    period: 'monthly' | 'weekly' | 'yearly'
                    start_date: string
                    end_date: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    category: string
                    amount: number
                    period: 'monthly' | 'weekly' | 'yearly'
                    start_date?: string
                    end_date?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    category?: string
                    amount?: number
                    period?: 'monthly' | 'weekly' | 'yearly'
                    start_date?: string
                    end_date?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            goals: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    description: string | null
                    target_amount: number
                    current_amount: number
                    deadline: string | null
                    category: string | null
                    status: 'active' | 'completed' | 'cancelled'
                    priority: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    description?: string | null
                    target_amount: number
                    current_amount?: number
                    deadline?: string | null
                    category?: string | null
                    status?: 'active' | 'completed' | 'cancelled'
                    priority?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    description?: string | null
                    target_amount?: number
                    current_amount?: number
                    deadline?: string | null
                    category?: string | null
                    status?: 'active' | 'completed' | 'cancelled'
                    priority?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            categories: {
                Row: {
                    id: string
                    user_id: string | null
                    name: string
                    type: 'income' | 'expense'
                    icon: string | null
                    color: string | null
                    is_system: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    name: string
                    type: 'income' | 'expense'
                    icon?: string | null
                    color?: string | null
                    is_system?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    name?: string
                    type?: 'income' | 'expense'
                    icon?: string | null
                    color?: string | null
                    is_system?: boolean
                    created_at?: string
                }
            }
        }
    }
}
