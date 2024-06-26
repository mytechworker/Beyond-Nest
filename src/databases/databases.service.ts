import { Injectable } from '@nestjs/common';
import { MongooseOptionsFactory, MongooseModuleOptions } from '@nestjs/mongoose';

@Injectable()
export class DatabaseService implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: process.env.MONGODB_URI,
    };
  }
}
