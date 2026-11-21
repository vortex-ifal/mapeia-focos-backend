import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CryptoService } from '../infra';
import { UsersRepository } from '../repositories';

export interface JwtAuthPayload {
  sub: string;
  name: string;
  email: string;
  role?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, plainPassword: string): Promise<string> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await this.cryptoService.compare(
      plainPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload: JwtAuthPayload = {
      sub: user.id ?? '',
      name: user.name,
      email: user.email,
      role: user.role?.name,
    };

    return this.jwtService.signAsync(payload);
  }
}
