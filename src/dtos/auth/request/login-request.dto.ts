import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({
    description: 'E-mail cadastrado do usuário',
    example: 'cidadao@email.com',
    maxLength: 255,
  })
  @Transform(({ value }: { value: string }) => value?.trim().toLowerCase())
  @IsEmail({}, { message: 'O e-mail informado é inválido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  @MaxLength(255, { message: 'O e-mail deve conter no máximo 255 caracteres' })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'Test1234!',
    minLength: 6,
    maxLength: 72,
  })
  @IsString({ message: 'A senha deve ser uma string' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve conter no mínimo 6 caracteres' })
  @MaxLength(72, { message: 'A senha deve conter no máximo 72 caracteres' })
  password: string;
}
