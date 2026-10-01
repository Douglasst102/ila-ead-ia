import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { HttpApiModule } from './http-api/http-api.module';

@Module({
  imports: [DatabaseModule, HttpApiModule],
})
export class AppModule {}
