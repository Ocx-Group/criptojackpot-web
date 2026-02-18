export interface AuthRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface GoogleLoginRequest {
  idToken: string;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  rememberMe?: boolean;
}

export interface Verify2FaRequest {
  code?: string;
  recoveryCode?: string;
  rememberMe?: boolean;
}

export interface AuthResponseRole {
  id: number;
  name: string;
}

export interface AuthResponseUser {
  userGuid: string;
  name: string;
  lastName: string;
  email: string;
  phone?: string;
  imagePath?: string;
  status: boolean;
  emailVerified: boolean;
  role?: AuthResponseRole;
  expiresIn: number;
  requiresTwoFactor: boolean;
  twoFactorEnabled: boolean;
}

export interface AuthResponse {
  success: boolean;
  requiresTwoFactor?: boolean;
  data: AuthResponseUser;
}
