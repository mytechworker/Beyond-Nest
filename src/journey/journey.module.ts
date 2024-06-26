import { Module } from '@nestjs/common';
import { JourneyService } from './journey.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from 'src/databases/models/admin.schema';
import { Journey, JourneySchema } from 'src/databases/models/journey.schema';
import { JwtModule } from '@nestjs/jwt';
import { HelperModule } from 'src/helpers/helper.module';
import { MailModule } from 'src/helpers/mail.module';
import { UserModule } from 'src/user/user.module';
import { MailService } from 'src/helpers/mail.service';
import { JourneyController } from './journey.controller';
import { MyThoughtsAndInspirations, MyThoughtsAndInspirationsSchema } from 'src/databases/models/mythoughtsandinspirations.schema';
import { SmartActionCompletedStatus, SmartActionCompletedStatusSchema } from 'src/databases/models/smart-action-completed-status.rename';
import { SmartActionLog, SmartActionLogSchema } from 'src/databases/models/smart-action-log.schema';
import { SmartAction, SmartActionSchema } from 'src/databases/models/smart-action.schema'; // Corrected import
import { SmartActionRecurring, SmartActionRecurringSchema } from 'src/databases/models/smart-action-recurring.schema';
import { ActionTrackProgress, ActionTrackProgressSchema } from 'src/databases/models/action-track-progress.schema';
import { DiscoveryGoal, DiscoveryGoalSchema } from 'src/databases/models/discovery-goal.schema';
import { HabitActionType, HabitActionTypeSchema } from 'src/databases/models/habit-action-type.schema';
import { TargetActionType, TargetActionTypeSchema } from 'src/databases/models/target-action-type.schema';
import { InspiringMedia, InspiringMediaSchema } from 'src/databases/models/inspiringmedia.schema';
import { Links, LinksSchema } from 'src/databases/models/links.schema';
import { User, UserSchema } from 'src/databases/models/user.schema';
import { AbundanceArea, AbundanceAreaSchema } from 'src/databases/models/abundancearea.schema';
import { FocusArea, FocusAreaSchema } from 'src/databases/models/focusarea.schema';
import { ActionArea, ActionAreaSchema } from 'src/databases/models/actionarea.schema';
import { JourneyGuide, JourneyGuideSchema } from 'src/databases/models/journeyguide.schema';
import { Area, AreaSchema } from 'src/databases/models/area.schema';
import { QuoteManagement, QuoteManagementSchema } from 'src/databases/models/quote-management.schema';
import { VisionVideo, VisionVideoSchema } from 'src/databases/models/vision-video.schema';
import { ActionType, ActionTypeSchema } from 'src/databases/models/action-type.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Journey.name, schema: JourneySchema },
      { name: MyThoughtsAndInspirations.name, schema: MyThoughtsAndInspirationsSchema },
      { name: SmartActionCompletedStatus.name, schema: SmartActionCompletedStatusSchema },
      { name: SmartActionLog.name, schema: SmartActionLogSchema },
      { name: SmartAction.name, schema: SmartActionSchema },
      { name: SmartActionRecurring.name, schema: SmartActionRecurringSchema },
      { name: ActionTrackProgress.name, schema: ActionTrackProgressSchema },
      { name: DiscoveryGoal.name, schema: DiscoveryGoalSchema },
      { name: HabitActionType.name, schema: HabitActionTypeSchema },
      { name: TargetActionType.name, schema: TargetActionTypeSchema },
      { name: InspiringMedia.name, schema: InspiringMediaSchema },
      { name: Links.name, schema: LinksSchema },
      { name: User.name, schema: UserSchema },
      { name: AbundanceArea.name, schema: AbundanceAreaSchema },
      { name: FocusArea.name, schema: FocusAreaSchema },
      { name: ActionArea.name, schema: ActionAreaSchema },
      { name: JourneyGuide.name, schema: JourneyGuideSchema },
      { name: Area.name, schema: AreaSchema },
      { name: QuoteManagement.name, schema: QuoteManagementSchema },
      { name: VisionVideo.name, schema: VisionVideoSchema },
      { name: ActionType.name, schema: ActionTypeSchema }

    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    HelperModule,
    MailModule,
    UserModule
  ],
  providers: [JourneyService, MailService],
  controllers: [JourneyController],
})
export class JourneyModule {}