import { randomUUID } from 'crypto';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { MediaBuilder, MediaEntity } from '../entities';
import { STORAGE_PROVIDER } from '../infra';
import { MediaRepository } from '../repositories';
import { OccurrenceService } from './occurrence.service';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

const EXTENSION_BY_MIME: Record<AllowedMimeType, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const MAX_FILES_PER_OCCURRENCE = 3;
const PRESIGNED_URL_EXPIRES_IN = 900; // 15 minutos em segundos

@Injectable()
export class MediaService {
  private readonly bucket: string;

  constructor(
    @Inject(STORAGE_PROVIDER)
    private readonly s3: S3Client,
    private readonly mediaRepository: MediaRepository,
    private readonly occurrenceService: OccurrenceService,
    private readonly configService: ConfigService,
  ) {
    this.bucket = this.configService.getOrThrow<string>('R2_BUCKET_NAME');
  }

  /**
   * Detecta o MIME type real através de magic bytes no cabeçalho do buffer
   */
  private detectMimeType(buffer: Buffer): AllowedMimeType | null {
    if (!buffer || buffer.length < 12) {
      return null;
    }

    // JPEG: FF D8 FF
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      return 'image/jpeg';
    }

    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    ) {
      return 'image/png';
    }

    // WebP: RIFF .... WEBP
    // bytes 0-3: 'RIFF' (0x52 0x49 0x46 0x46)
    // bytes 8-11: 'WEBP' (0x57 0x45 0x42 0x50)
    if (
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46 &&
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50
    ) {
      return 'image/webp';
    }

    return null;
  }

  async uploadMedia(
    occurrenceId: string,
    file: Express.Multer.File,
  ): Promise<MediaEntity> {
    // 1. Validar magic bytes (inspeção real do buffer do arquivo)
    const detectedMimeType = this.detectMimeType(file.buffer);
    if (!detectedMimeType) {
      throw new UnprocessableEntityException(
        `Conteúdo de arquivo inválido ou não suportado. Formatos permitidos: ${ALLOWED_MIME_TYPES.join(', ')}`,
      );
    }

    // 2. Verificar se a ocorrência existe
    const occurrence = await this.occurrenceService.findById(occurrenceId);
    if (!occurrence) {
      throw new NotFoundException('Ocorrência não encontrada');
    }

    // 3. Validar limite de mídias por ocorrência (máximo 3)
    const currentCount =
      await this.mediaRepository.countByOccurrenceId(occurrenceId);
    if (currentCount >= MAX_FILES_PER_OCCURRENCE) {
      throw new BadRequestException(
        `Limite de ${MAX_FILES_PER_OCCURRENCE} mídias por ocorrência atingido`,
      );
    }

    // 4. Montar storageKey com extensão segura derivada do MIME validado
    const extension = EXTENSION_BY_MIME[detectedMimeType];
    const storageKey = `occurrences/${occurrenceId}/${randomUUID()}.${extension}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: storageKey,
        Body: file.buffer,
        ContentType: detectedMimeType,
      }),
    );

    // 5. Persistir metadados na base de dados
    const mediaEntity = MediaBuilder.create()
      .withOccurrenceId(occurrenceId)
      .withStorageKey(storageKey)
      .withMimeType(detectedMimeType)
      .withFileSizeBytes(file.size)
      .withType('photo')
      .build();

    return this.mediaRepository.create(mediaEntity);
  }

  async getSignedUrl(
    mediaId: string,
  ): Promise<{ signedUrl: string; expiresAt: Date }> {
    const media = await this.mediaRepository.findById(mediaId);
    if (!media) {
      throw new NotFoundException('Mídia não encontrada');
    }

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: media.storageKey,
    });

    const signedUrl = await getSignedUrl(this.s3, command, {
      expiresIn: PRESIGNED_URL_EXPIRES_IN,
    });

    const expiresAt = new Date(Date.now() + PRESIGNED_URL_EXPIRES_IN * 1000);

    return {
      signedUrl,
      expiresAt,
    };
  }
}
