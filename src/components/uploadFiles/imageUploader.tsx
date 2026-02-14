'use client';

import { digitalOceanStorageService } from '@/services';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

const ImageUploader: React.FC<{
  onUploadComplete: (url: string) => void;
  onCancel: () => void;
  userId: number;
  singleUpload?: boolean;
}> = ({ onUploadComplete, onCancel, userId, singleUpload = false }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    const file = files[0];
    setPreview(URL.createObjectURL(file));

    setUploading(true);
    try {
      const uploadedFiles = await digitalOceanStorageService.uploadMultipleFiles(Array.from(files), userId);

      if (singleUpload) {
        onUploadComplete(uploadedFiles[0].cdnUrl);
      }
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="modal fade show d-flex align-items-center justify-content-center"
      tabIndex={-1}
      style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4 text-center">
          <button
            title="close button"
            type="button"
            className="btn-close position-absolute top-0 end-0 m-3"
            onClick={onCancel}
          ></button>

          <h2 className="mb-3">Subir Imagen</h2>

          <label
            className="border border-2 border-secondary rounded p-4 d-flex flex-column align-items-center justify-content-center cursor-pointer mb-3"
            style={{ borderStyle: 'dashed', cursor: 'pointer' }}
          >
            <Upload size={40} className="text-secondary mb-2" />
            <span className="text-muted">Haz clic o arrastra una imagen</span>
            <input type="file" accept="image/*" onChange={handleFileSelect} className="d-none" />
          </label>

          {preview && (
            <div className="mb-3 position-relative" style={{ width: '150px', height: '150px', margin: 'auto' }}>
              <Image src={preview} alt="Vista previa" fill className="rounded object-fit-cover" />
            </div>
          )}

          {uploading && (
            <div className="text-primary mt-3">
              <div className="spinner-border text-primary" aria-hidden="true">
                <span className="visually-hidden">Subiendo...</span>
              </div>
              <output className="mt-2 d-block">Subiendo...</output>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
