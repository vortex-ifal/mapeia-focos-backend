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
  @IsString({ message: 'O endereço deve ser uma string' })
  @IsNotEmpty({ message: 'O endereço é obrigatório' })
  @MinLength(3, { message: 'O endereço deve conter no mínimo 3 caracteres' })
  address: string;

  @IsString({ message: 'A descrição deve ser uma string' })
  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  @MinLength(5, { message: 'A descrição deve conter no mínimo 5 caracteres' })
  description: string;

  @IsString({ message: 'O tipo da situação deve ser uma string' })
  @IsOptional()
  situation_type?: string;

  @IsString({ message: 'O contato deve ser uma string' })
  @IsOptional()
  contact?: string;

  // Se um dos dois for enviado, os dois passam a ser obrigatórios
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
