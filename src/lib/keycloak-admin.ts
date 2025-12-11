
export class KeycloakAdminClient {
    private baseUrl: string;
    private realm: string;
    private clientId: string;
    private clientSecret: string;

    constructor() {
        // In Docker environment, we must use host.docker.internal to reach Keycloak on the host
        // even if KEYCLOAK_ISSUER is set to localhost for client-side compatibility
        this.baseUrl = 'http://host.docker.internal:8080';
        this.realm = 'micapital';
        this.clientId = process.env.KEYCLOAK_CLIENT_ID!;
        this.clientSecret = process.env.KEYCLOAK_CLIENT_SECRET!;
    }

    private async getAdminToken(): Promise<string> {
        const params = new URLSearchParams({
            client_id: this.clientId,
            client_secret: this.clientSecret,
            grant_type: 'client_credentials',
        });

        const response = await fetch(`${this.baseUrl}/realms/${this.realm}/protocol/openid-connect/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Failed to get admin token:', error);
            throw new Error('Failed to authenticate with Keycloak Admin API');
        }

        const data = await response.json();
        return data.access_token;
    }

    async createUser(user: { email: string; firstName?: string; lastName?: string; password?: string }) {
        const token = await this.getAdminToken();

        const userData = {
            username: user.email,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            enabled: true,
            emailVerified: true, // Auto-verify email to allow immediate login
            credentials: user.password ? [{
                type: 'password',
                value: user.password,
                temporary: false,
            }] : undefined,
        };

        const response = await fetch(`${this.baseUrl}/admin/realms/${this.realm}/users`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            if (response.status === 409) {
                throw new Error('User already exists');
            }
            const error = await response.text();
            console.error('Failed to create user:', error);
            throw new Error('Failed to create user in Keycloak');
        }

        // Get the created user to return ID
        return this.getUserByEmail(user.email);
    }

    async getUserByEmail(email: string) {
        const token = await this.getAdminToken();
        const response = await fetch(`${this.baseUrl}/admin/realms/${this.realm}/users?email=${encodeURIComponent(email)}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) return null;
        const users = await response.json();
        return users.length > 0 ? users[0] : null;
    }
}

export const getKeycloakAdmin = () => {
    return new KeycloakAdminClient();
};
