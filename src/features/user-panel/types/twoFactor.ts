export interface TwoFactorStatusResponse {
  isEnabled: boolean;
  isPendingSetup: boolean;
  recoveryCodesRemaining: number | null;
}

export interface TwoFactorSetupResponse {
  secret: string;
  qrCodeUri: string;
}

export interface Confirm2FaRequest {
  code: string;
}

export interface Confirm2FaResponse {
  recoveryCodes: string[];
  recoveryCodeCount: number;
}

export interface Disable2FaRequest {
  code?: string;
  recoveryCode?: string;
}

export interface Regenerate2FaRecoveryCodesRequest {
  code: string;
}
