import { DefaultSession, DefaultUser } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
    error?: string;
    user: {
      id?: string;
      roles?: string[];
      username?: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    roles?: string[];
    username?: string;
  }

  interface Profile {
    realm_access?: {
      roles?: string[];
    };
    preferred_username?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
    expiresAt?: number;
    provider?: string;
    roles?: string[];
    username?: string;
    error?: string;
  }
}
