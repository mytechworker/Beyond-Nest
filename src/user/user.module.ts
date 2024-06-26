import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './user.controller';
import { User, UserSchema } from '../databases/models/user.schema';
import { UserService } from './user.service';
import { HelperModule } from 'src/helpers/helper.module';
import { MailModule } from 'src/helpers/mail.module';
import { MailService } from '@sendgrid/mail';
import { Journey, JourneySchema } from 'src/databases/models/journey.schema';
import { FocusArea, FocusAreaSchema } from 'src/databases/models/focusarea.schema';
import { JourneyGuide, JourneyGuideSchema } from 'src/databases/models/journeyguide.schema';
import { MyThoughtsAndInspirations, MyThoughtsAndInspirationsSchema } from 'src/databases/models/mythoughtsandinspirations.schema';
import { InspiringMedia, InspiringMediaSchema } from 'src/databases/models/inspiringmedia.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, 
      { name: Journey.name, schema: JourneySchema }, 
      { name: FocusArea.name, schema: FocusAreaSchema },
      { name: JourneyGuide.name, schema: JourneyGuideSchema },
      { name: MyThoughtsAndInspirations.name, schema: MyThoughtsAndInspirationsSchema },
      { name: InspiringMedia.name, schema: InspiringMediaSchema }]),
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
    HelperModule,
    MailModule,
  ],
  providers: [UserService, MailService],
  controllers: [UsersController],
  exports: [UserService],
})
export class UserModule {}
