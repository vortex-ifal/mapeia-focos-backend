import { ApiProperty } from '@nestjs/swagger';

export class MediaResponseDto {
  @ApiProperty({
    description: 'Identificador único da mídia (UUID)',
    example: '6d24ec3d-e8c8-41cf-8878-50578cb8429d',
  })
  id: string;

  @ApiProperty({
    description: 'URL temporária pré-assinada para visualização segura da mídia',
    example:
      'https://bucket.r2.cloudflarestorage.com/media/file.jpg?X-Amz-Signature=...',
  })
  url: string;

  @ApiProperty({
    description: 'Tipo da mídia (ex.: photo ou video)',
    example: 'photo',
  })
  type: string;
}
