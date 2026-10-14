import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { SignedUrlResponseDto, UploadMediaResponseDto } from '../dtos';
import { MediaMapper } from '../mappers';
import { MediaService } from '../services';

@ApiTags('Media')
@Controller()
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly mediaMapper: MediaMapper,
  ) {}

  @Post('occurrences/:id/media')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Fazer upload de mídias para uma ocorrência',
    description:
      'Envia até 3 arquivos vinculados à ocorrência especificada (máximo 10MB por arquivo).',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    description: 'Identificador único (UUID) da ocorrência',
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Lista de arquivos de mídia (máx. 3)',
        },
      },
      required: ['files'],
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Mídias enviadas com sucesso.',
    type: [UploadMediaResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Nenhum arquivo enviado ou limites excedidos.',
  })
  @UseInterceptors(
    FilesInterceptor('files', 3, {
      storage: memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async upload(
    @Param('id') occurrenceId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<UploadMediaResponseDto[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    const results: UploadMediaResponseDto[] = [];

    for (const file of files) {
      const entity = await this.mediaService.uploadMedia(occurrenceId, file);
      results.push(this.mediaMapper.toDto(entity));
    }

    return results;
  }

  @Get('media/:id/signed-url')
  @ApiOperation({
    summary: 'Obter URL pré-assinada de uma mídia',
    description:
      'Gera uma URL temporária com permissão de leitura para visualização segura do arquivo.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador único (UUID) da mídia',
    example: 'd9b2d63d-a233-4123-856e-5f935930df30',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'URL pré-assinada gerada com sucesso.',
    type: SignedUrlResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Mídia não encontrada.',
  })
  async getSignedUrl(
    @Param('id') mediaId: string,
  ): Promise<SignedUrlResponseDto> {
    return this.mediaService.getSignedUrl(mediaId);
  }
}

