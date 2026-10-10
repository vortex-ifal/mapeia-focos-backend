export type MediaType = 'photo' | 'video';

export interface MediaProps {
  id?: string;
  occurrenceId: string;
  storageKey: string;
  mimeType: string;
  fileSizeBytes: number;
  type?: MediaType;
  isPublic?: boolean;
  uploadedAt?: Date;
}
