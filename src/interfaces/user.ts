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
  emailVerified?: boolean;
  imagePath?: string;
  googleAccessToken?: string;
  googleRefreshToken?: string;
  token?: string;
  userGuid?: string;

  roleId: number;
  role?: Role;
  country?: Country;
}

/**
 * Request type for creating a new user. password is required here.
 * roleId and role are optional since public registration delegates role assignment to the backend.
 */
export interface CreateUserRequest extends Omit<User, 'password' | 'roleId' | 'role'> {
  password: string;
  referralCode?: string;
  roleId?: number;
  role?: Role;
}
