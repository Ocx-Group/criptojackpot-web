import NextAuth, { NextAuthOptions } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the access_token and refresh_token for backend API calls
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.idToken = account.id_token;
        token.expiresAt = account.expires_at;
        token.provider = account.provider;
      }

      // Extract user info from profile (Keycloak specific)
      if (profile) {
        token.email = profile.email;
        token.name = profile.name;
        // Keycloak roles from realm_access
        const keycloakProfile = profile as {
          realm_access?: { roles?: string[] };
          preferred_username?: string;
        };
        token.roles = keycloakProfile.realm_access?.roles || [];
        token.username = keycloakProfile.preferred_username;
      }

      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.idToken = token.idToken as string;
      session.error = token.error as string | undefined;

      // Add user info
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.roles = token.roles as string[];
        session.user.username = token.username as string;
      }

      return session;
    },
  },
  events: {
    async signOut({ token }) {
      // Keycloak end session endpoint for complete logout
      if (token.idToken && process.env.KEYCLOAK_ISSUER) {
        const logoutUrl = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout`;
        const params = new URLSearchParams({
          id_token_hint: token.idToken as string,
        });

        try {
          await fetch(`${logoutUrl}?${params.toString()}`, { method: 'GET' });
        } catch (error) {
          console.error('Error during Keycloak logout:', error);
        }
      }
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
