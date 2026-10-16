import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { UserBuilder, UserEntity } from '../entities';
import { CryptoService } from '../infra';
import { RolesRepository, UsersRepository } from '../repositories';

@Injectable()
export class UserService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly rolesRepository: RolesRepository,
    private readonly cryptoService: CryptoService,
  ) {}

  async create(entity: UserEntity): Promise<string> {
    const existingByEmail = await this.usersRepository.findByEmail(
      entity.email,
    );
    if (existingByEmail) {
      throw new ConflictException('E-mail já cadastrado no sistema');
    }

    const existingByCpf = await this.usersRepository.findByCpf(entity.cpf);
    if (existingByCpf) {
      throw new ConflictException('CPF já cadastrado no sistema');
    }

    const rawPassword = entity.password;
    if (!rawPassword) {
      throw new BadRequestException('A senha é obrigatória');
    }

    let role = entity.role;
    if (!role) {
      const defaultRole = await this.rolesRepository.findByName('citizen');
      if (!defaultRole) {
        throw new BadRequestException('Role padrão "citizen" não encontrada no sistema');
      }
      role = defaultRole;
    }

    const passwordHash = await this.cryptoService.hash(rawPassword);

    const entityWithHash = UserBuilder.create()
      .withName(entity.name)
      .withEmail(entity.email)
      .withPassword(passwordHash)
      .withCpf(entity.cpf)
      .withRole(role)
      .withIsActive(entity.isActive)
      .build();

    try {
      return await this.usersRepository.create(entityWithHash);
    } catch (error) {
      // Trata race condition: em requisições simultâneas com mesmo e-mail ou CPF,
      // as checagens acima podem passar, mas o banco rejeita com o SQLSTATE '23505' (unique_violation).
      // O Drizzle encapsula o erro do driver em `cause`, por isso verificamos ambos os níveis.
      const code =
        (error as { code?: string; cause?: { code?: string } })?.code ??
        (error as { cause?: { code?: string } })?.cause?.code;

      if (code === '23505') {
        throw new ConflictException('E-mail ou CPF já cadastrado no sistema');
      }

      // Propaga qualquer outro erro inesperado (ex.: falha de conexão)
      throw error;
    }
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.usersRepository.findById(id);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findByEmail(email);
  }

  async findByCpf(cpf: string): Promise<UserEntity | null> {
    return this.usersRepository.findByCpf(cpf);
  }
}
