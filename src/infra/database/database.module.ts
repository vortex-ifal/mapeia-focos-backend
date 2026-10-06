import { Global, Module } from '@nestjs/common';
import { databaseProvider } from './database.provider';
import { DRIZZLE_PROVIDER } from './database.constants';

@Global()
@Module({
    providers: [databaseProvider],
    exports: [DRIZZLE_PROVIDER],
})
export class DatabaseModule { } 