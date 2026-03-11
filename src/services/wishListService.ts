import { BaseService } from './baseService';
import { WishListItem } from '@/interfaces/wishlist';

class WishListService extends BaseService {
  protected endpoint = 'wishlists';

  constructor() {
    super('/api/v1');
  }

  async getWishList(): Promise<WishListItem[]> {
    return this.getAll<WishListItem>();
  }

  async addToWishList(lotteryGuid: string): Promise<WishListItem> {
    return this.create<Record<string, never>, WishListItem>({}, lotteryGuid);
  }

  async removeFromWishList(lotteryGuid: string): Promise<void> {
    return this.delete(lotteryGuid);
  }
}

export { WishListService };
