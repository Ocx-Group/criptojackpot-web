import { FieldValues, Path, UseFormSetError } from 'react-hook-form';

import { isApiValidationError } from '@/services/apiError';

/**
 * Cómo traducir una propiedad devuelta por el backend a un campo del formulario.
 * `message` permite sustituir el texto del backend (que llega en inglés) por la
 * traducción del front; si no se indica, se usa el mensaje del servidor.
 */
export interface ServerFieldMapping<T extends FieldValues> {
  field: Path<T>;
  message?: string;
}

/**
 * Vuelca los errores por campo de una respuesta 400 del backend sobre el estado
 * de react-hook-form, de modo que los inputs afectados queden marcados en rojo.
 *
 * @param error   error capturado (normalmente un ApiValidationError)
 * @param mapping claves = nombre de la propiedad del backend en minúsculas (name, statePlace → "stateplace")
 * @returns lista de campos del formulario a los que se aplicó un error
 */
export function applyServerFieldErrors<T extends FieldValues>(
  error: unknown,
  mapping: Record<string, ServerFieldMapping<T>>,
  setError: UseFormSetError<T>
): Path<T>[] {
  if (!isApiValidationError(error)) return [];

  const applied: Path<T>[] = [];

  for (const [property, messages] of Object.entries(error.fieldErrors)) {
    const target = mapping[property.toLowerCase()];
    if (!target) continue;

    setError(target.field, { type: 'server', message: target.message ?? messages[0] });
    applied.push(target.field);
  }

  return applied;
}

/**
 * Lleva el foco (y el scroll) al primer campo inválido.
 * Los inputs deben tener `id` igual al nombre del campo del formulario.
 */
export function focusFirstInvalidField(fieldNames: string[]): void {
  const [first] = fieldNames;
  if (!first || typeof globalThis.document === 'undefined') return;

  const element = document.getElementById(first);
  if (!element) return;

  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  (element as HTMLElement).focus({ preventScroll: true });
}
