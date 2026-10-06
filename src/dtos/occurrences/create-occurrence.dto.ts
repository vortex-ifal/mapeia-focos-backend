import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

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
}
