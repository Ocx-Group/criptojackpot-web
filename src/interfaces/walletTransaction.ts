export enum WalletTransactionDirection {
  Credit = 1,
  Debit = 2,
}

export enum WalletTransactionType {
  ReferralBonus = 1,
  ReferralPurchaseCommission = 2,
  LotteryPrize = 3,
  TicketPurchase = 4,
  Withdrawal = 5,
  WithdrawalRefund = 6,
  AdminCredit = 7,
  AdminDebit = 8,
}

export enum WalletTransactionStatus {
  Pending = 1,
  Completed = 2,
  Failed = 3,
  Reversed = 4,
}

export interface WalletTransaction {
  transactionGuid: string;
  userGuid: string;
  amount: number;
  direction: WalletTransactionDirection;
  type: WalletTransactionType;
  status: WalletTransactionStatus;
  balanceAfter: number;
  referenceId?: string;
  description?: string;
  createdAt: string;
}

export interface WalletBalance {
  balance: number;
  totalEarned: number;
  totalWithdrawn: number;
  totalPurchased: number;
}
