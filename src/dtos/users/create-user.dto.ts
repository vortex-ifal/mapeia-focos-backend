import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'Maria da Silva',
    minLength: 3,
    maxLength: 255,
  })
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @MinLength(3, { message: 'O nome deve conter no mínimo 3 caracteres' })
  @MaxLength(255, { message: 'O nome deve conter no máximo 255 caracteres' })
  name: string;

  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'maria.silva@exemplo.com',
    maxLength: 255,
  })
  @Transform(({ value }: { value: string }) => value?.trim().toLowerCase())
  @IsEmail({}, { message: 'O e-mail informado é inválido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  @MaxLength(255, { message: 'O e-mail deve conter no máximo 255 caracteres' })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário (entre 6 e 72 caracteres)',
    example: 'Senha@Forte123',
    minLength: 6,
    maxLength: 72,
  })
  @IsString({ message: 'A senha deve ser uma string' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve conter no mínimo 6 caracteres' })
  @MaxLength(72, { message: 'A senha deve conter no máximo 72 caracteres' })
  password: string;

  @ApiProperty({
    description: 'CPF do usuário (11 dígitos numéricos)',
    example: '12345678901',
    minLength: 11,
    maxLength: 11,
  })
  @Transform(({ value }: { value?: string }) => value?.replace(/\D/g, ''))
  @IsString({ message: 'O CPF deve ser uma string' })
  @IsNotEmpty({ message: 'O CPF é obrigatório' })
  @Length(11, 11, { message: 'O CPF deve conter exatamente 11 dígitos' })
  cpf: string;
}
