import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Admin, AdminSchema } from '../databases/models/admin.schema';
import { HelperModule } from 'src/helpers/helper.module';
import { MailService } from 'src/helpers/mail.service';
import { MailModule } from 'src/helpers/mail.module';
import { UserModule } from 'src/user/user.module';
import { User, UserSchema } from 'src/databases/models/user.schema';
import { Journey, JourneySchema } from 'src/databases/models/journey.schema';
import { LinksManagement, LinksManagementSchema } from 'src/databases/models/links-management.schema';
import { FocusArea, FocusAreaSchema } from 'src/databases/models/focusarea.schema';
import { JourneyGuide, JourneyGuideSchema } from 'src/databases/models/journeyguide.schema';
import { MyThoughtsAndInspirations, MyThoughtsAndInspirationsSchema } from 'src/databases/models/mythoughtsandinspirations.schema';
import { InspiringMedia, InspiringMediaSchema } from 'src/databases/models/inspiringmedia.schema';
import { AbundanceArea, AbundanceAreaSchema } from 'src/databases/models/abundancearea.schema';
import { ActionArea, ActionAreaSchema } from 'src/databases/models/actionarea.schema';
import { Area, AreaSchema } from 'src/databases/models/area.schema';
import { QuoteManagement, QuoteManagementSchema } from 'src/databases/models/quote-management.schema';
import { JourneyInstruction, JourneyInstructionSchema } from 'src/databases/models/journeyInstruction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }, 
      { name: User.name, schema: UserSchema },
      { name: Journey.name, schema: JourneySchema },
      { name: LinksManagement.name, schema: LinksManagementSchema },
      { name: FocusArea.name, schema: FocusAreaSchema },
      { name: JourneyGuide.name, schema: JourneyGuideSchema },
      { name: MyThoughtsAndInspirations.name, schema: MyThoughtsAndInspirationsSchema },
      { name: InspiringMedia.name, schema: InspiringMediaSchema },
      { name: AbundanceArea.name, schema: AbundanceAreaSchema },
      { name: ActionArea.name, schema: ActionAreaSchema },
      { name: Area.name, schema: AreaSchema },
      { name: QuoteManagement.name, schema: QuoteManagementSchema },
      { name: JourneyInstruction.name, schema: JourneyInstructionSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    HelperModule,
    MailModule,
    UserModule
  ],
  providers: [AdminService, MailService],
  controllers: [AdminController],
})
export class AdminModule {}
