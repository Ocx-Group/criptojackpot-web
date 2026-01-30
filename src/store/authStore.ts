import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { signOut } from 'next-auth/react';

// Simplified auth state for Keycloak - most auth is handled by next-auth
interface AuthState {
  // Legacy fields for compatibility
  resetPasswordEmail: string | null;

  // Actions
  logout: () => void;
  setResetPasswordEmail: (email: string) => void;
  clearResetPasswordEmail: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      resetPasswordEmail: null,

      logout: () => {
        set({
          resetPasswordEmail: null,
        });
        // Trigger next-auth signOut
        signOut({ callbackUrl: '/login' });
      },

      setResetPasswordEmail: email => {
        set({ resetPasswordEmail: email });
      },

      clearResetPasswordEmail: () => {
        set({ resetPasswordEmail: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        resetPasswordEmail: state.resetPasswordEmail,
      }),
    }
  )
);
