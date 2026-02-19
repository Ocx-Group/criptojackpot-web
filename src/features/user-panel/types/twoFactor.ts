export interface TwoFactorSetupResponse {
  sharedKey: string;
  authenticatorUri: string;
  recoveryCodes?: string[];
}

export interface TwoFactorStatusResponse {
  twoFactorEnabled: boolean;
  hasAuthenticator: boolean;
}

export interface Enable2FaRequest {
  code: string;
}

export interface Enable2FaResponse {
  success: boolean;
  recoveryCodes: string[];
}

export interface Disable2FaRequest {
  code: string;
}
