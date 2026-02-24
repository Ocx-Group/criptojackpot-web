import { BaseService } from './baseService';
import { CryptoWallet, CreateCryptoWalletRequest } from '@/interfaces/cryptoWallet';

class UserCryptoWalletService extends BaseService {
  protected endpoint = 'user-wallets';

  constructor() {
    super('/api/v1');
  }

  async getMyWallets(): Promise<CryptoWallet[]> {
    return this.getAll<CryptoWallet>();
  }

  async createWallet(data: CreateCryptoWalletRequest): Promise<CryptoWallet> {
    return this.create<CreateCryptoWalletRequest, CryptoWallet>(data);
  }

  async deleteWallet(walletGuid: string): Promise<void> {
    return this.delete(walletGuid);
  }

  async setDefault(walletGuid: string): Promise<CryptoWallet> {
    return this.patch<CryptoWallet>(`${this.endpoint}/${walletGuid}/default`, {});
  }
}

export { UserCryptoWalletService };
