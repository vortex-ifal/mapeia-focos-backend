import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser, Roles } from '../common';
import type { AuthenticatedUserPayload } from '../common';
import { UuidParamDto } from '../dtos';
import { OccurrenceService } from '../services';

@ApiTags('Management Occurrences')
@ApiBearerAuth()
@Controller('management/occurrences')
export class ManagementOccurrencesController {
  constructor(private readonly occurrenceService: OccurrenceService) {}

  @Patch(':id/archive')
  @Roles('manager')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Arquivar uma ocorrência',
    description:
      'Arquiva administrativamente uma ocorrência não resolvida, sem alterar seu status.',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Ocorrência arquivada com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'O identificador da ocorrência informado não é um UUID válido.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ocorrência não encontrada no sistema.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'A ocorrência já está arquivada ou está resolvida e não pode ser arquivada.',
  })
  async archive(
    @CurrentUser() user: AuthenticatedUserPayload,
    @Param() params: UuidParamDto,
  ): Promise<void> {
    await this.occurrenceService.archive(params.id, user.sub);
  }

  @Patch(':id/restore')
  @Roles('manager')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Restaurar uma ocorrência arquivada',
    description:
      'Remove o arquivamento administrativo, mantendo o status atual da ocorrência.',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Ocorrência restaurada com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'O identificador da ocorrência informado não é um UUID válido.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ocorrência não encontrada no sistema.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'A ocorrência não está arquivada.',
  })
  async restore(
    @CurrentUser() user: AuthenticatedUserPayload,
    @Param() params: UuidParamDto,
  ): Promise<void> {
    await this.occurrenceService.restore(params.id, user.sub);
  }
}
