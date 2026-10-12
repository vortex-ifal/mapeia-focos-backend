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
import { memoryStorage } from 'multer';
import { SignedUrlResponseDto, UploadMediaResponseDto } from '../dtos';
import { MediaMapper } from '../mappers';
import { MediaService } from '../services';

@Controller()
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly mediaMapper: MediaMapper,
  ) {}

  @Post('occurrences/:id/media')
  @HttpCode(HttpStatus.CREATED)
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
  async getSignedUrl(
    @Param('id') mediaId: string,
  ): Promise<SignedUrlResponseDto> {
    return this.mediaService.getSignedUrl(mediaId);
  }
}
