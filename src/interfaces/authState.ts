/**
 * @deprecated This interface is deprecated. Authentication is now handled by next-auth/Keycloak.
 * Use useSession() from next-auth/react for authentication state.
 * Use useUserStore() for user profile data.
 */
export interface AuthState {
  // Legacy fields for password reset functionality
  resetPasswordEmail: string | null;

  // Actions
  logout: () => void;
  setResetPasswordEmail: (email: string) => void;
  clearResetPasswordEmail: () => void;
}
