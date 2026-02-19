export interface UpdateUserRequest {
  name: string;
  lastName: string;
  phone: string;
  countryId: number;
  statePlace: string;
  city: string;
  address?: string;
}
