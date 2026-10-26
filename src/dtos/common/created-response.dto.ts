import { ApiProperty } from '@nestjs/swagger';

export class CreatedResponseDto {
  @ApiProperty({
    description: 'Identificador único (UUID) do recurso criado',
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  })
  id!: string;

  @ApiProperty({
    description: 'Código de protocolo alfanumérico gerado para o recurso',
    example: 'a1b2c',
    required: false,
  })
  protocol?: string;
}
