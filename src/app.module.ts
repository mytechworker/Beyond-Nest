// app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MiddlewaresModule } from './middlewares/middlewares.module';
import { AdminModule } from './admin/admin.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { DatabasesModule } from './databases/databases.module';
import { UserModule } from './user/user.module';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JourneyModule } from './journey/journey.module';
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UserModule, 
    AdminModule, 
    MiddlewaresModule, 
    DatabasesModule,
    PassportModule.register({ defaultStrategy: 'jwt' }), // Register Passport with default JWT strategy
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }), 
    JourneyModule,
  ],
  controllers: [AppController],
  providers: [AppService,JwtStrategy],
})
export class AppModule {
  constructor() {
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
  }
}
