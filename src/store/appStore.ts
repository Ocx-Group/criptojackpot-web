import { create } from 'zustand';
import { Country } from '@/interfaces/country';
import { countryService } from '@/services';

interface AppState {
  countries: Country[];
  isLoadingCountries: boolean;
  countriesError: string | null;
  selectedLanguage: string;

  // Actions
  loadCountries: () => Promise<void>;
  setLanguage: (language: string) => void;
  clearCountriesError: () => void;
}

export const useAppStore = create<AppState>(set => ({
  countries: [],
  isLoadingCountries: false,
  countriesError: null,
  selectedLanguage: 'es',

  loadCountries: async () => {
    const { countries } = useAppStore.getState();

    // Si ya tenemos países cargados, no volver a cargar
    if (countries.length > 0) return;

    set({ isLoadingCountries: true, countriesError: null });
    try {
      const countriesData = await countryService.getAllCountries();
      set({ countries: countriesData, isLoadingCountries: false });
    } catch (error: any) {
      set({
        isLoadingCountries: false,
        countriesError: error.message || 'Error al cargar países',
      });
      throw error;
    }
  },

  clearCountriesError: () => {
    set({ countriesError: null });
  },

  setLanguage: language => {
    set({ selectedLanguage: language });
  },
}));
