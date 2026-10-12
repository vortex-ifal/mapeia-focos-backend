export class UploadMediaResponseDto {
  id: string;
  storageKey: string;
  mimeType: string;
  fileSizeBytes: number;
  uploadedAt: Date;
}
