import { Global, Module } from '@nestjs/common';
import { STORAGE_PROVIDER } from './storage.constants';
import { storageProvider } from './storage.provider';

@Global()
@Module({
  providers: [storageProvider],
  exports: [STORAGE_PROVIDER],
})
export class StorageModule {}
