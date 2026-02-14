import { Country } from '@/interfaces/country';
import { BaseService } from './baseService';

class CountryService extends BaseService {
  protected override endpoint = 'countries';

  /**
   * Constructor - Define el prefijo del microservicio de países
   * Apunta a la ruta definida en ingress.yaml para identity-api (/api/v1/countries)
   */
  constructor() {
    super('/api/v1');
  }

  async getAllCountries(): Promise<Country[]> {
    return this.getAll<Country>();
  }

  async getByRegion(region: string): Promise<Country[]> {
    return this.getAll<Country>({ path: `region/${region}` });
  }
}

export { CountryService };
