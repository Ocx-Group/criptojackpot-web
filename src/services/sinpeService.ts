import { BaseService } from './baseService';
import { PaginatedResponse } from '@/interfaces/paginatedResponse';
import {
  SinpeConfig,
  SinpeConfigAdmin,
  SinpePayment,
  SinpePaymentAdmin,
  SinpePaymentStatus,
  SinpeUploadUrl,
  SubmitSinpePaymentPayload,
  UpdateSinpeConfigPayload,
} from '@/interfaces/sinpe';

/** Tipos de imagen aceptados para el comprobante (espejo de la whitelist del backend). */
const ALLOWED_RECEIPT_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic'];

const MAX_RECEIPT_SIZE = 10 * 1024 * 1024; // 10MB

class SinpeService extends BaseService {
  protected endpoint = 'orders';

  constructor() {
    super('/api/v1');
  }

  // ── Comprador ─────────────────────────────────────────────────────────

  /** Teléfono destino, titular, tipo de cambio e instrucciones. */
  async getConfig(): Promise<SinpeConfig> {
    return this.getById<SinpeConfig>('sinpe/config');
  }

  /** Estado del comprobante que el usuario ya envió para su orden. */
  async getByOrder(orderId: string): Promise<SinpePayment> {
    return this.getById<SinpePayment>(`sinpe/${orderId}`);
  }

  /**
   * Sube el comprobante a DigitalOcean Spaces con una URL prefirmada y lo registra.
   * El objeto queda PRIVADO: a diferencia de digitalOceanStorageService, aquí no se
   * manda `x-amz-acl: public-read` porque un comprobante lleva datos bancarios.
   */
  async submitReceipt(
    orderId: string,
    file: File,
    extras: { senderPhone?: string; referenceNumber?: string } = {}
  ): Promise<SinpePayment> {
    SinpeService.validateReceiptFile(file);

    const presigned = await this.create<{ fileName: string; contentType: string }, SinpeUploadUrl>(
      { fileName: file.name, contentType: file.type },
      `sinpe/${orderId}/upload-url`
    );

    const uploadResponse = await fetch(presigned.uploadUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type },
    });

    if (!uploadResponse.ok) {
      throw new Error(`No se pudo subir el comprobante (${uploadResponse.status})`);
    }

    return this.create<SubmitSinpePaymentPayload, SinpePayment>(
      {
        storageKey: presigned.storageKey,
        contentType: file.type,
        senderPhone: extras.senderPhone?.trim() || undefined,
        referenceNumber: extras.referenceNumber?.trim() || undefined,
      },
      `sinpe/${orderId}/submit`
    );
  }

  /** Valida el archivo antes de gastar una llamada al backend. */
  static validateReceiptFile(file: File): void {
    if (!file.type.startsWith('image/') || !ALLOWED_RECEIPT_TYPES.includes(file.type.toLowerCase())) {
      throw new Error('El comprobante debe ser una imagen (JPG, PNG, WEBP o HEIC)');
    }

    if (file.size > MAX_RECEIPT_SIZE) {
      throw new Error('El archivo es demasiado grande (máximo 10MB)');
    }
  }

  // ── Admin ─────────────────────────────────────────────────────────────

  async getPayments(
    page: number = 1,
    pageSize: number = 10,
    status?: SinpePaymentStatus
  ): Promise<PaginatedResponse<SinpePaymentAdmin>> {
    const params: Record<string, string> = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };
    if (status !== undefined) {
      params.status = status.toString();
    }
    return this.getAllPaginated<SinpePaymentAdmin>({ path: 'sinpe/admin', params });
  }

  /** Aprueba el comprobante: completa la orden y acredita los números reservados. */
  async approve(sinpePaymentGuid: string, adminNotes?: string): Promise<SinpePayment> {
    return this.create<{ adminNotes?: string }, SinpePayment>(
      { adminNotes },
      `sinpe/admin/${sinpePaymentGuid}/approve`
    );
  }

  /** Rechaza el comprobante: expira la orden y LIBERA los números. Requiere motivo. */
  async reject(sinpePaymentGuid: string, adminNotes: string): Promise<SinpePayment> {
    return this.create<{ adminNotes: string }, SinpePayment>(
      { adminNotes },
      `sinpe/admin/${sinpePaymentGuid}/reject`
    );
  }

  async getAdminConfig(): Promise<SinpeConfigAdmin> {
    return this.getById<SinpeConfigAdmin>('sinpe/admin/config');
  }

  async updateAdminConfig(payload: UpdateSinpeConfigPayload): Promise<SinpeConfigAdmin> {
    return this.update<UpdateSinpeConfigPayload, SinpeConfigAdmin>('config', payload, 'sinpe/admin');
  }
}

export { SinpeService };
