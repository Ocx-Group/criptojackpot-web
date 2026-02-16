import { Country } from './country';
import { Role } from './role';

/**
 * Domain model for user data as returned by the API.
 * password is optional here because the backend never returns it in GET responses.
 */
export interface User {
  id?: number;
  name: string;
  lastName: string;
  email: string;
  password?: string;
  identification?: string;
  phone?: string;
  countryId: number;
  statePlace: string;
  city: string;
  address?: string;
  status: boolean;
  imagePath?: string;
  googleAccessToken?: string;
  googleRefreshToken?: string;
  token?: string;
  securityCode?: string;

  roleId: number;
  role?: Role;
  country?: Country;
}

/**
 * Request type for creating a new user. password is required here.
 */
export interface CreateUserRequest extends Omit<User, 'password'> {
  password: string;
}
