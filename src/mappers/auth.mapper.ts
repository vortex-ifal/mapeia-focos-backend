import { Injectable } from '@nestjs/common';
import { LoginResponseDto } from '../dtos';

@Injectable()
export class AuthMapper {
  toLoginResponseDto(accessToken: string): LoginResponseDto {
    return {
      accessToken,
    };
  }
}
