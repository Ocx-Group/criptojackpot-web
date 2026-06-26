/**
 * Configuración global del sitio — única fuente de verdad para datos de contacto/marca.
 * Sobrescribible por entorno (build-time) sin tocar el código.
 */
export const siteConfig = {
  /** Email de contacto/soporte. Override: NEXT_PUBLIC_CONTACT_EMAIL */
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'support@criptojackpot.com',
} as const;
