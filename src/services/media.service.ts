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

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
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

  async uploadMedia(
    occurrenceId: string,
    file: Express.Multer.File,
  ): Promise<MediaEntity> {
    // 1. Validar tipo MIME permitido
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new UnprocessableEntityException(
        `Tipo de arquivo não suportado: ${file.mimetype}. Formatos permitidos: ${ALLOWED_MIME_TYPES.join(', ')}`,
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

    // 4. Montar storageKey e enviar arquivo ao R2 com acesso privado
    const extension = file.originalname.split('.').pop() || 'jpg';
    const storageKey = `occurrences/${occurrenceId}/${randomUUID()}.${extension}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: storageKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    // 5. Persistir metadados na base de dados
    const mediaEntity = MediaBuilder.create()
      .withOccurrenceId(occurrenceId)
      .withStorageKey(storageKey)
      .withMimeType(file.mimetype)
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
