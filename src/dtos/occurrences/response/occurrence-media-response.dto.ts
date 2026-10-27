import { ApiProperty } from '@nestjs/swagger';

export class OccurrenceMediaResponseDto {
  @ApiProperty({
    description: 'Identificador único da mídia',
    example: '6d24ec3d-e8c8-41cf-8878-50578cb8429d',
  })
  id: string;

  @ApiProperty({
    description: 'Tipo MIME do arquivo anexado',
    example: 'image/jpeg',
  })
  mimeType: string;

  @ApiProperty({
    description: 'Tamanho do arquivo em bytes',
    example: 1048576,
  })
  fileSizeBytes: number;

  @ApiProperty({
    description: 'Tipo da mídia (ex.: photo ou video)',
    example: 'photo',
  })
  type: string;

  @ApiProperty({
    description: 'Data e hora do envio da mídia em formato ISO 8601',
    example: '2026-10-27T15:31:00.000Z',
  })
  uploadedAt: Date;
}
