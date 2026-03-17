/**
 * Instancias singleton de todos los servicios.
 * Importar directamente desde '@/services' en lugar de usar DI.
 *
 * @example
 * import { authService, userService } from '@/services';
 * const user = await userService.getCurrentUser();
 */
import { AuthService } from './authService';
import { UserService } from './userService';
import { CountryService } from './countryService';
import { UserReferralService } from './userReferralService';
import { DigitalOceanStorageService } from './digitalOceanStorageService';
import { RoleService } from './roleService';
import { PrizeService } from './prizeService';
import { LotteryService } from './lotteryService';
import { LotteryNumberService } from './lotteryNumberService';
import { TwoFactorService } from './twoFactorService';
import { UserCryptoWalletService } from './userCryptoWalletService';
import { WalletService } from './walletService';
import { TicketService } from './ticketService';
import { OrderService } from './orderService';
import { WishListService } from './wishListService';
import { WinnerService } from './winnerService';

export const authService = new AuthService();
export const userService = new UserService();
export const countryService = new CountryService();
export const userReferralService = new UserReferralService();
export const digitalOceanStorageService = new DigitalOceanStorageService();
export const roleService = new RoleService();
export const prizeService = new PrizeService();
export const lotteryService = new LotteryService();
export const lotteryNumberService = new LotteryNumberService();
export const twoFactorService = new TwoFactorService();
export const userCryptoWalletService = new UserCryptoWalletService();
export const walletService = new WalletService();
export const ticketService = new TicketService();
export const orderService = new OrderService();
export const wishListService = new WishListService();
export const winnerService = new WinnerService();
