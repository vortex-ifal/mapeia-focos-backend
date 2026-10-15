import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateOccurrenceDto {
  @ApiProperty({
    description: 'Endereço da ocorrência',
    example: 'Rua das Flores, 123, Bairro Centro',
    minLength: 3,
  })
  @IsString({ message: 'O endereço deve ser uma string' })
  @IsNotEmpty({ message: 'O endereço é obrigatório' })
  @MinLength(3, { message: 'O endereço deve conter no mínimo 3 caracteres' })
  address: string;

  @ApiProperty({
    description: 'Descrição detalhada do foco ou situação observada',
    example: 'Pneus e recipientes plásticos acumulando água da chuva no quintal vizinho.',
    minLength: 5,
  })
  @IsString({ message: 'A descrição deve ser uma string' })
  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  @MinLength(5, { message: 'A descrição deve conter no mínimo 5 caracteres' })
  description: string;

  @ApiPropertyOptional({
    description: 'Tipo da situação ou ambiente do foco',
    example: 'Lote vago',
  })
  @IsString({ message: 'O tipo da situação deve ser uma string' })
  @IsOptional()
  situation_type?: string;


  // Se um dos dois for enviado, os dois passam a ser obrigatórios
  @ApiPropertyOptional({
    description: 'Latitude em coordenadas geográficas decimais (-90 a 90)',
    example: -23.55052,
    minimum: -90,
    maximum: 90,
  })
  @ValidateIf(
    (o: CreateOccurrenceDto) =>
      o.latitude !== undefined || o.longitude !== undefined,
  )
  @IsNumber(
    { maxDecimalPlaces: 6 },
    { message: 'A latitude deve ser um número com até 6 casas decimais' },
  )
  @Min(-90, { message: 'A latitude deve estar entre -90 e 90' })
  @Max(90, { message: 'A latitude deve estar entre -90 e 90' })
  latitude?: number;

  @ApiPropertyOptional({
    description: 'Longitude em coordenadas geográficas decimais (-180 a 180)',
    example: -46.633308,
    minimum: -180,
    maximum: 180,
  })
  @ValidateIf(
    (o: CreateOccurrenceDto) =>
      o.latitude !== undefined || o.longitude !== undefined,
  )
  @IsNumber(
    { maxDecimalPlaces: 6 },
    { message: 'A longitude deve ser um número com até 6 casas decimais' },
  )
  @Min(-180, { message: 'A longitude deve estar entre -180 e 180' })
  @Max(180, { message: 'A longitude deve estar entre -180 e 180' })
  longitude?: number;
}

