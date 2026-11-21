import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../common';
import {
  CreatedResponseDto,
  CreateUserDto,
  LoginRequestDto,
  LoginResponseDto,
} from '../dtos';
import { AuthMapper, UserMapper } from '../mappers';
import { AuthService, UserService } from '../services';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly userMapper: UserMapper,
    private readonly authService: AuthService,
    private readonly authMapper: AuthMapper,
  ) {}

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Cadastrar um novo usuário',
    description:
      'Registra um novo usuário no sistema, aplicando hash na senha e atribuindo o perfil padrão.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuário cadastrado com sucesso.',
    type: CreatedResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados da requisição inválidos.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'E-mail ou CPF já cadastrado no sistema.',
  })
  async register(@Body() dto: CreateUserDto): Promise<CreatedResponseDto> {
    const domainEntity = this.userMapper.toDomainFromDto(dto);
    const id = await this.userService.create(domainEntity);
    return this.userMapper.toCreatedDto(id);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Autenticar usuário e emitir token JWT',
    description:
      'Valida as credenciais informadas (e-mail e senha) e retorna o token JWT de acesso.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Autenticação realizada com sucesso.',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados da requisição inválidos.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Credenciais inválidas.',
  })
  async login(@Body() dto: LoginRequestDto): Promise<LoginResponseDto> {
    const accessToken = await this.authService.login(dto.email, dto.password);
    return this.authMapper.toLoginResponseDto(accessToken);
  }
}
