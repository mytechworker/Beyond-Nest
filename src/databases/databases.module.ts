import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './databases.service';

@Module({
  imports: [
    ConfigModule.forRoot(), // Import ConfigModule if you're using environment variables
    MongooseModule.forRootAsync({
      useClass: DatabaseService, // Use DatabaseService to configure the MongoDB connection
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabasesModule {}