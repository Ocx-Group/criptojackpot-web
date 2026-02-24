export interface CryptoWallet {
  walletGuid: string;
  address: string;
  currencySymbol: string;
  currencyName: string;
  logoUrl?: string;
  label: string;
  isDefault: boolean;
  createdAt: string;
}

export interface CreateCryptoWalletRequest {
  address: string;
  currencySymbol: string;
  currencyName: string;
  logoUrl?: string;
  label: string;
}
