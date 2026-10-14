import { ApiProperty } from '@nestjs/swagger';

export class SignedUrlResponseDto {
  @ApiProperty({
    description: 'URL pré-assinada temporária para visualização/download seguro da mídia',
    example: 'https://r2.exemplo.com/occurrences/...?...',
  })
  signedUrl: string;

  @ApiProperty({
    description: 'Data e hora limite de expiração da URL assinada',
    example: '2026-10-14T21:15:00.000Z',
  })
  expiresAt: Date;
}

