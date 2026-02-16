import { FieldErrors } from 'react-hook-form';

/**
 * Extracts the first error message from react-hook-form FieldErrors.
 * Useful for showing a single toast notification with the first validation error.
 */
export function getFirstFieldError(errors: FieldErrors): string | undefined {
  for (const key of Object.keys(errors)) {
    const error = errors[key];
    if (error?.message && typeof error.message === 'string') {
      return error.message;
    }
  }
  return undefined;
}
