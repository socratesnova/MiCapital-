import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create Supabase client with service role for admin operations
const supabase = createClient(
    process.env.SUPABASE_URL || 'http://localhost:54321',
    // For now, use anon key - in production use service role key
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key-for-build'
)

export async function POST(req: NextRequest) {
    try {
        const { auth_user_id, email, full_name } = await req.json()

        console.log('[User Create API] Received request:', { auth_user_id, email, full_name })

        // Check if user already exists
        const { data: existing, error: checkError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('email', email)
            .maybeSingle()

        if (checkError) {
            console.error('[User Create API] Error checking existing user:', checkError)
        }

        if (existing) {
            console.log('[User Create API] User already exists:', existing.id)
            return NextResponse.json({
                message: 'User already exists',
                user: existing
            })
        }

        // Create new user profile
        const { data, error } = await supabase
            .from('user_profiles')
            .insert({
                auth_user_id,
                email,
                full_name: full_name || email.split('@')[0],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .select()
            .single()

        if (error) {
            console.error('[User Create API] Error creating user:', error)
            throw error
        }

        console.log('[User Create API] User created successfully:', data.id)
        return NextResponse.json({
            success: true,
            user: data
        })

    } catch (error: any) {
        console.error('[User Create API] Fatal error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to create user' },
            { status: 500 }
        )
    }
}
