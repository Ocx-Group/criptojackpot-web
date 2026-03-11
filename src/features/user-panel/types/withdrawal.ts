export interface CreateWithdrawalRequest {
  amount: number;
  walletGuid: string;
  twoFactorCode?: string;
  emailVerificationCode?: string;
}

export interface WithdrawalRequestDto {
  withdrawalGuid: string;
  amount: number;
  status: string;
  walletAddress: string;
  currencySymbol: string;
  createdAt: string;
}
