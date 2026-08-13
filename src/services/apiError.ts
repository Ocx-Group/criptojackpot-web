/**
 * Tipos de error de API que preservan el detalle por campo que devuelve el backend.
 *
 * El backend responde a los fallos de validación con:
 *   { success: false, message: "One or more validation errors occurred", errors: { "Password": ["..."] } }
 * (ver Domain/Extensions/ResultResponseExtensions.cs) y ASP.NET, cuando falla el
 * model binding, responde con ProblemDetails: { title, status, errors: { ... } }.
 *
 * Antes solo se propagaba `message`, por lo que la UI mostraba el texto genérico
 * "One or more validation errors occurred". Estas clases conservan el diccionario
 * `errors` para poder marcar en rojo los inputs concretos.
 */

/** Payload de error tal como lo devuelve el backend (ambos formatos). */
export interface ApiErrorPayload {
  success?: boolean;
  message?: string;
  /** ProblemDetails de ASP.NET usa `title` en lugar de `message`. */
  title?: string;
  errors?: Record<string, string[] | string>;
}

export class ApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/** Error 400 con detalle por campo. Las claves vienen en PascalCase (Name, StatePlace...). */
export class ApiValidationError extends ApiError {
  readonly fieldErrors: Record<string, string[]>;

  constructor(message: string, status: number | undefined, fieldErrors: Record<string, string[]>) {
    super(message, status);
    this.name = 'ApiValidationError';
    this.fieldErrors = fieldErrors;
  }
}

export const isApiError = (error: unknown): error is ApiError => error instanceof ApiError;

export const isApiValidationError = (error: unknown): error is ApiValidationError =>
  error instanceof ApiValidationError;

/**
 * Normaliza el diccionario `errors` del backend a `Record<string, string[]>`.
 * Devuelve undefined si la respuesta no trae errores por campo.
 */
export function extractFieldErrors(payload: ApiErrorPayload | undefined): Record<string, string[]> | undefined {
  if (!payload?.errors || typeof payload.errors !== 'object') return undefined;

  const normalized: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(payload.errors)) {
    if (Array.isArray(value)) {
      const messages = value.filter((m): m is string => typeof m === 'string');
      if (messages.length > 0) normalized[key] = messages;
    } else if (typeof value === 'string') {
      normalized[key] = [value];
    }
  }

  return Object.keys(normalized).length > 0 ? normalized : undefined;
}
