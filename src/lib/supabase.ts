import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types will go here as we define our schema
export type Database = {
    public: {
        Tables: {
            transactions: {
                Row: {
                    id: string
                    user_id: string
                    amount: number
                    category: string
                    description: string | null
                    date: string
                    type: 'income' | 'expense'
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    amount: number
                    category: string
                    description?: string | null
                    date: string
                    type: 'income' | 'expense'
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    amount?: number
                    category?: string
                    description?: string | null
                    date?: string
                    type?: 'income' | 'expense'
                    created_at?: string
                }
            }
            budgets: {
                Row: {
                    id: string
                    user_id: string
                    category: string
                    amount: number
                    period: 'monthly' | 'weekly'
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    category: string
                    amount: number
                    period: 'monthly' | 'weekly'
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    category?: string
                    amount?: number
                    period?: 'monthly' | 'weekly'
                    created_at?: string
                }
            }
            goals: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    target_amount: number
                    current_amount: number
                    deadline: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    target_amount: number
                    current_amount?: number
                    deadline?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    target_amount?: number
                    current_amount?: number
                    deadline?: string | null
                    created_at?: string
                }
            }
        }
    }
}
