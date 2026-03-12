export enum WithdrawalRequestStatus {
  Pending = 1,
  Approved = 2,
  Rejected = 3,
  Completed = 4,
  Cancelled = 5,
}

export interface AdminWithdrawalRequest {
  requestGuid: string;
  userGuid: string;
  amount: number;
  status: string;
  walletAddress: string;
  currencySymbol: string;
  currencyName: string;
  adminNotes?: string;
  createdAt: string;
  processedAt?: string;
}

export interface ProcessWithdrawalRequest {
  adminNotes?: string;
}
