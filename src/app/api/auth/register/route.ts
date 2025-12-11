import { NextRequest, NextResponse } from 'next/server';
import { getKeycloakAdmin } from '@/lib/keycloak-admin';

export async function POST(req: NextRequest) {
    try {
        const { email, password, firstName, lastName } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email and password are required' },
                { status: 400 }
            );
        }

        try {
            const keycloakAdmin = getKeycloakAdmin();
            const newUser = await keycloakAdmin.createUser({
                email,
                password,
                firstName,
                lastName,
            });

            return NextResponse.json({ success: true, user: newUser }, { status: 201 });
        } catch (error: any) {
            if (error.message === 'User already exists') {
                return NextResponse.json(
                    { message: 'User with this email already exists' },
                    { status: 409 }
                );
            }
            throw error;
        }
    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { message: 'Internal server error during registration' },
            { status: 500 }
        );
    }
}
