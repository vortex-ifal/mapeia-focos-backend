import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { STORAGE_PROVIDER } from './storage.constants';

export const storageProvider = {
  provide: STORAGE_PROVIDER,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): S3Client => {
    const accountId = configService.getOrThrow<string>('R2_ACCOUNT_ID');
    const accessKeyId = configService.getOrThrow<string>('R2_ACCESS_KEY_ID');
    const secretAccessKey = configService.getOrThrow<string>(
      'R2_SECRET_ACCESS_KEY',
    );

    return new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  },
};
