import NextAuth from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak"
import CredentialsProvider from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        // Credentials provider for direct email/password login
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password required");
                }

                try {
                    // Authenticate against Keycloak using Direct Access Grants
                    // Use host.docker.internal for Docker networking
                    const issuer = process.env.KEYCLOAK_ISSUER?.replace('localhost', 'host.docker.internal') || 'http://host.docker.internal:8080/realms/micapital';

                    const tokenResponse = await fetch(
                        `${issuer}/protocol/openid-connect/token`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            body: new URLSearchParams({
                                client_id: process.env.KEYCLOAK_CLIENT_ID!,
                                client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
                                grant_type: 'password',
                                username: credentials.email as string,
                                password: credentials.password as string,
                                scope: 'openid profile email',
                            }),
                        }
                    );

                    if (!tokenResponse.ok) {
                        const error = await tokenResponse.json();
                        console.error('[Auth] Keycloak authentication failed:', error);
                        return null;
                    }

                    const tokens = await tokenResponse.json();

                    // Get user info from Keycloak
                    const userInfoResponse = await fetch(
                        `${issuer}/protocol/openid-connect/userinfo`,
                        {
                            headers: {
                                Authorization: `Bearer ${tokens.access_token}`,
                            },
                        }
                    );

                    if (!userInfoResponse.ok) {
                        console.error('[Auth] Failed to get user info');
                        return null;
                    }

                    const userInfo = await userInfoResponse.json();

                    return {
                        id: userInfo.sub,
                        email: userInfo.email,
                        name: userInfo.name || userInfo.preferred_username,
                        accessToken: tokens.access_token,
                        refreshToken: tokens.refresh_token,
                    };
                } catch (error) {
                    console.error('[Auth] Authorization error:', error);
                    return null;
                }
            },
        }),
        // Google SSO via Keycloak (for future use)
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_CLIENT_ID!,
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
            issuer: process.env.KEYCLOAK_ISSUER,
        })
    ],
    callbacks: {
        async jwt({ token, account, profile, user }) {
            // First time JWT callback is invoked, user object is available
            if (user) {
                token.accessToken = (user as any).accessToken
                token.refreshToken = (user as any).refreshToken
            }

            if (account) {
                token.accessToken = account.access_token
                token.idToken = account.id_token
                token.refreshToken = account.refresh_token
            }
            return token
        },
        async session({ session, token }) {
            // @ts-ignore
            session.accessToken = token.accessToken
            // @ts-ignore
            session.idToken = token.idToken
            return session
        },
        async signIn({ user, account, profile }) {
            // Create user profile in our database if it doesn't exist
            if (account?.provider === "keycloak") {
                try {
                    console.log('[NextAuth] User signed in via Keycloak:', user.email)

                    // Use http://localhost:3000 for internal container communication
                    const apiUrl = process.env.NEXTAUTH_URL_INTERNAL || 'http://localhost:3000';
                    const response = await fetch(`${apiUrl}/api/users/create`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            auth_user_id: user.id,
                            email: user.email,
                            full_name: user.name || profile?.name || user.email?.split('@')[0],
                        })
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error('[NextAuth] Failed to create user profile:', errorData);
                    } else {
                        const userData = await response.json();
                        console.log('[NextAuth] User profile created/exists:', userData);
                    }
                } catch (error) {
                    console.error('[NextAuth] Error creating user profile:', error)
                    // Don't block login if profile creation fails
                }
            }
            return true
        }
    },
    pages: {
        signIn: '/signin',
        error: '/auth/error',
    },
    session: {
        strategy: "jwt",
    },
})
