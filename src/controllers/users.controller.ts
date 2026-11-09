import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatedResponseDto, CreateUserDto } from '../dtos';
import { UserMapper } from '../mappers';
import { UserService } from '../services';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly userMapper: UserMapper,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Cadastrar um novo usuário',
    description:
      'Cria um novo usuário cidadão no sistema a partir dos dados informados.',
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
  async create(@Body() dto: CreateUserDto): Promise<CreatedResponseDto> {
    const domainEntity = this.userMapper.toDomainFromDto(dto);
    const id = await this.userService.create(domainEntity);
    return this.userMapper.toCreatedDto(id);
  }
}
