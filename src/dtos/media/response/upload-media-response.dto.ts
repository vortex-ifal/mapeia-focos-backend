import { ApiProperty } from '@nestjs/swagger';

export class UploadMediaResponseDto {
  @ApiProperty({
    description: 'Identificador único (UUID) da mídia criada',
    example: 'd9b2d63d-a233-4123-856e-5f935930df30',
  })
  id: string;

  @ApiProperty({
    description: 'Chave de armazenamento do arquivo no storage (R2/S3)',
    example: 'occurrences/a1b2c3d4/d9b2d63d-foto.jpg',
  })
  storageKey: string;

  @ApiProperty({
    description: 'Tipo MIME do arquivo enviado',
    example: 'image/jpeg',
  })
  mimeType: string;

  @ApiProperty({
    description: 'Tamanho do arquivo em bytes',
    example: 1048576,
  })
  fileSizeBytes: number;

  @ApiProperty({
    description: 'Data e hora em que o upload foi concluído',
    example: '2026-10-14T21:00:00.000Z',
  })
  uploadedAt: Date;
}

