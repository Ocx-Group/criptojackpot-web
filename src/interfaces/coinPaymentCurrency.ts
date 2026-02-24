export interface CoinPaymentCurrency {
  id: string;
  type: string;
  symbol: string;
  name: string;
  logoUrl?: string;
  decimalPlaces: number;
  rank: number;
  status: string;
  capabilities: string[];
  requiredConfirmations: number;
  isEnabledForPayment: boolean;
}
