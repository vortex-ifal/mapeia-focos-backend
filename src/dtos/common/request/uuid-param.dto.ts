import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UuidParamDto {
  @ApiProperty({
    description: 'Identificador único (UUID) do registro',
    example: '0192e2be-89fa-7da5-b54c-53538b71569a',
  })
  @IsUUID('all', { message: 'O ID fornecido deve ser um UUID válido' })
  id: string;
}
