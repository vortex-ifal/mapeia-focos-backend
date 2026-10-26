import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsString, Length } from 'class-validator';

export class ProtocolParamDto {
  @ApiProperty({
    example: 'a1b2c',
    description: 'Código alfanumérico do protocolo de 5 caracteres',
  })
  @IsString({ message: 'O protocolo deve ser uma string' })
  @IsAlphanumeric('en-US', {
    message: 'O protocolo deve conter apenas caracteres alfanuméricos',
  })
  @Length(5, 5, {
    message: 'O protocolo deve conter exatamente 5 caracteres',
  })
  protocol!: string;
}
