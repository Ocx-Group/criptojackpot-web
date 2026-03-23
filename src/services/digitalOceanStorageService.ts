import { BaseService } from './baseService';

interface UploadRequest {
  fileName: string;
  contentType: string;
  expirationMinutes?: number;
  userId: number;
  folder?: string;
}

interface PresignedUrlResponse {
  uploadUrl: string;
  storageKey: string;
}

interface UploadResponse {
  fileName: string;
  fileUrl: string;
  cdnUrl: string;
}

export class DigitalOceanStorageService extends BaseService {
  protected endpoint: string = 'users';

  constructor() {
    super('/api/v1');
  }

  /**
   * Sube un archivo usando presigned URL del backend
   */
  async uploadFile(file: File, userId: number, folder: string = 'profile-photos'): Promise<UploadResponse> {
    if (!file.type.startsWith('image/')) {
      throw new Error('Solo se permiten archivos de imagen');
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error('El archivo es demasiado grande (máximo 10MB)');
    }

    const originalFileName = file.name;

    // Solicitar presigned URL al backend
    const presignedResponse = await this.getPresignedUploadUrl({
      fileName: originalFileName,
      contentType: file.type,
      expirationMinutes: 15,
      userId: userId,
      folder: folder,
    });

    // Subir archivo directamente a Digital Ocean
    await this.uploadToDigitalOcean(presignedResponse.uploadUrl, file);

    // Construir URLs de respuesta
    const fileUrl = presignedResponse.uploadUrl.split('?')[0];
    const cdnUrl = fileUrl.replace(
      'cryptojackpot.nyc3.digitaloceanspaces.com',
      'cryptojackpot.nyc3.cdn.digitaloceanspaces.com'
    );

    const fileName = presignedResponse.storageKey;

    return {
      fileName,
      fileUrl,
      cdnUrl,
    };
  }

  /**
   * Sube múltiples archivos
   */
  async uploadMultipleFiles(files: File[], userId: number, folder: string = 'profile-photos'): Promise<UploadResponse[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, userId, folder));
    return await Promise.all(uploadPromises);
  }

  /**
   * Sube foto de perfil y actualiza en el backend
   */
  async uploadProfilePhoto(file: File, userId: number): Promise<string> {
    const { fileUrl } = await this.uploadFile(file, userId, 'profile-photos');
    return fileUrl;
  }

  /**
   * Sube imagen de premio
   */
  async uploadPrizeImage(file: File, userId: number): Promise<string> {
    const { cdnUrl } = await this.uploadFile(file, userId, 'prize-images');
    return cdnUrl;
  }

  /**
   * Obtener presigned URL del backend
   */
  async getPresignedUploadUrl(request: UploadRequest): Promise<PresignedUrlResponse> {
    return this.create<object, PresignedUrlResponse>(
      {
        fileName: request.fileName,
        contentType: request.contentType,
        expirationMinutes: request.expirationMinutes ?? 15,
        folder: request.folder ?? 'profile-photos',
      },
      `${request.userId}/image/upload-url`
    );
  }

  /**
   * Subir archivo directamente a Digital Ocean usando presigned URL
   */
  private async uploadToDigitalOcean(presignedUrl: string, file: File): Promise<void> {
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
        'x-amz-acl': 'public-read',
      },
    });

    if (!response.ok) {
      const errorMessage = `Upload failed: ${response.status} ${response.statusText}`;
      console.error('Error uploading to Digital Ocean:', errorMessage);
      throw new Error(errorMessage);
    }
  }
}
