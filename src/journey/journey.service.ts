import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types, } from 'mongoose';
import { HelperService } from '../helpers/helper.service';
import { Journey, JourneyDocument } from 'src/databases/models/journey.schema';
import { MyThoughtsAndInspirations, MyThoughtsAndInspirationsDocument } from 'src/databases/models/mythoughtsandinspirations.schema';
import { User, UserDocument } from 'src/databases/models/user.schema';
import { SmartAction, SmartActionDocument } from 'src/databases/models/smart-action.schema';
import { SmartActionLog, SmartActionLogDocument } from 'src/databases/models/smart-action-log.schema';
import { SmartActionCompletedStatus, SmartActionCompletedStatusDocument } from 'src/databases/models/smart-action-completed-status.rename';
import { GetActionLogDto } from './dto/get-action-log.dto';
import { request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ActionListDto } from './dto/action-list.dto';
import { ObjectId } from 'mongoose';
import { SmartActionRecurring, SmartActionRecurringDocument } from 'src/databases/models/smart-action-recurring.schema';
import { ActionTrackProgress, ActionTrackProgressDocument } from 'src/databases/models/action-track-progress.schema';
import { DiscoveryGoal, DiscoveryGoalDocument } from 'src/databases/models/discovery-goal.schema';
import { ActionSearchDto } from './dto/action-search.dto';
import { HabitActionType, HabitActionTypeDocument } from 'src/databases/models/habit-action-type.schema';
import { TargetActionType, TargetActionTypeDocument } from 'src/databases/models/target-action-type.schema';
import { SmartActionDTO } from './dto/smart-action.dto';
import { GetProjectIdsAndStandaloneIdsDto } from './dto/project-ids-standalone.dto';
import { ProjectIdsDto } from './dto/project-ids.dto';
import { NewArtefactDto } from './dto/new-artefact.dto';
import { InspiringMedia, InspiringMediaDocument } from 'src/databases/models/inspiringmedia.schema';
import { Links, LinksDocument } from 'src/databases/models/links.schema';
import { TypeEnum } from 'src/type.enum';
import { NewMediaDto } from './dto/new-media.dto';
import { ShareArtefactDto } from './dto/share-artefact.dto';
import { ShareResponseDto } from './dto/share-response.dto';
import { AbundanceArea, AbundanceAreaDocument } from 'src/databases/models/abundancearea.schema';
import { FocusArea, FocusAreaDocument } from 'src/databases/models/focusarea.schema';
import { ActionArea, ActionAreaDocument } from 'src/databases/models/actionarea.schema';
import { AbundanceAreaDto } from 'src/admin/dto/abundance-area.dto';
import { FocusAreaDto } from 'src/admin/dto/focus-area.dto';
import { ActionAreaDto } from 'src/admin/dto/action-area.dto';
import { BaseAreaDto } from 'src/admin/dto/base-area.dto';
import { FocusAreaListDto } from './dto/focus-area-list.dto';
import { ActionAreaListDto } from './dto/action-area-list.dto';
import { AddJourneyDto } from 'src/admin/dto/add-journey.dto';
import { JourneyGuide, JourneyGuideDocument } from 'src/databases/models/journeyguide.schema';
import { EditJourneyDto } from './dto/edit-journey.dto';
import { GetJourneyListingDto } from './dto/get-journey-listing.dto';
import { AddStickyNotesDto } from './dto/add-sticky-notes.dto';
import { UpdateStickyNotesDto } from './dto/update-sticky-notes.dto';
import { DeleteStickyNotesDto } from './dto/delete-sticky-notes.dto';
import { GetStickyNotesDetailsDto } from './dto/get-sticky-notes-details.dto';
import { GetStickyNotesListingDto } from './dto/get-sticky-notes-listing.dto';
import { GetTagListingQueryDto } from './dto/get-tag-listing-query.dto';
import { TagListingDto } from './dto/get-tag-list.dto';
import { AddJourneyGuideDto } from './dto/add-journey-guide.dto';
import { GetJourneyGuideListingDto } from './dto/get-journey-guide-listing.dto';
import { TagListingResponseDto } from './dto/tag-listing-response.dto';
import { InspirationStageListDto } from './dto/inspiration-stage-list.dto';
import { AddInspiringMediaDto } from './dto/add-inspiring-media.dto';
import { UpdateInspiringMediaDto } from './dto/update-inspiring-media.dto';
import { DeleteInspiringMediaDto } from './dto/delete-inspiring-media.dto';
import { GetInspiringMediaDetailsDto } from './dto/get-inspiring-media-details.dto';
import { GetInspiringMediaListingDto } from './dto/get-inspiring-media-listing.dto';
import { Area, AreaDocument } from 'src/databases/models/area.schema';
import { QuoteManagement, QuoteManagementDocument } from 'src/databases/models/quote-management.schema';
import { AddLinkDto } from './dto/add-links.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { DeleteLinkDto } from './dto/delete-link.dto';
import { GetLinkDto } from './dto/get-link.dto';
import { GetLinkListingDto } from './dto/get-link-listing.dto';
import { AddDiscoveryGoalDto } from './dto/add-discovery-goal.dto';
import { UpdateDiscoveryGoalDto } from './dto/update-discovery-goal.dto';
import { DiscoveryGoalListingResponseDto, GetDiscoveryGoalListingDto } from './dto/goal.listing.dto';
import { AddVisionVideoDto } from './dto/add-vision-video.dto';
import { VisionVideo, VisionVideoDocument } from 'src/databases/models/vision-video.schema';
import { UpdateVisionVideoDto } from './dto/update-vision-video.dto';
import { GetVisionVideoListingDto } from './dto/get-vision-video-listing.dto';
import { ActionType, ActionTypeDocument } from 'src/databases/models/action-type.schema';
import { GetActionTypeListingResponseDto } from './dto/get-action-type-list.dto';
import { UpdateActionTypeDto } from './dto/update-action-type.schema.dto';
import { UpdateSmartActionCheckListStatusDto } from './dto/smartaction.dto';
import { UpdateSmartActionDto } from './dto/update-smart-action.dto';
import { DeleteSmartActionDto } from './dto/delete-smart-action.dto';


@Injectable()
export class JourneyService {
  constructor(
    @InjectModel(MyThoughtsAndInspirations.name) private readonly myThoughtsAndInspirationsModel: Model<MyThoughtsAndInspirationsDocument>,
    @InjectModel(Journey.name) private readonly journeyModel: Model<JourneyDocument>,
    @InjectModel(SmartAction.name) private smartActionModel: Model<SmartActionDocument>,
    @InjectModel(SmartActionLog.name) private smartActionLogModel: Model<SmartActionLogDocument>,
    @InjectModel(SmartActionCompletedStatus.name) private smartActionCompletedStatusModel: Model<SmartActionCompletedStatusDocument>,
    @InjectModel(SmartActionRecurring.name) private readonly smartActionRecurringModel: Model<SmartActionRecurringDocument>,
    @InjectModel(ActionTrackProgress.name) private readonly actionTrackProgressModel: Model<ActionTrackProgressDocument>,
    @InjectModel(DiscoveryGoal.name) private readonly discoveryGoalModel: Model<DiscoveryGoalDocument>,
    @InjectModel(HabitActionType.name) private readonly habitActionTypeModel: Model<HabitActionTypeDocument>,
    @InjectModel(TargetActionType.name) private readonly targetActionTypeModel: Model<TargetActionTypeDocument>,
    @InjectModel(InspiringMedia.name) private readonly inspiringMediaModel: Model<InspiringMediaDocument>,
    @InjectModel(Links.name) private readonly linksModel: Model<LinksDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(AbundanceArea.name) private abundanceAreaModel: Model<AbundanceAreaDocument>,
    @InjectModel(FocusArea.name) private focusAreaModel: Model<FocusAreaDocument>,
    @InjectModel(ActionArea.name) private actionAreaModel: Model<ActionAreaDocument>,
    @InjectModel(JourneyGuide.name) private readonly journeyGuideModel: Model<JourneyGuideDocument>,
    @InjectModel(Area.name) private readonly areaModel: Model<AreaDocument>,
    @InjectModel(QuoteManagement.name) private readonly quoteManagementModel: Model<QuoteManagementDocument>,
    @InjectModel(VisionVideo.name) private readonly visionVideoModel: Model<VisionVideoDocument>,
    @InjectModel(ActionType.name) private readonly actionTypeModel: Model<ActionTypeDocument>,
    private readonly helperService: HelperService,
    private jwtService: JwtService,
  ) { }

  async getAllJournalEntries(
    user: UserDocument,
    startDate?: Date,
    endDate?: Date,
    tags?: string[],
    title?: string,
  ): Promise<{ message: string; success: boolean; data: { globalJournalEntries: any[]; OtherJournalEntries: any[] } }> {
    const locals = this.helperService.getLocaleMessages();
    try {
      let condition: any = {
        userId: user._id,
        type: "journalEntries",
        stageType: "global",
        deleted: false
      };

      if (startDate && endDate) {
        condition.filterDate = {
          $gte: startDate,
          $lte: endDate,
        };
      }

      if (tags && tags.length > 0) {
        condition.tags = { $in: tags };
      }

      if (title) {
        const conditionTitle = {
          $or: [
            { title: { $regex: title, $options: "i" } },
            { description: { $regex: title, $options: "i" } },
          ],
        };
        condition = { ...condition, ...conditionTitle };
      }

      const globalJournalEntries = await this.myThoughtsAndInspirationsModel.find(condition).exec();
      const journeys = await this.journeyModel.find({ userId: user._id, deleted: false }).exec();

      const OtherJournalEntries = [];
      for (const journey of journeys) {
        const journeyCondition: any = {
          stageType: { $ne: "global" },
          journeyId: journey._id,
        };
        if (startDate && endDate) {
          journeyCondition.filterDate = {
            $gte: startDate,
            $lte: endDate,
          };
        }
        if (tags && tags.length > 0) {
          journeyCondition.tags = { $in: tags };
        }
        if (title) {
          journeyCondition.$or = [
            { title: { $regex: title, $options: "i" } },
            { description: { $regex: title, $options: "i" } },
          ];
        }

        const journeyEntries = await this.myThoughtsAndInspirationsModel.find(journeyCondition).exec();
        if (journeyEntries.length > 0) {
          OtherJournalEntries.push({ journeyName: journey.name, journalEntries: journeyEntries });
        }
      }

      return {
        message: locals.journal_entries_listing,
        success: true,
        data: { globalJournalEntries, OtherJournalEntries }
      };
    } catch (err) {
      throw new BadRequestException(locals.something_went_wrong);
    }
  }


  async addActionLog(reqBody: any): Promise<{ message: string; success: boolean; data: any }> {
    const locals = this.helperService.getLocaleMessages();
    try {
      const { smartActionId, currentLogUnit, description, logDate, status } = reqBody;

      // Validate required fields
      if (![smartActionId, currentLogUnit, logDate].every(Boolean)) {
        return { message: locals.enter_all_field, success: false, data: null };
      }

      // Find the corresponding smart action record
      const record = await this.smartActionModel.findOne({ _id: smartActionId, deleted: false });

      if (!record) {
        return { message: locals.enter_valid_Id, success: false, data: null };
      }

      // Assign target type from record to reqBody
      reqBody.targetType = record.targetUnit;

      // Create a new smart action log
      await this.smartActionLogModel.create(reqBody);

      // Update current log total for the smart action
      let sum = record.currentLogTotal + currentLogUnit;
      await this.smartActionModel.updateOne({ _id: smartActionId }, { $set: { currentLogTotal: sum, updatedDate: new Date() } });

      // If status is 'completed' and action type is 'habit', create a completed status record
      if (status === 'completed' && record.actionType === 'habit') {
        reqBody.userId = record.userId; // Assuming userId is available in the record
        await this.smartActionCompletedStatusModel.create(reqBody);
      } else if (status === 'completed') {
        // Otherwise, update the status of the smart action
        await this.smartActionModel.updateOne({ _id: smartActionId }, { $set: { status, updatedDate: new Date() } });
      }

      return { message: locals.log_created, success: true, data: null };
    } catch (err) {
      console.error('Error in addActionLog:', err);
      return { message: locals.something_went_wrong, success: false, data: null };
    }
  }

  async getActionLog(req: Request, smartActionId: string) {
    const locals = this.helperService.getLocaleMessages();

    try {
      const userData: UserDocument = await this.helperService.validateUser(req);

      if (!smartActionId) {
        return {
          message: locals.enter_all_field,
          success: false,
          data: null,
        };
      }

      const record = await this.smartActionModel.findOne({ _id: smartActionId, userId: userData._id, deleted: false });
      if (!record) {
        throw new NotFoundException(locals.enter_valid_Id);
      }

      const data = await this.smartActionLogModel
        .find({ smartActionId })
        .populate('smartActionId', [
          'status', 'targetTimeType', 'targetValue', 'targetUnitType', 'targetUnit',
          'targetTimeStatus', 'targetUnitDisplayName',
        ])
        .select(['smartActionId', 'targetType', 'currentLogUnit', 'createdDate', 'description', 'logDate'])
        .sort({ createdDate: -1 });

      return {
        message: locals.log_fetch,
        success: true,
        data: data,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException(locals.something_went_wrong);
      }
    }
  }


  async actionListWithSearchAccordingAction(dto: ActionListDto, userData: UserDocument): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    try {
      const {
        date, journeyId, actionType, tags, discoveryGoalId, status
      } = dto;

      let condition: any = {
        userId: userData._id,
        deleted: false
      };

      if (tags) condition.tags = { $in: tags };
      if (actionType) condition.actionType = { $in: actionType };
      if (discoveryGoalId) condition.discoveryGoalId = { $in: discoveryGoalId.map(element => new mongoose.Types.ObjectId(element)) };
      if (journeyId) condition.journeyId = { $in: journeyId.map(element => new mongoose.Types.ObjectId(element)) };
      if (status) condition.status = { $in: status };

      let data2: any[] = [];
      let startDate = date ? new Date(date) : new Date();
      let total = 30;

      if (date) total = 1;

      const populateFields = [
        'actionTypeId',
        { path: 'journeyId', select: 'name' },
        'recurringId',
        'habitId',
        'targetId',
        'trackProgressId',
        { path: 'discoveryGoalId', select: 'title' }
      ];

      for (let i = 0; i < total; i++) {
        if (i === 0) { startDate.setDate(startDate.getDate() + 0); }
        else startDate.setDate(startDate.getDate() + 1);

        const newDate = new Date(startDate.toISOString().split("T")[0] + "T00:00:00.000Z");
        condition.startDate = date ? { $lte: new Date(date) } : { $lte: new Date(newDate) };

        let smartActionRecordByDate = await this.smartActionModel
          .find(condition)
          .populate(populateFields)
          .sort({ status: -1 });

        let data: any[] = [];

        for (let index = 0; index < smartActionRecordByDate.length; index++) {
          let status = smartActionRecordByDate[index].status;
          let smartActionStatusUpdateDate = await this.smartActionCompletedStatusModel.findOne({
            userId: userData._id,
            statusUpdateDate: newDate,
            smartActionId: smartActionRecordByDate[index]._id
          });

          if (smartActionStatusUpdateDate) status = "completed";

          let record = {
            name: smartActionRecordByDate[index].name,
            userId: smartActionRecordByDate[index].userId,
            logType: smartActionRecordByDate[index].logType,
            discoveryGoalId: smartActionRecordByDate[index].discoveryGoalId,
            journeyId: smartActionRecordByDate[index].journeyId,
            description: smartActionRecordByDate[index].description,
            tags: smartActionRecordByDate[index].tags,
            status: status,
            targetUnit: smartActionRecordByDate[index].targetUnit,
            targetValue: smartActionRecordByDate[index].targetValue,
            startDate: smartActionRecordByDate[index].startDate,
            goalDate: smartActionRecordByDate[index].goalDate,
            actionType: smartActionRecordByDate[index].actionType,
            habitId: smartActionRecordByDate[index].habitId,
            targetId: smartActionRecordByDate[index].targetId,
            recurringId: smartActionRecordByDate[index].recurringId,
            trackProgressId: smartActionRecordByDate[index].trackProgressId,
            currentLogTotal: smartActionRecordByDate[index].currentLogTotal,
            createdDate: smartActionRecordByDate[index].createdDate,
            deleted: smartActionRecordByDate[index].deleted,
            deletedAt: smartActionRecordByDate[index].deletedAt,
            _id: smartActionRecordByDate[index]._id,
            checkList: smartActionRecordByDate[index].checkList,
            actionTypeId: smartActionRecordByDate[index].actionTypeId,
            updatedDate: smartActionRecordByDate[index].updatedDate,
            __v: 0
          };

          if (smartActionRecordByDate[index].actionType === "habit") {
            let smartActionData = await this.smartActionRecurringModel.findOne({ smartActionId: smartActionRecordByDate[index]._id, deleted: false });

            if (smartActionData) {
              if (smartActionRecordByDate[index].completedDate === null ||
                smartActionRecordByDate[index].completedDate.toLocaleDateString("en-CA") === newDate.toLocaleDateString("en-CA")) {
                let response = await this.checkRecurring(smartActionData, newDate);

                if (response) {
                  data.push(record);
                }
              }
            }
          } else if (smartActionRecordByDate[index].actionType === "target") {
            if (smartActionRecordByDate[index].startDate.toLocaleDateString("en-CA") === newDate.toLocaleDateString("en-CA") ||
              smartActionRecordByDate[index].goalDate.toLocaleDateString("en-CA") === newDate.toLocaleDateString("en-CA")) {
              data.push(record);
            }
          } else if (smartActionRecordByDate[index].actionType === "standalone") {
            if (smartActionRecordByDate[index].startDate.toLocaleDateString("en-CA") === newDate.toLocaleDateString("en-CA")) {
              data.push(record);
            }
          }
        }

        if (data.length > 0) {
          data2.push({ date: newDate, data: data });
        }
      }

      return {
        message: locals.record_fetch,
        success: true,
        data: data2
      };
    } catch (err) {
      console.error('Error fetching records:', err);
      throw new InternalServerErrorException(locals.something_went_wrong);
    }
  }

  async checkRecurring(actionRecurringData: any, newDate: Date): Promise<any> {
    let data;

    if (actionRecurringData.recurringType === "daily") {
      data = actionRecurringData;
    } else if (actionRecurringData.recurringType === "weekly" || actionRecurringData.recurringType === "everyWeekday") {
      const dayOfWeek = newDate.getDay();
      const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
      const dayName = daysOfWeek[dayOfWeek];

      if (actionRecurringData.everyDay.includes(dayName)) {
        data = actionRecurringData;
      }

      if (actionRecurringData.weeklyDay.includes(dayName)) {
        data = actionRecurringData;
      }
    } else if (actionRecurringData.recurringType === "monthly") {
      if (actionRecurringData.monthlyType === "onDay" && actionRecurringData.monthlyDay === newDate.getDate()) {
        data = actionRecurringData;
      } else if (actionRecurringData.monthlyType === "onThe" && actionRecurringData.monthlyNumber === Math.ceil(newDate.getDate() / 7) && actionRecurringData.monthlyDay === newDate.getDay()) {
        data = actionRecurringData;
      }
    }

    return data;
  }


  async actionListWithSearchAccordingActionNew(req: Request, actionListDto: ActionListDto) {
    const locals = this.helperService.getLocaleMessages();

    try {
      const userData = await this.helperService.validateUser(req);

      let condition: any = {
        userId: userData._id,
        deleted: false,
      };

      const { date, journeyId, actionType, tags, discoveryGoalId, status, direction } = actionListDto;

      if (tags) condition.tags = { $in: tags };
      if (actionType) condition.actionType = { $in: actionType };
      if (discoveryGoalId) condition.discoveryGoalId = { $in: discoveryGoalId.map(element => new mongoose.Types.ObjectId(element)) };
      if (journeyId) condition.journeyId = { $in: journeyId.map(element => new mongoose.Types.ObjectId(element)) };

      if (status) condition.status = { $in: status };
      const typedReq = req as Request & { query: { page?: string, limit?: string } };
      const page = parseInt(typedReq.query.page, 10) || 1;
      const limit = parseInt(typedReq.query.limit, 10) || 10;
      const offset = (page - 1) * limit;

      const populateFields = [
        'actionTypeId',
        { path: 'journeyId', select: 'name' },
        'recurringId',
        'habitId',
        'targetId',
        'trackProgressId',
        { path: 'discoveryGoalId', select: 'title' },
      ];

      let data2: any[] = [];

      let startDate = date ? new Date(date) : new Date();
      let totalDays = direction ? (direction === 'down' ? 30 : -30) : 0;

      if (!date) {
        totalDays = 30;
      } else {
        totalDays = direction ? Math.abs(totalDays) : 1;
      }

      for (let i = 0; i < totalDays; i++) {
        if (i !== 0) {
          if (direction === 'down') {
            startDate.setDate(startDate.getDate() + 1);
          } else if (direction === 'up') {
            startDate.setDate(startDate.getDate() - 1);
          } else {
            startDate.setDate(startDate.getDate() + 1);
          }
        }

        const newDate = new Date(startDate.toISOString().split("T")[0] + "T00:00:00.000Z");
        condition.startDate = date ? { $lte: new Date(date) } : { $lte: new Date(newDate) };

        let smartActionRecordByDate = await this.smartActionModel
          .find(condition)
          .populate(populateFields)
          .sort({ status: -1 });

        let data: any[] = [];

        for (let index = 0; index < smartActionRecordByDate.length; index++) {
          let status = smartActionRecordByDate[index].status;

          let smartActionStatusUpdateDate = await this.smartActionCompletedStatusModel.findOne({
            userId: userData._id,
            smartActionId: smartActionRecordByDate[index]._id,
          });

          if (smartActionStatusUpdateDate) status = 'completed';

          let record = {
            name: smartActionRecordByDate[index].name,
            userId: smartActionRecordByDate[index].userId,
            logType: smartActionRecordByDate[index].logType,
            discoveryGoalId: smartActionRecordByDate[index].discoveryGoalId,
            journeyId: smartActionRecordByDate[index].journeyId,
            description: smartActionRecordByDate[index].description,
            tags: smartActionRecordByDate[index].tags,
            status: status,
            targetUnit: smartActionRecordByDate[index].targetUnit,
            targetValue: smartActionRecordByDate[index].targetValue,
            startDate: smartActionRecordByDate[index].startDate,
            goalDate: smartActionRecordByDate[index].goalDate,
            actionType: smartActionRecordByDate[index].actionType,
            habitId: smartActionRecordByDate[index].habitId,
            targetId: smartActionRecordByDate[index].targetId,
            recurringId: smartActionRecordByDate[index].recurringId,
            trackProgressId: smartActionRecordByDate[index].trackProgressId,
            currentLogTotal: smartActionRecordByDate[index].currentLogTotal,
            createdDate: smartActionRecordByDate[index].createdDate,
            deleted: smartActionRecordByDate[index].deleted,
            deletedAt: smartActionRecordByDate[index].deletedAt,
            _id: smartActionRecordByDate[index]._id,
            checkList: smartActionRecordByDate[index].checkList,
            actionTypeId: smartActionRecordByDate[index].actionTypeId,
            updatedDate: smartActionRecordByDate[index].updatedDate,
          };

          if (smartActionRecordByDate[index].actionType === 'habit') {
            let smartActionData = await this.actionTrackProgressModel.findOne({ _id: smartActionRecordByDate[index].trackProgressId, deleted: false });
            let SmartActionRecurringType = await this.smartActionRecurringModel.findOne({ _id: smartActionRecordByDate[index].recurringId, deleted: false });

            if (
              smartActionRecordByDate[index].completedDate === null ||
              smartActionRecordByDate[index].completedDate.toLocaleDateString('en-CA') === newDate.toLocaleDateString('en-CA')
            ) {
              let recordDate = smartActionRecordByDate[index].startDate;
              let response = await this.checkTrackProgress(smartActionData, newDate, recordDate, SmartActionRecurringType);
              if (response) data.push(record);
            }
          } else if (smartActionRecordByDate[index].actionType === 'target') {
            let trackProgressData = await this.actionTrackProgressModel.findOne({
              _id: smartActionRecordByDate[index].trackProgressId,
              deleted: false,
            });

            let smartActionData = smartActionRecordByDate[index];
            const goalDate = new Date(smartActionData.goalDate);

            let response = await this.targetListingAccordingTrackProgress(trackProgressData, newDate);
            if (response) data.push(record);
          } else if (smartActionRecordByDate[index].actionType === 'standalone') {
            if (smartActionRecordByDate[index].startDate.toLocaleDateString('en-CA') === newDate.toLocaleDateString('en-CA')) {
              data.push(record);
            }
          }
        }

        if (data.length > 0) data2.push({ date: newDate, data: data });
      }

      const paginatedData = data2.slice(offset, offset + limit);

      return {
        message: locals.record_fetch,
        success: true,
        page: page,
        limit: limit,
        totalItems: data2.length,
        totalPages: Math.ceil(data2.length / limit),
        data: paginatedData,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(locals.something_went_wrong);
    }
  }

  async checkTrackProgress(actionRecurringData, newDate, recordDate, actionType): Promise<ActionTrackProgressDocument> {
    let data: ActionTrackProgressDocument | null = null;

    if (actionRecurringData.trackProgressType === 'daily') {
      if (actionType.recurringType === 'daily') {
        if (recordDate.toLocaleDateString('en-CA') === newDate.toLocaleDateString('en-CA')) {
          data = actionRecurringData;
        }
      } else if (actionType.recurringType === 'weekly') {
        const recordDateCopy = new Date(recordDate);
        recordDateCopy.setDate(recordDateCopy.getDate() + 7);
        const plusDate = new Date(`${recordDateCopy.toISOString().split('T')[0]}T00:00:00.000Z`);
        if (recordDate < newDate) {
          if (plusDate > newDate) {
            data = actionRecurringData;
          }
        } else {
          if (plusDate > newDate) {
            data = actionRecurringData;
          }
        }
      } else if (actionType.recurringType === 'monthly') {
        if (actionType.monthlyType === 'onDay') {
          recordDate.setMonth(recordDate.getMonth() + 1);
          const plusDate = new Date(`${recordDate.toISOString().split('T')[0]}T00:00:00.000Z`);
          if (plusDate.toLocaleDateString('en-CA') > newDate.toLocaleDateString('en-CA')) {
            data = actionRecurringData;
          }
        } else {
          const recordDateCopy = new Date(recordDate);
          recordDateCopy.setMonth(recordDateCopy.getMonth() + 1);
          const date = this.getOccurrenceOfDayInMonth(recordDateCopy, actionType);
          const plusDate = new Date(`${date.toISOString().split('T')[0]}T00:00:00.000Z`);
          if (plusDate > newDate) {
            data = actionRecurringData;
          }
        }
      } else if (actionType.recurringType === 'annual') {
        recordDate.setFullYear(recordDate.getFullYear() + 1);
        data = actionRecurringData;
      }
    } else if (actionRecurringData.trackProgressType === 'weekly') {
      const dayOfWeek = newDate.getDay();
      const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayName = daysOfWeek[dayOfWeek];
      if (actionType.recurringType === 'weekly') {
        const recordDateCopy = new Date(recordDate);
        recordDateCopy.setDate(recordDateCopy.getDate() + 7);
        const plusDate = new Date(`${recordDateCopy.toISOString().split('T')[0]}T00:00:00.000Z`);
        if (recordDate < newDate) {
          if (plusDate > newDate) {
            if (actionRecurringData.weeklyDay.includes(dayName)) {
              data = actionRecurringData;
            }
          }
        } else {
          if (plusDate > newDate) {
            if (actionRecurringData.weeklyDay.includes(dayName)) {
              data = actionRecurringData;
            }
          }
        }
      } else if (actionType.recurringType === 'monthly') {
        if (actionType.monthlyType === 'onDay') {
          recordDate.setMonth(recordDate.getMonth() + 1);
          const plusDate = new Date(`${recordDate.toISOString().split('T')[0]}T00:00:00.000Z`);
          if (plusDate.toLocaleDateString('en-CA') > newDate.toLocaleDateString('en-CA')) {
            if (actionRecurringData.weeklyDay.includes(dayName)) {
              data = actionRecurringData;
            }
          }
        } else {
          const recordDateCopy = new Date(recordDate);
          recordDateCopy.setMonth(recordDateCopy.getMonth() + 1);
          const date = this.getOccurrenceOfDayInMonth(recordDateCopy, actionType);
          const plusDate = new Date(`${date.toISOString().split('T')[0]}T00:00:00.000Z`);
          if (plusDate > newDate) {
            if (actionRecurringData.weeklyDay.includes(dayName)) {
              data = actionRecurringData;
            }
          }
        }
      } else if (actionType.recurringType === 'annual') {
        recordDate.setFullYear(recordDate.getFullYear() + 1);
        if (actionRecurringData.weeklyDay.includes(dayName)) {
          data = actionRecurringData;
        }
      }
    } else if (actionRecurringData.trackProgressType === 'monthly') {
      if (actionType.recurringType === 'monthly') {
        if (actionType.monthlyType === 'onDay') {
          if (actionRecurringData.monthlyType === 'onDay') {
            recordDate.setMonth(recordDate.getMonth() + 1);
            const plusDate = new Date(`${recordDate.toISOString().split('T')[0]}T00:00:00.000Z`);
            if (plusDate.toLocaleDateString('en-CA') > newDate.toLocaleDateString('en-CA')) {
              if (actionRecurringData.monthlyDay === newDate.getDate()) {
                data = actionRecurringData;
              }
            }
          } else {
            const recordDateCopy = new Date(recordDate);
            recordDateCopy.setDate(recordDateCopy.getDate() + 30);
            const plusDate = new Date(`${recordDateCopy.toISOString().split('T')[0]}T00:00:00.000Z`);
            const dayOfMonth = newDate.getDate();
            const instance = Math.floor((dayOfMonth - 1) / 7) + 1;
            const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
            const dayName = daysOfWeek[newDate.getDay()];
            if (plusDate > newDate) {
              if (actionRecurringData.monthlyDay === dayName && instance === actionRecurringData.monthlyType) {
                data = actionRecurringData;
              }
            }
          }
        } else {
          if (actionRecurringData.monthlyType === 'onDay') {
            const recordDateCopy = new Date(recordDate);
            recordDateCopy.setDate(recordDateCopy.getDate() + 30);
            const plusDate = new Date(`${recordDateCopy.toISOString().split('T')[0]}T00:00:00.000Z`);
            if (plusDate.toLocaleDateString('en-CA') > newDate.toLocaleDateString('en-CA')) {
              if (actionRecurringData.monthlyDay === newDate.getDate()) {
                data = actionRecurringData;
              }
            }
          } else {
            const recordDateCopy = new Date(recordDate);
            recordDateCopy.setMonth(recordDateCopy.getMonth() + 1);
            const date = this.getOccurrenceOfDayInMonth(recordDateCopy, actionType);
            const plusDate = new Date(`${date.toISOString().split('T')[0]}T00:00:00.000Z`);
            const dayOfMonth = newDate.getDate();
            const instance = Math.floor((dayOfMonth - 1) / 7) + 1;
            const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
            const dayName = daysOfWeek[newDate.getDay()];
            if (plusDate > newDate) {
              if (actionRecurringData.monthlyDay === dayName && instance === actionRecurringData.monthlyType) {
                data = actionRecurringData;
              }
            }
          }
        }
      } else if (actionType.recurringType === 'annual') {
        if (actionRecurringData.monthlyType === 'onDay') {
          recordDate.setFullYear(recordDate.getFullYear() + 1);
          if (actionRecurringData.monthlyDay === newDate.getDate()) {
            data = actionRecurringData;
          }
        } else {
          const recordDateCopy = new Date(recordDate);
          recordDateCopy.setDate(recordDateCopy.getDate() + 30);
          const plusDate = new Date(`${recordDateCopy.toISOString().split('T')[0]}T00:00:00.000Z`);
          if (plusDate.toLocaleDateString('en-CA') > newDate.toLocaleDateString('en-CA')) {
            if (actionRecurringData.monthlyDay === newDate.getDay()) {
              data = actionRecurringData;
            }
          }
        }
      }
    } else if (actionRecurringData.trackProgressType === 'annual') {
      if (actionType.recurringType === 'annual') {
        if (actionRecurringData.annualyDate.toLocaleDateString('en-CA') === newDate.toLocaleDateString('en-CA')) {
          data = actionRecurringData;
        }
      }
    }

    return data;
  }

  private getOccurrenceOfDayInMonth(recordDateCopy: Date, actionType): Date | null {
    const year = recordDateCopy.getFullYear();
    const month = recordDateCopy.getMonth() + 1;
    const occurrence = actionType.monthlyType;
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const targetDay = daysOfWeek.indexOf(actionType.monthlyDay);

    const date = new Date(year, month - 1, 1);
    const firstDayOfWeek = date.getDay();
    let offsetToTargetDay = (targetDay - firstDayOfWeek + 7) % 7;
    date.setDate(date.getDate() + offsetToTargetDay);
    date.setDate(date.getDate() + (occurrence - 1) * 7);

    if (date.getMonth() === month - 1) {
      return date;
    } else {
      return null;
    }
  }

  async targetListingAccordingTrackProgress(trackProgressData: ActionTrackProgressDocument, newDate: Date): Promise<ActionTrackProgressDocument | null> {
    let data: ActionTrackProgressDocument | null = null;

    if (trackProgressData.trackProgressType === 'daily') {
      data = trackProgressData;
    } else if (trackProgressData.trackProgressType === 'weekly') {
      const dayOfWeek = newDate.getDay();
      const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
      const dayName = daysOfWeek[dayOfWeek];
      if (trackProgressData.weeklyDay.includes(dayName)) {
        data = trackProgressData;
      }
    } else if (trackProgressData.trackProgressType === 'monthly') {
      if (trackProgressData.monthlyType === 'onDay' && parseInt(trackProgressData.monthlyDay) === newDate.getDate()) {
        data = trackProgressData;
      } else {
        const dayOfWeek = newDate.getDay();
        const dayOfMonth = newDate.getDate();
        const instance = Math.floor((dayOfMonth - 1) / 7) + 1;
        const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const dayName = daysOfWeek[dayOfWeek];
        if (trackProgressData.monthlyType === dayName && instance === parseInt(trackProgressData.monthlyDay)) {
          data = trackProgressData;
        }
      }
    } else if (trackProgressData.trackProgressType === 'annual') {
      if (trackProgressData.annuallyDate && trackProgressData.annuallyDate.toLocaleDateString("en-CA") === newDate.toLocaleDateString("en-CA")) {
        data = trackProgressData;
      }
    }

    return data;
  }

  async getActionSearchIdsList(dto: ActionSearchDto, userId: string) {
    const locals = this.helperService.getLocaleMessages();

    try {
      const { type } = dto;

      if (!type) {
        return {
          message: locals.enter_all_field,
          success: false,
          data: null,
        };
      }

      let condition: any = { userId, deleted: false };
      let data = [];

      if (type === 'journeys') {
        data = await this.discoveryGoalModel.find(condition).select(['name']);
      } else if (type === 'goals') {
        condition.title = { $nin: [null, '', ' '] };
        data = await this.discoveryGoalModel.find(condition).select(['title']);
      } else if (type === 'tag') {
        let allTags = await this.discoveryGoalModel.find(condition).select(['tags']);
        data = [].concat(...allTags.map((entry) => entry.tags.filter((tag) => tag !== '')));
      }

      return {
        message: locals.record_fetch,
        success: true,
        data,
      };
    } catch (err) {
      console.error(err);
      return {
        message: locals.something_went_wrong,
        success: false,
        data: null,
      };
    }
  }


  // async getProjectIdsAndStandaloneIds(dto: GetProjectIdsAndStandaloneIdsDto, userId: string) {
  //   const { currentJourneyId, text } = dto;

  //   if (!currentJourneyId) {
  //     throw new BadRequestException('Please provide a currentJourneyId');
  //   }

  //   let findFields = ['name', 'projectId'];
  //   let condition: any = {
  //     userId,
  //     journeyIds: { $in: [currentJourneyId] },
  //     actionType: 'project',
  //   };

  //   if (text) {
  //     condition = {
  //       name: { $regex: text, $options: 'i' },
  //       userId,
  //       journeyIds: { $in: [currentJourneyId] },
  //       actionType: 'standalone',
  //     };
  //     findFields = ['name', 'standaloneId'];
  //   }

  //   const data = await this.smartActionModel.find(condition).select(findFields);

  //   return {
  //     message: 'Records fetched successfully',
  //     success: true,
  //     data,
  //   };
  // }

  // async getProjectIdsAndStandaloneIds(dto: GetProjectIdsAndStandaloneIdsDto, userId: string) {
  //   const { currentJourneyId, text } = dto;

  //   if (!currentJourneyId) {
  //     throw new BadRequestException('Please provide a currentJourneyId');
  //   }

  //   let findFields = ['name', 'projectId'];
  //   let condition: any = {
  //     userId,
  //     journeyIds: { $in: [currentJourneyId] },
  //     actionType: 'project',
  //   };

  //   if (text) {
  //     condition = {
  //       name: { $regex: text, $options: 'i' },
  //       userId,
  //       journeyIds: { $in: [currentJourneyId] },
  //       actionType: 'standalone',
  //     };
  //     findFields = ['name', 'standaloneId'];
  //   }

  //   const data = await this.smartActionModel.find(condition).select(findFields);

  //   return {
  //     message: 'Records fetched successfully',
  //     success: true,
  //     data,
  //   };
  // }

  async getProjectIdsAndStandaloneIds(dto: GetProjectIdsAndStandaloneIdsDto, userId: string) {
    const locals = this.helperService.getLocaleMessages();
    const { currentJourneyId, text } = dto;

    if (!currentJourneyId) {
      throw new BadRequestException(locals.enter_all_field);
    }

    try {
      let findFields = ['name', 'projectId'];
      let condition: any = {
        userId,
        journeyIds: { $in: [currentJourneyId] },
        actionType: 'project',
      };

      if (text) {
        condition = {
          name: { $regex: text, $options: 'i' },
          userId,
          journeyIds: { $in: [currentJourneyId] },
          actionType: 'standalone',
        };
        findFields = ['name', 'standaloneId'];
      }

      const data = await this.smartActionModel.find(condition).select(findFields);

      if (data.length === 0) {
        return {
          message: locals.record_not_found,
          success: false,
          data: [],
        };
      }

      return {
        message: locals.record_fetch,
        success: true,
        data,
      };
    } catch (error) {
      throw new BadRequestException(error.message || locals.something_went_wrong);
    }
  }

  async addSmartAction(reqBody: any, userId: string): Promise<{ message: string; success: boolean; data: any }> {
    const locals = this.helperService.getLocaleMessages();
    try {
      const {
        actionType,
        name,
        actionTypeId,
        startDate,
        actionTypeOtherFields,
        recurringOtherFields,
        trackProgressOtherFields,
      } = reqBody;

      if (![name, actionTypeId, actionType, startDate].every(Boolean)) {
        throw new BadRequestException(locals.enter_all_field);
      }

      reqBody.userId = userId;
      reqBody.type = actionType;

      if (actionTypeOtherFields) {
        reqBody.targetValue = actionTypeOtherFields.target;
        reqBody.targetUnit = actionTypeOtherFields.unit;
      }

      let newAction = await this.smartActionModel.create(reqBody);
      reqBody.smartActionId = newAction._id;

      if (actionTypeOtherFields) {
        actionTypeOtherFields.userId = userId;
        actionTypeOtherFields.smartActionId = newAction._id;
      }

      if (actionType === 'habit' && actionTypeOtherFields) {
        let actionTypeCreateData = await this.habitActionTypeModel.create(reqBody.actionTypeOtherFields);
        reqBody.habitId = actionTypeCreateData._id;
      }

      let currentLogTotal = 0;

      if (actionType === 'target' && actionTypeOtherFields) {
        currentLogTotal = reqBody.actionTypeOtherFields.beginningValue;
        let actionTypeCreateData = await this.targetActionTypeModel.create(reqBody.actionTypeOtherFields);
        reqBody.targetId = actionTypeCreateData._id;
      }

      let recurringId, trackProgressId;

      if (recurringOtherFields) {
        recurringOtherFields.userId = userId;
        recurringOtherFields.smartActionId = newAction._id;
        let recurringDoc = await this.smartActionRecurringModel.create(recurringOtherFields);
        recurringId = recurringDoc._id;
      }

      if (trackProgressOtherFields) {
        trackProgressOtherFields.userId = userId;
        trackProgressOtherFields.smartActionId = newAction._id;
        let trackProgressDoc = await this.actionTrackProgressModel.create(trackProgressOtherFields);
        trackProgressId = trackProgressDoc._id;
      }

      await this.smartActionModel.updateOne(
        { _id: newAction._id },
        {
          $set: {
            projectId: reqBody.projectId,
            targetId: reqBody.targetId,
            habitId: reqBody.habitId,
            recurringId: recurringId,
            trackProgressId: trackProgressId,
            currentLogTotal: currentLogTotal,
            updatedDate: new Date(),
          },
        },
      );

      return {
        message: locals.smart_action_created,
        success: true,
        data: null,
      };
    } catch (error) {
      throw new BadRequestException(error.message || locals.something_went_wrong);
    }
  }


  // async addSmartActionNew(reqBody: SmartActionDTO, userId: string): Promise<{ message: string; success: boolean; data: any }> {
  //   const locals = this.helperService.getLocaleMessages();

  //   try {
  //     // Validate required fields
  //     const { actionType, name, actionTypeId, startDate } = reqBody;
  //     if (![name, actionTypeId, actionType, startDate].every(Boolean)) {
  //       throw new BadRequestException(locals.enter_all_field);
  //     }

  //     let actionTypeCreateData, newAction;
  //     let currentLogTotal = 0;

  //     if (actionType === 'standalone') {
  //       newAction = await this.smartActionModel.create(reqBody);
  //     } else if (actionType === 'target') {
  //       newAction = await this.smartActionModel.create(reqBody);
  //       reqBody.actionTypeOtherFields.smartActionId = newAction._id;
  //       reqBody.actionTypeOtherFields.userId = userId;

  //       actionTypeCreateData = await this.targetActionTypeModel.create(reqBody.actionTypeOtherFields);
  //       currentLogTotal = reqBody.actionTypeOtherFields.beginningValue;

  //       const trackProgressId = await this.actionTrackProgressModel.create(reqBody.trackProgressOtherFields);

  //       await this.smartActionModel.updateOne(
  //         { _id: newAction._id },
  //         {
  //           $set: {
  //             targetId: actionTypeCreateData._id,
  //             trackProgressId: trackProgressId._id,
  //             targetUnit: reqBody.actionTypeOtherFields.unit,
  //             targetValue: reqBody.actionTypeOtherFields.target,
  //             currentLogTotal: currentLogTotal,
  //             updatedDate: new Date(),
  //           },
  //         },
  //       );
  //     } else if (actionType === 'habit') {
  //       // Handle habit creation based on recurring type
  //       // Adjust your logic here as per your Node.js code
  //       // Implement logic for daily, weekly, monthly, and annual recurring types
  //     }

  //     return {
  //       message: locals.smart_action_created,
  //       success: true,
  //       data: null,
  //     };
  //   } catch (error) {
  //     throw new BadRequestException(error.message || locals.something_went_wrong);
  //   }
  // }


  // async addSmartActionNew(dto: ProjectIdsDto, userId: string) {
  //   try {
  //     const { startDate, actionType, name, actionTypeId, actionTypeOtherFileds, recurringOtherFileds, trackProgressOtherFileds } = dto;

  //     // Check if all required fields are provided
  //     if (![name, actionTypeId, actionType, startDate].every(Boolean)) {
  //       return {
  //         message: 'Please enter all fields',
  //         success: false,
  //         data: null,
  //       };
  //     }

  //     // Set user ID for the DTO
  //     dto.userId = userId;
  //     let currentLogTotal = 0;
  //     let actionTypeCreateData, newAction;

  //     // Create smart action based on action type
  //     if (actionType === 'standalone') {
  //       newAction = await this.smartActionModel.create(dto);
  //       return {
  //         message: 'Smart action created successfully',
  //         success: true,
  //         data: newAction,
  //       };
  //     }

  //     if (actionType === 'target') {
  //       newAction = await this.smartActionModel.create(dto);
  //       actionTypeOtherFileds.smartActionId = newAction._id;
  //       actionTypeOtherFileds.userId = userId;
  //       actionTypeCreateData = await this.targetActionTypeModel.create(actionTypeOtherFileds);
  //       trackProgressOtherFileds.userId = userId;
  //       trackProgressOtherFileds.smartActionId = newAction._id;
  //       const trackProgressId = await this.actionTrackProgressModel.create(trackProgressOtherFileds);
  //       currentLogTotal = actionTypeOtherFileds.beginningValue;
  //       await this.smartActionModel.updateOne({ _id: newAction._id }, {
  //         $set: {
  //           targetId: actionTypeCreateData._id,
  //           trackProgressId: trackProgressId._id,
  //           targetUnit: actionTypeOtherFileds.unit,
  //           targetValue: actionTypeOtherFileds.target,
  //           currentLogTotal,
  //           updatedDate: new Date()
  //         }
  //       });
  //       return {
  //         message: 'Smart action created successfully',
  //         success: true,
  //         data: newAction,
  //       };
  //     }

  //     if (actionType === 'habit') {
  //       let total = 365; // Default to 365 for non-daily types

  //       // Determine total based on recurring type
  //       switch (recurringOtherFileds.recurringType) {
  //         case 'daily':
  //           total = 1; // Only one occurrence for daily recurring
  //           break;
  //         case 'weekly':
  //           total = 52; // Total weeks for weekly recurring
  //           break;
  //         case 'monthly':
  //           total = 12; // Total months for monthly recurring
  //           break;
  //         case 'annual':
  //           total = 1; // Single occurrence for annual recurring
  //           break;
  //         default:
  //           break;
  //       }

  //       console.log(`Creating ${total} smart action(s) for recurring type: ${recurringOtherFileds.recurringType}`);

  //       // Array to hold created actions
  //       const createdActions = [];

  //       // Loop through total to create smart actions
  //       for (let index = 0; index < total; index++) {
  //         // Adjust startDate based on recurring type
  //         let adjustedStartDate = new Date(startDate);
  //         if (index !== 0) {
  //           switch (recurringOtherFileds.recurringType) {
  //             case 'weekly':
  //               adjustedStartDate.setDate(adjustedStartDate.getDate() + (index * 7));
  //               break;
  //             case 'monthly':
  //               adjustedStartDate.setMonth(adjustedStartDate.getMonth() + index);
  //               break;
  //             case 'annual':
  //               adjustedStartDate = new Date(recurringOtherFileds.annualyDate);
  //               break;
  //             default:
  //               break;
  //           }
  //         }

  //         // Check if a smart action already exists for the adjustedStartDate and userId
  //         const existingAction = await this.smartActionModel.findOne({ userId, startDate: adjustedStartDate });
  //         if (existingAction) {
  //           console.log(`Smart action already exists for startDate: ${adjustedStartDate.toISOString()}, skipping creation.`);
  //           continue; // Skip creating if an entry already exists
  //         }

  //         // Assign adjusted startDate to dto
  //         dto.startDate = adjustedStartDate.toISOString();

  //         // Create action type data if provided
  //         if (actionTypeOtherFileds) {
  //           actionTypeCreateData = await this.habitActionTypeModel.create(actionTypeOtherFileds);
  //           dto.habitId = actionTypeCreateData._id;
  //         }

  //         // Create new smart action
  //         newAction = await this.smartActionModel.create(dto);
  //         createdActions.push(newAction);

  //         // Update action type if provided
  //         if (actionTypeOtherFileds) {
  //           await this.habitActionTypeModel.updateOne({ _id: actionTypeCreateData._id }, {
  //             $set: {
  //               smartActionId: newAction._id
  //             }
  //           });
  //         }

  //         // Exit loop after creating one smart action for daily recurring
  //         if (recurringOtherFileds.recurringType === 'daily') {
  //           break;
  //         }
  //       }

  //       if (createdActions.length > 0) {
  //         return {
  //           message: 'Smart action(s) created successfully',
  //           success: true,
  //           data: createdActions,
  //         };
  //       } else {
  //         return {
  //           message: 'Smart action(s) already exist for specified dates, skipping creation',
  //           success: true,
  //           data: null,
  //         };
  //       }
  //     }

  //     return {
  //       message: 'Smart action(s) created successfully',
  //       success: true,
  //       data: {},
  //     };
  //   } catch (err) {
  //     console.error(err);
  //     return {
  //       message: 'Something went wrong',
  //       success: false,
  //       data: null,
  //     };
  //   }

  async addSmartActionNew(dto: ProjectIdsDto, userId: string) {
    const locals = this.helperService.getLocaleMessages();

    try {
      const { startDate, actionType, name, actionTypeId, actionTypeOtherFileds, recurringOtherFileds, trackProgressOtherFileds } = dto;

      // Check if all required fields are provided
      if (![name, actionTypeId, actionType, startDate].every(Boolean)) {
        throw new Error(locals.enter_all_field);
      }

      // Set user ID for the DTO
      dto.userId = userId;
      let currentLogTotal = 0;
      let actionTypeCreateData, newAction;

      // Create smart action based on action type
      if (actionType === 'standalone') {
        newAction = await this.smartActionModel.create(dto);
      } else if (actionType === 'target') {
        newAction = await this.smartActionModel.create(dto);
        actionTypeOtherFileds.smartActionId = newAction._id;
        actionTypeOtherFileds.userId = userId;
        actionTypeCreateData = await this.targetActionTypeModel.create(actionTypeOtherFileds);
        trackProgressOtherFileds.userId = userId;
        trackProgressOtherFileds.smartActionId = newAction._id;
        const trackProgressId = await this.actionTrackProgressModel.create(trackProgressOtherFileds);
        currentLogTotal = actionTypeOtherFileds.beginningValue;
        await this.smartActionModel.updateOne({ _id: newAction._id }, {
          $set: {
            targetId: actionTypeCreateData._id,
            trackProgressId: trackProgressId._id,
            targetUnit: actionTypeOtherFileds.unit,
            targetValue: actionTypeOtherFileds.target,
            currentLogTotal,
            updatedDate: new Date()
          }
        });
      } else if (actionType === 'habit') {
        let total = 365; // Default to 365 for non-daily types

        // Determine total based on recurring type
        switch (recurringOtherFileds.recurringType) {
          case 'daily':
            total = 1; // Only one occurrence for daily recurring
            break;
          case 'weekly':
            total = 52; // Total weeks for weekly recurring
            break;
          case 'monthly':
            total = 12; // Total months for monthly recurring
            break;
          case 'annual':
            total = 1; // Single occurrence for annual recurring
            break;
          default:
            break;
        }

        // Array to hold created actions
        const createdActions = [];

        // Loop through total to create smart actions
        for (let index = 0; index < total; index++) {
          // Adjust startDate based on recurring type
          let adjustedStartDate = new Date(startDate);
          if (index !== 0) {
            switch (recurringOtherFileds.recurringType) {
              case 'weekly':
                adjustedStartDate.setDate(adjustedStartDate.getDate() + (index * 7));
                break;
              case 'monthly':
                adjustedStartDate.setMonth(adjustedStartDate.getMonth() + index);
                break;
              case 'annual':
                adjustedStartDate = new Date(recurringOtherFileds.annualyDate);
                break;
              default:
                break;
            }
          }

          // Check if a smart action already exists for the adjustedStartDate and userId
          const existingAction = await this.smartActionModel.findOne({ userId, startDate: adjustedStartDate });
          if (existingAction) {
            continue; // Skip creating if an entry already exists
          }

          // Assign adjusted startDate to dto
          dto.startDate = adjustedStartDate.toISOString();

          // Create action type data if provided
          if (actionTypeOtherFileds) {
            actionTypeCreateData = await this.habitActionTypeModel.create(actionTypeOtherFileds);
            dto.habitId = actionTypeCreateData._id;
          }

          // Create new smart action
          newAction = await this.smartActionModel.create(dto);
          createdActions.push(newAction);

          // Update action type if provided
          if (actionTypeOtherFileds) {
            await this.habitActionTypeModel.updateOne({ _id: actionTypeCreateData._id }, {
              $set: {
                smartActionId: newAction._id
              }
            });
          }

          // Exit loop after creating one smart action for daily recurring
          if (recurringOtherFileds.recurringType === 'daily') {
            break;
          }
        }

        if (createdActions.length > 0) {
          return {
            message: locals.smart_action_created,
            success: true,
            data: createdActions,
          };
        } else {
          return {
            message: 'Smart action already exist for specified dates, skipping creation',
            success: true,
            data: null,
          };
        }
      }

      // Default return if no specific action type matches
      return {
        message: locals.smart_action_created,
        success: true,
        data: newAction || {}, // Return newAction if defined, otherwise empty object
      };
    } catch (err) {
      console.error(err);

      // Determine error message based on the type of error encountered
      let errorMessage = 'Internal server error';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (err.name === 'CastError' && err.kind === 'date') {
        errorMessage = 'Invalid Date'; // Specific message for invalid date cast errors
      }

      return {
        message: errorMessage,
        success: false,
        data: null,
      };
    }
  }

  // async addSmartActionNew(dto: ProjectIdsDto, userId: string) {
  //   const locals = this.helperService.getLocaleMessages();

  //   try {
  //     const { startDate, actionType, name, actionTypeId, actionTypeOtherFileds, recurringOtherFileds, trackProgressOtherFileds } = dto;

  //     // Check if all required fields are provided
  //     if (![name, actionTypeId, actionType, startDate].every(Boolean)) {
  //       return {
  //         message: locals.enter_all_field,
  //         success: false,
  //         data: null,
  //       };
  //     }

  //     // Set user ID for the DTO
  //     dto.userId = userId;
  //     let currentLogTotal = 0;
  //     let actionTypeCreateData, newAction;

  //     // Create smart action based on action type
  //     if (actionType === 'standalone') {
  //       newAction = await this.smartActionModel.create(dto);
  //       return {
  //         message: locals.smart_action_created,
  //         success: true,
  //         data: newAction,
  //       };
  //     }

  //     if (actionType === 'target') {
  //       newAction = await this.smartActionModel.create(dto);
  //       actionTypeOtherFileds.smartActionId = newAction._id;
  //       actionTypeOtherFileds.userId = userId;
  //       actionTypeCreateData = await this.targetActionTypeModel.create(actionTypeOtherFileds);
  //       trackProgressOtherFileds.userId = userId;
  //       trackProgressOtherFileds.smartActionId = newAction._id;
  //       const trackProgressId = await this.actionTrackProgressModel.create(trackProgressOtherFileds);
  //       currentLogTotal = actionTypeOtherFileds.beginningValue;
  //       await this.smartActionModel.updateOne({ _id: newAction._id }, {
  //         $set: {
  //           targetId: actionTypeCreateData._id,
  //           trackProgressId: trackProgressId._id,
  //           targetUnit: actionTypeOtherFileds.unit,
  //           targetValue: actionTypeOtherFileds.target,
  //           currentLogTotal,
  //           updatedDate: new Date()
  //         }
  //       });
  //       return {
  //         message: locals.smart_action_created,
  //         success: true,
  //         data: newAction,
  //       };
  //     }

  //     if (actionType === 'habit') {
  //       let total = 365; // Default to 365 for non-daily types

  //       // Determine total based on recurring type
  //       switch (recurringOtherFileds.recurringType) {
  //         case 'daily':
  //           total = 1; // Only one occurrence for daily recurring
  //           break;
  //         case 'weekly':
  //           total = 52; // Total weeks for weekly recurring
  //           break;
  //         case 'monthly':
  //           total = 12; // Total months for monthly recurring
  //           break;
  //         case 'annual':
  //           total = 1; // Single occurrence for annual recurring
  //           break;
  //         default:
  //           break;
  //       }

  //       console.log(`Creating ${total} smart action(s) for recurring type: ${recurringOtherFileds.recurringType}`);

  //       // Array to hold created actions
  //       const createdActions = [];

  //       // Loop through total to create smart actions
  //       for (let index = 0; index < total; index++) {
  //         // Adjust startDate based on recurring type
  //         let adjustedStartDate = new Date(startDate);
  //         if (index !== 0) {
  //           switch (recurringOtherFileds.recurringType) {
  //             case 'weekly':
  //               adjustedStartDate.setDate(adjustedStartDate.getDate() + (index * 7));
  //               break;
  //             case 'monthly':
  //               adjustedStartDate.setMonth(adjustedStartDate.getMonth() + index);
  //               break;
  //             case 'annual':
  //               adjustedStartDate = new Date(recurringOtherFileds.annualyDate);
  //               break;
  //             default:
  //               break;
  //           }
  //         }

  //         // Check if a smart action already exists for the adjustedStartDate and userId
  //         const existingAction = await this.smartActionModel.findOne({ userId, startDate: adjustedStartDate });
  //         if (existingAction) {
  //           console.log(`Smart action already exists for startDate: ${adjustedStartDate.toISOString()}, skipping creation.`);
  //           continue; // Skip creating if an entry already exists
  //         }

  //         // Assign adjusted startDate to dto
  //         dto.startDate = adjustedStartDate.toISOString();

  //         // Create action type data if provided
  //         if (actionTypeOtherFileds) {
  //           actionTypeCreateData = await this.habitActionTypeModel.create(actionTypeOtherFileds);
  //           dto.habitId = actionTypeCreateData._id;
  //         }

  //         // Create new smart action
  //         newAction = await this.smartActionModel.create(dto);
  //         createdActions.push(newAction);

  //         // Update action type if provided
  //         if (actionTypeOtherFileds) {
  //           await this.habitActionTypeModel.updateOne({ _id: actionTypeCreateData._id }, {
  //             $set: {
  //               smartActionId: newAction._id
  //             }
  //           });
  //         }

  //         // Exit loop after creating one smart action for daily recurring
  //         if (recurringOtherFileds.recurringType === 'daily') {
  //           break;
  //         }
  //       }

  //       if (createdActions.length > 0) {
  //         return {
  //           message: locals.smart_action_created,
  //           success: true,
  //           data: createdActions,
  //         };
  //       } else {
  //         return {
  //           message: 'Smart action already exist for specified dates, skipping creation',
  //           success: true,
  //           data: null,
  //         };
  //       }
  //     }

  //     return {
  //       message: locals.smart_action_created,
  //       success: true,
  //       data: {},
  //     };
  //   } catch (err) {
  //     console.error(err);
  //     return {
  //       message: locals.smart_action_created,
  //       success: false,
  //       data: null,
  //     };
  //   }
  // }

  async addNewStage(dto: NewArtefactDto, userId: string) {
    const locals = this.helperService.getLocaleMessages();

    try {
      const { currentJourneyId, type, newRecord } = dto;

      if (![currentJourneyId, type, newRecord].every(Boolean)) {
        return {
          message: locals.enter_all_field,
          success: false,
          data: null,
        };
      }

      // Check if the artefact already exists
      let checkRecord;
      switch (type) {
        case TypeEnum.ImagesAndVideos:
          checkRecord = await this.inspiringMediaModel.findOne({
            userId,
            journeyId: newRecord.journeyId,
            stageType: newRecord.stageType,
            type: TypeEnum.ImagesAndVideos,
          });
          break;
        case TypeEnum.Weblinks:
          // Handle Weblinks specific checks
          break;
        case TypeEnum.JournalAndNotepad:
          checkRecord = await this.myThoughtsAndInspirationsModel.findOne({
            userId,
            journeyId: newRecord.journeyId,
            stageType: newRecord.stageType,
            type: TypeEnum.JournalAndNotepad,
          });
          break;
        default:
          return {
            message: 'Invalid artefact type',
            success: false,
            data: null,
          };
      }

      if (checkRecord) {
        return {
          message: locals.already_exists,
          success: false,
          data: null,
        };
      }

      // Create new artefact based on type
      newRecord.journeyId = currentJourneyId;

      switch (type) {
        case TypeEnum.ImagesAndVideos:
          await this.inspiringMediaModel.create(newRecord);
          break;
        case TypeEnum.Weblinks:
          // Handle Weblinks creation
          break;
        case TypeEnum.JournalAndNotepad:
          await this.myThoughtsAndInspirationsModel.create(newRecord);
          break;
        default:
          return {
            message: 'Invalid artefact type',
            success: false,
            data: null,
          };
      }

      return {
        message: 'Artefact created successfully',
        success: true,
        data: null,
      };
    } catch (err) {
      console.error(err);
      return {
        message: locals.something_went_wrong,
        success: false,
        data: null,
      };
    }
  }


  async getAllJourneyMedia(dto: NewMediaDto, userData: any) {
    const locals = this.helperService.getLocaleMessages();
    try {
      let { search, type } = dto;
      let data = [];
      let condition: any = { userId: userData._id, deleted: false };

      if (search && search.length > 0) {
        condition.tags = { $in: search };
      }

      if (type === "imagesAndVideos") {
        condition.type = { $in: ["image", "video"] };
        data = await this.inspiringMediaModel.find(condition).populate("journeyId").sort({ updatedDate: -1 });
      } else if (type === "weblinks") {
        data = await this.linksModel.find(condition).populate("journeyId").sort({ updatedDate: -1 });
      } else if (type === "journalAndNotepad") {
        condition.stageType = { $ne: "global" };
        data = await this.myThoughtsAndInspirationsModel.find(condition).populate("journeyId").sort({ updatedDate: -1 });
      }

      return {
        message: locals.record_fetch,
        success: true,
        data: data
      };
    } catch (err) {
      console.error(err);
      throw new Error(locals.something_went_wrong);
    }
  }



  // async shareWithCommunity(dto: ShareArtefactDto) {
  //   const locals = this.helperService.getLocaleMessages();

  //   try {
  //     const { type, id } = dto;

  //     if (![type, id].every(Boolean)) {
  //       return {
  //         message: locals.enter_all_field,
  //         success: false,
  //         data: null,
  //       };
  //     }

  //     let model;
  //     switch (type.toLowerCase()) {
  //       case TypeEnum.ImagesAndVideos.toLowerCase():
  //         model = this.inspiringMediaModel;
  //         break;
  //       case TypeEnum.Weblinks.toLowerCase():
  //         model = this.linksModel;
  //         break;
  //       case TypeEnum.JournalAndNotepad.toLowerCase():
  //         model = this.myThoughtsAndInspirationsModel;
  //         break;
  //       default:
  //         return {
  //           message: locals.artifact_invalid_type,
  //           success: false,
  //           data: null,
  //         };
  //     }

  //     await model.updateOne({ _id: id }, { $set: { isShare: true } });

  //     return {
  //       message: locals.artifact_share,
  //       success: true,
  //       data: null,
  //     };
  //   } catch (err) {
  //     console.error(err);
  //     return {
  //       message: locals.something_went_wrong,
  //       success: false,
  //       data: null,
  //     };
  //   }
  // }

  // async shareWithCommunity(dto: ShareArtefactDto): Promise<ShareResponseDto> {
  //   const locals = this.helperService.getLocaleMessages();

  //   try {
  //     const { type, id } = dto;

  //     if (![type, id].every(Boolean)) {
  //       return {
  //         message: locals.enter_all_field,
  //         success: false,
  //         data: null,
  //       };
  //     }

  //     let model;
  //     switch (type.toLowerCase()) {
  //       case 'imagesandvideos':
  //         model = this.inspiringMediaModel;
  //         break;
  //       case 'weblinks':
  //         model = this.linksModel;
  //         break;
  //       case 'journalandnotepad':
  //         model = this.myThoughtsAndInspirationsModel;
  //         break;
  //       default:
  //         return {
  //           message: locals.artifact_invalid_type,
  //           success: false,
  //           data: null,
  //         };
  //     }

  //     const artefact = await model.findByIdAndUpdate(id, { $set: { isShare: true } });

  //     if (!artefact) {
  //       throw new NotFoundException('Artefact not found');
  //     }

  //     return {
  //       message: locals.artifact_share,
  //       success: true,
  //       data: null,
  //     };
  //   } catch (err) {
  //     console.error(err);
  //     return {
  //       message: locals.something_went_wrong,
  //       success: false,
  //       data: null,
  //     };
  //   }
  // }


  async shareWithCommunity(dto: ShareArtefactDto): Promise<ShareResponseDto> {
    const locals = this.helperService.getLocaleMessages();

    try {
      const { type, id } = dto;

      if (![type, id].every(Boolean)) {
        return {
          message: locals.enter_all_field,
          success: false,
          data: null,
        };
      }

      let model;
      switch (type.toLowerCase()) {
        case 'imagesandvideos':
          model = this.inspiringMediaModel;
          break;
        case 'weblinks':
          model = this.linksModel;
          break;
        case 'journalandnotepad':
          model = this.myThoughtsAndInspirationsModel;
          break;
        default:
          return {
            message: locals.artifact_invalid_type,
            success: false,
            data: null,
          };
      }

      const artefact = await model.findByIdAndUpdate(id, { $set: { isShare: true } });

      if (!artefact) {
        throw new NotFoundException('Artefact not found');
      }

      return {
        message: locals.artifact_share,
        success: true,
        data: null,
      };
    } catch (err) {
      console.error(err);
      throw err; // Re-throw the error to be caught by the controller
    }
  }


  async newActionAddIdsList(userId: string): Promise<any> {
    const locals = this.helperService.getLocaleMessages();

    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException(locals.user_not_found);
      }

      const journey = await this.journeyModel
        .find({ userId, deleted: false, name: { $ne: '' } })
        .select('_id name')
        .sort({ updatedDate: -1 });

      const action = await this.smartActionModel
        .find({ userId, deleted: false, name: { $ne: '' } })
        .select('_id name')
        .sort({ updatedDate: -1 });

      const goal = await this.discoveryGoalModel
        .find({ userId, deleted: false, title: { $nin: [null, '', ' '] } })
        .select('_id title')
        .sort({ updatedDate: -1 });

      return {
        message: locals.record_fetch,
        success: true,
        data: {
          journeyId: journey,
          dependentId: action,
          goalId: goal,
        },
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }


  async addArea(dto: AbundanceAreaDto | FocusAreaDto | ActionAreaDto, userId: string): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    try {
      let areaModel;
      let areaType;
      let searchQuery: any = {
        title: dto.title,
        userId,
        deleted: false,
      };

      switch (dto.type) {
        case 'abundance':
          areaModel = this.abundanceAreaModel;
          areaType = 'user';
          searchQuery = { ...searchQuery, type: areaType };
          break;
        case 'focus':
          areaModel = this.focusAreaModel;
          areaType = 'user';
          searchQuery = { ...searchQuery, type: areaType, abundanceAreaId: (dto as FocusAreaDto).abundanceAreaId };
          break;
        case 'action':
          areaModel = this.actionAreaModel;
          areaType = 'user';
          searchQuery = { ...searchQuery, type: areaType, focusAreaId: (dto as ActionAreaDto).focusAreaId };
          break;
        default:
          throw new Error('Invalid area type');
      }

      const existingArea = await areaModel.findOne({
        ...searchQuery,
        status: 'active',
      });

      if (existingArea) {
        return {
          message: locals.area_name_available,
          success: true,
          data: null,
        };
      }

      const newArea = await areaModel.create({
        ...dto,
        userId,
        type: areaType,
        status: 'active',
      });

      return {
        message: locals.area_added,
        success: true,
        data: newArea._id,
      };
    } catch (err) {
      console.error(err);
      throw new Error(locals.something_went_wrong);
    }
  }


  async listOfFocusArea(dto: FocusAreaListDto, userId: string, req: Request): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    try {
      // Validate user logic here or use middleware as needed
      let userData = await this.helperService.validateUser(req);

      if (!dto.abundanceAreaId) {
        return {
          message: locals.abundance_area_id_required,
          success: false,
          data: null,
        };
      }

      const focus = await this.focusAreaModel
        .find({
          status: 'active',
          deleted: false,
          abundanceAreaId: dto.abundanceAreaId,
          $or: [{ type: 'admin' }, { type: 'user', userId }],
        })
        .select('colourCode title type')
        .exec();

      return {
        message: locals.record_fetch,
        success: true,
        data: {
          FocusArea: focus,
        },
      };
    } catch (err) {
      console.error(err);
      return {
        message: locals.something_went_wrong,
        success: false,
        data: null,
      };
    }
  }


  async listOfActionArea(dto: ActionAreaListDto, userId: string, req: Request): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    try {
      const userData = await this.helperService.validateUser(req);

      if (!dto.focusAreaId) {
        return {
          message: locals.abundance_area_id_required,
          success: false,
          data: null,
        };
      }

      const action = await this.actionAreaModel
        .find({
          status: 'active',
          deleted: false,
          focusAreaId: dto.focusAreaId,
          $or: [{ type: 'admin' }, { type: 'user', userId }],
        })
        .select('colourCode title type')
        .exec();

      return {
        message: locals.record_fetch,
        success: true,
        data: {
          ActionArea: action,
        },
      };
    } catch (err) {
      console.error(err);
      return {
        message: locals.something_went_wrong,
        success: false,
        data: null,
      };
    }
  }

  async addJourney(dto: AddJourneyDto, userId: string): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    try {
      if (![dto.type, dto.name, dto.abundanceAreaId, dto.focusAreaId, dto.actionAreaId, dto.createrName].every(Boolean)) {
        return {
          message: locals.enter_all_field,
          success: false,
          data: null,
        };
      }

      const journeyData = {
        ...dto,
        userId,
        journeyStartDate: new Date().toLocaleDateString('en-CA'),
      };

      const journey = await this.journeyModel.create(journeyData);

      const journeyGuideData = [
        {
          actionName: 'MY I CAN! INSPIRATION',
          description: '',
          journeyId: journey._id,
          title: 'Why do I know I Can make the change(s)?',
          userId,
        },
        {
          actionName: 'MY WHY? INSPIRATION',
          description: '',
          journeyId: journey._id,
          title: 'Why will the change increase my Abundance?',
          userId,
        },
        {
          actionName: 'MY WHAT? INSPIRATION',
          description: '',
          journeyId: journey._id,
          title: 'What am I going to improve?',
          userId,
        },
      ];

      for (const guide of journeyGuideData) {
        await this.journeyGuideModel.create(guide);
      }

      return {
        message: locals.journey_added,
        success: true,
        data: journey._id,
      };
    } catch (err) {
      console.error(err);
      return {
        message: locals.something_went_wrong,
        success: false,
        data: null,
      };
    }
  }


  async editJourney(dto: EditJourneyDto): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    try {
      if (!dto.id) {
        return {
          message: locals.enter_all_filed,
          success: false,
          data: null,
        };
      }

      const updateData: any = {
        ...dto,
        updatedDate: new Date(),
      };

      if (dto.status) {
        updateData.statusUpdatedDate = new Date();
      }

      if (dto.status === 'completed') {
        updateData.completedDate = new Date();
      } else {
        updateData.completedDate = null;
      }

      await this.journeyModel.updateOne({ _id: dto.id }, { $set: updateData });

      return {
        message: locals.journey_updated,
        success: true,
        data: null,
      };
    } catch (err) {
      console.error(err);
      return {
        message: locals.something_went_wrong,
        success: false,
        data: null,
      };
    }
  }

  async deleteJourney(id: string): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    try {
      if (!id) {
        return {
          message: locals.enter_all_filed,
          success: false,
          data: null,
        };
      }

      // Find the record by ID
      const existingRecord = await this.journeyModel.findById(id);

      if (!existingRecord) {
        return {
          message: locals.record_not_found,
          success: false,
          data: null,
        };
      }

      const result = await this.journeyModel.deleteOne(
        { _id: id },
        { $set: { deleted: true, deletedAt: Date.now() } }
      );

      return {
        message: locals.journey_deleted,
        success: true,
        data: null,
      };
    } catch (err) {
      console.error(err);
      return {
        message: locals.something_went_wrong,
        success: false,
        data: null,
      };
    }
  }


  async listOfArea(userId: string): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    try {
      // Abundance active focus areas for admins and users
      const abundance = await this.abundanceAreaModel.find({
        status: 'active',
        deleted: false,
        $or: [{ type: 'admin' }, { type: 'user', userId }],
      }).select(['colourCode', 'title', 'type']).exec();

      // Fetch active focus areas for admins and users
      const focus = await this.focusAreaModel.find({
        status: 'active',
        deleted: false,
        $or: [{ type: 'admin' }, { type: 'user', userId }],
      }).select(['colourCode', 'title', 'type']).exec();

      return {
        message: locals.record_fetch,
        success: true,
        data: {
          AbundanceArea: abundance,
          FocusArea: focus,
          TeamName: [
            { _id: '6530c763384c9f2a30c0de6c', title: 'A Team' },
            { _id: '6530c763384c9f2a30c0de6d', title: 'B Team' },
            { _id: '6530c763384c9f2a30c0de6d', title: 'C Team' },
          ],
        },
      };
    } catch (err) {
      return {
        message: locals.something_went_wrong,
        success: false,
        data: null,
      };
    }
  }


  async journeyListForUser(userId: string, status?: string): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    try {
      // Define the type for the condition object
      let condition: any = { deleted: false, userId: userId };

      if (!status) {
        condition = {
          ...condition,
          status: { $ne: 'trashed' },
        };
      }

      if (status) {
        condition = {
          ...condition,
          status: status,
        };
      }

      const populateFields = ['abundanceAreaId', 'focusAreaId', 'actionAreaId'];
      const data = await this.journeyModel.find(condition)
        .select([
          'type',
          'teamName',
          'desiredJourneyEndDate',
          'journeyStartDate',
          'status',
          'name',
          'focusArea',
          'likelyJourneyEndDate',
          'userId',
          'createdDate',
          'updatedDate',
          'statusUpdatedDate',
          'abundanceAreaId',
          'focusAreaId',
          'actionAreaId',
          'completedDate',
        ])
        .populate(populateFields);

      return {
        message: locals.journey_added,
        success: true,
        data: data,
      };
    } catch (err) {
      return {
        message: locals.something_went_wrong,
        success: false,
        data: null,
      };
    }
  }


  async getJourneyListing(dto: GetJourneyListingDto): Promise<any> {
    const locals = this.helperService.getLocaleMessages();

    try {
      // Destructure and parse query parameters
      const { page = 1, limit = 10, userId = '', status = '', search = '' } = dto;

      // Calculate offset
      const offset = (page - 1) * limit;

      // Build query condition
      let condition: any = { deleted: false };
      if (status) {
        condition.status = status;
      }
      if (search) {
        condition.name = { $regex: search, $options: 'i' };
      }
      if (userId) {
        condition.userId = userId;
      }

      // Fetch filtered data from MongoDB
      const filteredData = await this.journeyModel.find(condition);

      // Paginate the filtered data
      const paginatedData = filteredData.slice(offset, offset + limit);

      // Prepare response array
      const response = [];
      for (const journey of paginatedData) {
        const abundance = await this.abundanceAreaModel.findOne({
          _id: journey.abundanceAreaId,
        });
        const extraField = {
          abundanceAreaId: journey.abundanceAreaId,
          colourCode: abundance ? abundance.colourCode : '#CE1C1C',
          abundanceArea: abundance ? abundance.title : '',
        };
        const mergedObject = Object.assign({}, journey.toObject(), extraField);
        response.push(mergedObject);
      }

      // Send the paginated and filtered data as the API response
      return {
        message: locals.journey_listing,
        success: true,
        journeys: response,
        page: page,
        limit: limit,
        totalItems: filteredData.length,
        totalPages: Math.ceil(filteredData.length / limit),
      };
    } catch (err) {
      console.error(err);
      throw new Error(locals.something_went_wrong);
    }
  }
  async addStickyNotes(dto: AddStickyNotesDto, userId: string): Promise<any> {
    const locals = this.helperService.getLocaleMessages();

    try {
      const { title, description, type, journeyId, journeyGuideId } = dto;

      // Create the sticky notes object
      const stickyNotes = await this.myThoughtsAndInspirationsModel.create({
        title,
        description,
        type,
        journeyId,
        journeyGuideId,
        userId,
      });

      return {
        message: locals.sticky_notes_created,
        success: true,
        data: null,
      };
    } catch (err) {
      console.error(err);
      throw new Error(locals.something_went_wrong);
    }
  }


  async updateStickyNotes(dto: UpdateStickyNotesDto): Promise<any> {
    const locals = this.helperService.getLocaleMessages();

    try {
      const { id, title } = dto;

      // Optionally, you can update other fields here
      const updateData = {
        ...dto,
        updatedDate: new Date(), // Example of updating updatedDate
      };

      const stickyNoteUpdateData = await this.myThoughtsAndInspirationsModel.findByIdAndUpdate(id, {
        $set: updateData,
      });

      if (!stickyNoteUpdateData) {
        throw new Error(locals.record_not_found);
      }

      return {
        message: locals.sticky_notes_updated,
        success: true,
        data: null,
      };
    } catch (err) {
      console.error(err);
      throw new Error(locals.something_went_wrong);
    }
  }

  async deleteStickyNotes(dto: DeleteStickyNotesDto): Promise<any> {
    const locals = this.helperService.getLocaleMessages();

    try {
      const { id } = dto;

      // Find the record by ID
      const existingRecord = await this.myThoughtsAndInspirationsModel.findById(id);
      if (!existingRecord) {
        throw new Error(locals.record_not_found);
      }

      // Soft delete the record
      await this.myThoughtsAndInspirationsModel.findByIdAndDelete(id, {
        $set: {
          deleted: true,
          deletedAt: new Date(),
        },
      });

      return {
        message: locals.sticky_notes_deleted,
        success: true,
        data: null,
      };
    } catch (err) {
      console.error(err);
      throw new Error(locals.something_went_wrong);
    }
  }


  async getStickyNotesDetails(id: string): Promise<MyThoughtsAndInspirations> {
    const locals = this.helperService.getLocaleMessages();

    try {
      const isRecordExists = await this.myThoughtsAndInspirationsModel.findById(id)
        .select([
          'title',
          'description',
          'status',
          'journeyGuideId',
          'journeyId',
          'updatedDate',
          'type',
          'tags',
        ])
        .exec();

      if (!isRecordExists) {
        throw new NotFoundException(locals.record_not_found);
      }

      return isRecordExists;
    } catch (error) {
      throw new NotFoundException(locals.record_not_found);
    }
  }


  async getStickyNotesListing(dto: GetStickyNotesListingDto): Promise<any> {
    const { journeyId, journeyGuideId, startDate, endDate, tags, title, stageType } = dto;

    let fields = [
      "title",
      "description",
      "status",
      "journeyGuideId",
      "journeyId",
      "type",
      "tags",
      "updatedDate",
      "stageType"
    ];

    // Define all potential properties upfront
    let condition: any = {
      journeyId: journeyId,
      type: "journalEntries",
      stageType: "inspiration",
      deleted: false
    };

    // Now TypeScript knows about filterDate, tags, and journeyGuideId
    if (startDate || endDate) {
      condition.filterDate = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    if (tags && tags.length > 0) {
      condition.tags = { $in: tags };
    }

    if (title) {
      let conditionTitle = {
        $or: [
          { title: { $regex: title, $options: "i" } },
          { description: { $regex: title, $options: "i" } },
        ],
      };
      condition = { ...condition, ...conditionTitle };
    }

    if (stageType) {
      condition.stageType = stageType;
    }

    if (journeyGuideId) {
      condition.journeyGuideId = journeyGuideId;
    }

    const filteredjournalEntriesData = await this.myThoughtsAndInspirationsModel
      .find({ ...condition, type: "journalEntries" })
      .sort({ updatedDate: -1 })
      .select(fields);

    condition.type = "stickyNotes";
    const filteredStickyNotesData = await this.myThoughtsAndInspirationsModel
      .find(condition)
      .sort({ updatedDate: -1 })
      .select(fields);

    return {
      journalEntries: filteredjournalEntriesData,
      stickyNotes: filteredStickyNotesData,
    };
  }


  async getMyThoughtsAndInspirationsListing(journeyId: string): Promise<{ journalEntries: any[], stickyNotes: any[] }> {
    const locals = this.helperService.getLocaleMessages();
    try {
      const fields = [
        'title',
        'description',
        'status',
        'journeyGuideId',
        'journeyId',
        'type',
        'tags',
        'updatedDate',
        'stageType'
      ];

      // Query for journalEntries
      const journalEntriesCondition = {
        journeyId: journeyId,
        type: 'journalEntries',
        stageType: 'inspiration',
        deleted: false
      };
      const journalEntries = await this.myThoughtsAndInspirationsModel
        .find(journalEntriesCondition)
        .sort({ updatedDate: -1 })
        .select(fields)
        .exec();

      // Query for stickyNotes
      const stickyNotesCondition = {
        journeyId: journeyId,
        type: 'stickyNotes',
        stageType: 'inspiration',
        deleted: false
      };
      const stickyNotes = await this.myThoughtsAndInspirationsModel
        .find(stickyNotesCondition)
        .sort({ updatedDate: -1 })
        .select(fields)
        .exec();

      return { journalEntries, stickyNotes };
    } catch (error) {
      throw new NotFoundException(locals.something_went_wrong);
    }
  }

  async getMyThoughtsAndInspirationsById(id: string): Promise<MyThoughtsAndInspirations> {
    try {
      const thought = await this.myThoughtsAndInspirationsModel.findById(id);
      if (!thought) {
        throw new NotFoundException('MyThoughtsAndInspirations not found');
      }
      return thought;
    } catch (err) {
      throw new NotFoundException('MyThoughtsAndInspirations not found');
    }
  }

  async getTagListingByJourneyId(journeyId: string, journeyGuideId?: string, stageType?: string): Promise<TagListingResponseDto> {
    const locals = this.helperService.getLocaleMessages();

    try {
      const condition: any = {
        journeyId,
        type: "journalEntries",
        deleted: false
      };

      if (journeyGuideId) condition.journeyGuideId = journeyGuideId;
      if (stageType) condition.stageType = stageType;

      const filteredJournalEntriesData = await this.myThoughtsAndInspirationsModel
        .find(condition)
        .select("tags");

      const journalEntriesFlatTagsArray = [].concat(...filteredJournalEntriesData.map(entry => entry.tags.filter(tag => tag !== '')));

      condition.type = "stickyNotes";
      const filteredStickyNotesData = await this.myThoughtsAndInspirationsModel
        .find(condition)
        .select("tags");

      const stickyNotesFlatTagsArray = [].concat(...filteredStickyNotesData.map(entry => entry.tags.filter(tag => tag !== '')));

      return {
        message: locals.sticky_notes_listing,
        success: true,
        data: {
          journalEntriesTags: journalEntriesFlatTagsArray,
          stickyNotesTags: stickyNotesFlatTagsArray,
        },
      };
    } catch (err) {
      console.error(err);
      throw new BadRequestException(locals.something_went_wrong);
    }
  }



  private readonly logger = new Logger(JourneyService.name);

  async getTagListing(userData, tagListingDto: TagListingDto): Promise<any> {
    const { type } = tagListingDto;
    const locals = this.helperService.getLocaleMessages();

    if (!type) {
      this.logger.error('Type is missing in the request');
      throw new BadRequestException(locals.enter_all_filed);
    }

    const condition = {
      userId: userData._id,
      deleted: false,
    };

    let filteredData;
    let tagsArray = [];

    try {
      if (type === "journalEntries") {
        condition['type'] = "journalEntries";
        filteredData = await this.myThoughtsAndInspirationsModel.find(condition).select("tags");
      } else if (type === "journalAndNotepad") {
        filteredData = await this.myThoughtsAndInspirationsModel.find(condition).select(["tags", "title"]);
      } else if (type === "imagesAndVideos") {
        filteredData = await this.inspiringMediaModel.find(condition).select(["tags", "title"]);
      } else if (type === "weblinks") {
        filteredData = await this.linksModel.find(condition).select(["tags", "title"]);
      } else {
        this.logger.error('Invalid type provided');
        throw new BadRequestException('Invalid type');
      }

      if (!filteredData) {
        this.logger.error('No data found for the given type');
        throw new BadRequestException('No data found for the given type');
      }

      tagsArray = [].concat(...filteredData.map(entry => entry.tags.filter(tag => tag !== '')));

      return {
        message: locals.tags_listing,
        success: true,
        data: tagsArray,
      };
    } catch (error) {
      this.logger.error(`Error in getTagListing: ${error.message}`);
      throw new BadRequestException(locals.something_went_wrong);
    }
  }


  async getJourneyDetails(id: string): Promise<Journey> {
    return await this.journeyModel.findById(id)
      .populate('abundanceAreaId focusAreaId actionAreaId')
      .exec();
  }


  async addJourneyGuide(dto: AddJourneyGuideDto, req: Request): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    try {
      const userData = await this.helperService.validateUser(req);
      // Assuming req.user contains the authenticated user's data

      if (!userData) {
        throw new UnauthorizedException('User not authenticated');
      }

      // Create new guide
      const newGuide = await this.journeyGuideModel.create({
        journeyId: dto.journeyId,
        title: dto.title,
        description: dto.description,
        actionName: dto.actionName,
        userId: userData._id, // Use userId from the authenticated user's data
      });

      return {
        success: true,
        message: locals.journey_guide_created,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: locals.something_went_wrong,
      };
    }
  }
  // journey.service.ts

  async getJourneyGuideListing(journeyId: string, userId: string): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    if (!journeyId) {
      throw new BadRequestException(locals.enter_all_field);
    }

    const filteredData = await this.journeyGuideModel
      .find({
        deletedAt: null,
        userId: userId,
        journeyId: journeyId,
      })
      .sort({ createdAt: -1 })
      .select('_id title actionName description journeyId userId');

    if (filteredData.length === 0) {
      throw new NotFoundException(locals.journey_guide_listing);
    }

    return {
      message: locals.journey_guide_listing,
      success: true,
      data: filteredData,
    };
  }

  async getJourneyGuideDetails(id: string): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    try {
      if (!id) {
        throw new BadRequestException(locals.enter_valid_Id);
      }

      const isRecordExists = await this.journeyGuideModel.findById(id)
        .select('_id title actionName description journeyId userId')
        .exec();

      if (!isRecordExists) {
        throw new NotFoundException(locals.record_not_found);
      }

      return {
        message: locals.journey_guide_details,
        success: true,
        data: isRecordExists,
      };
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException(locals.record_not_found);
      } else {
        console.error(err);
        throw new BadRequestException(locals.something_went_wrong);
      }
    }
  }


  async deleteJourneyGuide(id: string): Promise<void> {
    const locals = this.helperService.getLocaleMessages();
    try {
      if (!id) {
        throw new BadRequestException(locals.enter_valid_Id);
      }

      const journeyGuide = await this.journeyGuideModel.findByIdAndDelete(id);

      if (!journeyGuide) {
        throw new BadRequestException(locals.record_not_found);
      }
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw new BadRequestException(err.message);
      } else {
        console.error(err);
        throw new BadRequestException(locals.something_went_wrong);
      }
    }
  }


  async inspirationStageList(dto: InspirationStageListDto): Promise<any> {
    const locals = this.helperService.getLocaleMessages();

    try {
      const { journeyId, journeyGuideId } = dto;

      if (![journeyId, journeyGuideId].every(Boolean)) {
        throw new BadRequestException(locals.enter_all_field);
      }

      const journeyGuide = await this.journeyGuideModel.findById(journeyGuideId)
        .sort({ createdDate: -1 })
        .select('_id title actionName description journeyId userId updatedDate');

      if (!journeyGuide) {
        throw new BadRequestException(locals.record_not_found);
      }

      const fields = [
        'title',
        'description',
        'document',
        'status',
        'journeyGuideId',
        'journeyId',
        'tags',
        'type',
        'stageType',
        'updatedDate',
      ];

      const stickyNotes = await this.myThoughtsAndInspirationsModel.find({
        journeyId,
        journeyGuideId,
        type: 'stickyNotes',
        stageType: 'inspiration',
        deleted: false,
      }).sort({ createdDate: -1 }).select(fields);

      const journalEntries = await this.myThoughtsAndInspirationsModel.find({
        journeyId,
        journeyGuideId,
        type: 'journalEntries',
        stageType: 'inspiration',
        deleted: false,
      }).select(fields).sort({ createdDate: -1 });

      const inspiringMediaVideo = await this.inspiringMediaModel.find({
        journeyId,
        journeyGuideId,
        type: 'video',
        stageType: 'inspiration',
        deleted: false,
      }).sort({ createdDate: -1 });

      const inspiringMediaImage = await this.inspiringMediaModel.find({
        journeyId,
        journeyGuideId,
        type: 'image',
        stageType: 'inspiration',
        deleted: false,
      }).sort({ createdDate: -1 });

      const inspiringMediaAudio = await this.inspiringMediaModel.find({
        journeyId,
        journeyGuideId,
        type: 'audio',
        stageType: 'inspiration',
        deleted: false,
      }).sort({ createdDate: -1 });

      const linksToOtherWebPages = await this.linksModel.find({
        journeyId,
        journeyGuideId,
        stageType: 'inspiration',
        deleted: false,
      }).sort({ createdDate: -1 });

      const data = {
        journeyGuide: {
          description: journeyGuide.description,
          actionName: journeyGuide.actionName,
          _id: journeyGuide._id,
          journeyId: journeyGuide.journeyId,
          title: journeyGuide.title,
          userId: journeyGuide.userId,
          updatedDate: journeyGuide.updatedDate,
          MyThoughtsAndInspiration: {
            journalEntries,
            stickyNotes,
          },
          InspiringMedia: {
            inspiringMediaImage,
            inspiringMediaVideo,
            inspiringMediaAudio,
          },
          InspirationFromOthers: {
            LinkstoOtherWebPages: linksToOtherWebPages,
          },
        },
      };

      return {
        message: locals.record_fetch,
        success: true,
        data,
      };
    } catch (err) {
      console.error(err);
      throw new Error(locals.something_went_wrong);
    }
  }


  async addInspiringMedia(dto: AddInspiringMediaDto): Promise<void> {
    try {
      await this.inspiringMediaModel.create(dto);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to add inspiring media');
    }
  }


  async updateInspiringMedia(dto: UpdateInspiringMediaDto): Promise<boolean> {
    try {
      dto.updatedDate = new Date(); // Set updatedDate
      const inspiringMediaUpdateData = await this.inspiringMediaModel.findByIdAndUpdate(dto.id, dto, { new: true });

      if (!inspiringMediaUpdateData) {
        return false; // If document not found
      }

      return true; // Success
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update inspiring media');
    }
  }


  async deleteInspiringMedia(id: string): Promise<void> {
    const locals = this.helperService.getLocaleMessages();
    try {
      if (!id) {
        throw new BadRequestException(locals.enter_valid_Id);
      }

      const inspiringMedia = await this.inspiringMediaModel.findByIdAndDelete(id);

      if (!inspiringMedia) {
        throw new BadRequestException(locals.record_not_found);
      }
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw new BadRequestException(err.message);
      } else {
        console.error(err);
        throw new BadRequestException(locals.something_went_wrong);
      }
    }
  }


  async getInspiringMediaDetails(dto: GetInspiringMediaDetailsDto): Promise<InspiringMediaDocument | null> {
    try {
      const inspiringMediaDetails = await this.inspiringMediaModel.findById(dto.id).select([
        'title',
        'tags',
        'status',
        'type',
        'document',
        'journeyGuideId',
        'journeyId',
        'endDate',
        'updatedDate',
      ]);

      return inspiringMediaDetails;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch inspiring media details');
    }
  }


  // async getInspiringMediaListing(dto: GetInspiringMediaListingDto): Promise<any> {
  //   try {
  //     const { journeyId, journeyGuideId, stageType } = dto;

  //     const conditions: any = {
  //       journeyId,
  //       deleted: false,
  //     };

  //     if (journeyGuideId) {
  //       conditions.journeyGuideId = journeyGuideId;
  //     }

  //     if (stageType) {
  //       conditions.stageType = stageType;
  //     }

  //     const fields = [
  //       'title',
  //       'status',
  //       'type',
  //       'document',
  //       'journeyGuideId',
  //       'journeyId',
  //       'tags',
  //       'updatedDate',
  //       'stageType',
  //     ];

  //     const result: any = {
  //       audio: [],
  //       video: [],
  //       image: [],
  //     };

  //     const audioData = await this.inspiringMediaModel.find({ ...conditions, type: 'audio' })
  //       .sort({ createdDate: -1 })
  //       .select(fields);

  //     const videoData = await this.inspiringMediaModel.find({ ...conditions, type: 'video' })
  //       .sort({ createdDate: -1 })
  //       .select(fields);

  //     const imageData = await this.inspiringMediaModel.find({ ...conditions, type: 'image' })
  //       .sort({ createdDate: -1 })
  //       .select(fields);

  //     result.audio = audioData;
  //     result.video = videoData;
  //     result.image = imageData;

  //     return {
  //       message: 'Inspiring media list successfully fetched.',
  //       success: true,
  //       data: result,
  //     };
  //   } catch (error) {
  //     console.error(error);
  //     throw new BadRequestException('Failed to fetch inspiring media list.');
  //   }
  // }


  // async getInspiringMediaListing(journeyId: string, userId: string): Promise<any> {
  //   const locals = this.helperService.getLocaleMessages();
  //   if (!journeyId) {
  //     throw new BadRequestException(locals.enter_all_field);
  //   }

  //   const filteredData = await this.inspiringMediaModel
  //     .find({
  //       deletedAt: null,
  //       userId: userId,
  //       journeyId: journeyId,
  //     })
  //     .sort({ createdAt: -1 })
  //     .select('_id title actionName description journeyId userId');

  //   if (filteredData.length === 0) {
  //     throw new NotFoundException(locals.inspiring_media_listing);
  //   }

  //   return {
  //     message: locals.inspiring_media_listing,
  //     success: true,
  //     data: filteredData,
  //   };
  // }

  async getInspiringMediaListing(journeyId: string, journeyGuideId: string, stageType: string): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    try {
      if (!journeyId) {
        throw new BadRequestException(locals.enter_all_field);
      }

      const conditions: any = {
        journeyId,
        stageType: stageType || 'inspiration',
        // Removed deleted condition if it doesn't exist in schema
      };

      if (journeyGuideId) {
        conditions.journeyGuideId = journeyGuideId;
      }

      const fields = [
        'title',
        'status',
        'type',
        'document',
        'journeyGuideId',
        'journeyId',
        'tags',
        'updatedDate',
        'stageType',
      ];

      const result: any = {
        audio: [],
        video: [],
        image: [],
      };

      const audioData = await this.inspiringMediaModel.find({ ...conditions, type: 'audio' })
        .sort({ createdDate: -1 })
        .select(fields);

      const videoData = await this.inspiringMediaModel.find({ ...conditions, type: 'video' })
        .sort({ createdDate: -1 })
        .select(fields);

      const imageData = await this.inspiringMediaModel.find({ ...conditions, type: 'image' })
        .sort({ createdDate: -1 })
        .select(fields);

      result.audio = audioData;
      result.video = videoData;
      result.image = imageData;

      return {
        message: locals.inspiring_media_listing,
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Error fetching inspiring media listing:', error);
      throw new BadRequestException(locals.something_went_wrong);
    }
  }


  async getQuotesListing(input: any): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    try {
      // Validate user and retrieve user data
      const userData = await this.helperService.validateUser(input);

      // Extract pagination parameters
      const page = parseInt(input.query.page, 10) || 1;
      const limit = parseInt(input.query.limit, 10) || 10;
      const skip = (page - 1) * limit;

      // Fetch areas and extract their IDs
      const areas = await this.areaModel.find({ status: 'active', deleted: false });
      const areaIds = areas.map(area => area._id);

      // Fetch quotes based on area IDs
      const [quotes, totalItems] = await Promise.all([
        this.quoteManagementModel
          .find({ areaId: { $in: areaIds }, status: 'active', deleted: false })
          .sort({ createdDate: -1 })
          .skip(skip)
          .limit(limit)
          .select('quote author source date areaId'),
        this.quoteManagementModel.countDocuments({ areaId: { $in: areaIds }, status: 'active', deleted: false }),
      ]);

      // Calculate total pages
      const totalPages = Math.ceil(totalItems / limit);

      // Return successful response
      return {
        message: locals.record_fetch,
        success: true,
        page,
        limit,
        totalItems,
        totalPages,
        data: quotes,
      };
    } catch (err) {
      // Log error for debugging purposes
      console.error('Error in getQuotesListing:', err);

      // Throw a specific exception with a meaningful message
      throw new BadRequestException('Failed to fetch quotes. Please try again later.');
    }
  }


  async addLink(userData: any, addLinkDto: AddLinkDto): Promise<void> {
    const locals = this.helperService.getLocaleMessages();
    try {
      // Validate required fields
      const { journeyId, webPageLink } = addLinkDto;
      if (!journeyId || !webPageLink) {
        throw new Error('Journey ID and Web page link are required fields');
      }

      addLinkDto.userId = userData._id;

      await this.linksModel.create(addLinkDto);
    } catch (error) {
      console.error('Error while adding link:', error);
      throw new Error(locals.something_went_wrong);
    }
  }


  async updateLink(userData: any, updateLinkDto: UpdateLinkDto): Promise<Links | null> {
    try {
      const { id, ...updateData } = updateLinkDto;

      const updatedLink = await this.linksModel.findByIdAndUpdate(id, updateData, { new: true });
      return updatedLink;
    } catch (error) {
      console.error('Error updating link:', error);
      return null;
    }
  }

  async deleteLink(deleteLinkDto: DeleteLinkDto): Promise<boolean> {
    const locals = this.helperService.getLocaleMessages();
    try {
      const { id } = deleteLinkDto;

      const existingRecord = await this.linksModel.findById(id);
      if (!existingRecord) {
        throw new Error(locals.record_not_found);
      }

      await this.linksModel.findByIdAndDelete(id);

      return true;
    } catch (error) {
      console.error('Error deleting link:', error);
      return false;
    }
  }


  async getLinkDetails(getLinkDto: GetLinkDto): Promise<{ message: string; success: boolean; data: LinksDocument | null }> {
    const locals = this.helperService.getLocaleMessages();
    try {
      const { id } = getLinkDto;

      // Find the link details by ID
      const linkDetails = await this.linksModel.findById(id).select([
        'title',
        'status',
        'journeyGuideId',
        'journeyId',
        'tags',
        'webPageLink',
        'updatedDate',
      ]);

      if (!linkDetails) {
        return {
          message: locals.record_not_found,
          success: false,
          data: null,
        };
      }

      return {
        message: 'Link details retrieved successfully',
        success: true,
        data: linkDetails,
      };
    } catch (error) {
      console.error('Error fetching link details:', error);
      return {
        message: locals.something_went_wrong,
        success: false,
        data: null,
      };
    }
  }


  async getLinkListing(getLinkListingDto: GetLinkListingDto): Promise<{ message: string; success: boolean; data: LinksDocument[] }> {
    const locals = this.helperService.getLocaleMessages();
    try {
      const { journeyId, journeyGuideId, stageType } = getLinkListingDto;

      let condition: any = {
        journeyId,
        stageType: stageType || 'inspiration',
        deleted: false,
      };

      if (journeyGuideId) {
        condition.journeyGuideId = journeyGuideId;
      }

      const fields = [
        'title',
        'status',
        'journeyGuideId',
        'journeyId',
        'tags',
        'webPageLink',
        'updatedDate',
      ];

      // Fetch data from MongoDB using Mongoose model
      const data = await this.linksModel.find(condition)
        .sort({ createdDate: -1 })
        .select(fields)
        .exec();

      return {
        message: 'Links listing retrieved successfully',
        success: true,
        data,
      };
    } catch (error) {
      console.error('Error fetching link listing:', error);
      return {
        message: locals.something_went_wrong,
        success: false,
        data: null,
      };
    }
  }


  async addDiscoveryGoal(addDiscoveryGoalDto: AddDiscoveryGoalDto): Promise<void> {
    try {
      await this.discoveryGoalModel.create(addDiscoveryGoalDto);
    } catch (error) {
      console.error('Error creating discovery goal:', error);
      throw new Error('Failed to add discovery goal');
    }
  }


  async updateDiscoveryGoal(updateDiscoveryGoalDto: UpdateDiscoveryGoalDto): Promise<DiscoveryGoal | null> {
    try {
      const { id, ...updateData } = updateDiscoveryGoalDto;

      const updatedGoal = await this.discoveryGoalModel.findByIdAndUpdate(id, updateData, { new: true });

      return updatedGoal;
    } catch (error) {
      console.error('Error updating discovery goal:', error);
      return null;
    }
  }


  async deleteDiscoveryGoal(id: string): Promise<DiscoveryGoal | null> {
    try {
      const existingRecord = await this.discoveryGoalModel.findById(id);

      if (!existingRecord) {
        return null;
      }

      const deletedGoal = await this.discoveryGoalModel.findByIdAndDelete(id);

      return deletedGoal;
    } catch (error) {
      console.error('Error deleting discovery goal:', error);
      return null;
    }
  }


  async getDiscoveryGoal(id: string): Promise<any> {
    try {
      const data = await this.discoveryGoalModel.findById(id).select([
        "title",
        "description",
        "status",
        "journeyGuideId",
        "journeyId",
        "updatedDate"
      ]).populate("journeyId");

      if (!data) {
        return null;
      }

      const actions = await this.smartActionModel.find({ discoveryGoalId: data._id }).populate("actionTypeId");

      return {
        "_id": data._id,
        "title": data.title,
        "description": data.description,
        "status": data.status,
        "journeyGuideId": data.journeyGuideId,
        "journeyId": data.journeyId,
        "updatedDate": data.updatedDate,
        "smartAction": actions
      };
    } catch (error) {
      console.error('Error fetching discovery goal:', error);
      return null;
    }
  }


  async getDiscoveryGoalListing(journeyId: string): Promise<DiscoveryGoalListingResponseDto> {
    const locals = this.helperService.getLocaleMessages();
    try {

      const fields = [
        'title',
        'description',
        'status',
        'journeyGuideId',
        'journeyId',
        'updatedDate',
      ];

      const condition = {
        journeyId,
        deleted: false,
      };

      const data = await this.discoveryGoalModel
        .find(condition)
        .populate('journeyId')
        .sort({ updatedDate: -1 })
        .select(fields);

      if (data.length === 0) {
        return {
          message: locals.enter_valid_Id,
          success: false,
          data: [],
        };
      }

      const details = [];
      for (const goal of data) {
        const action = await this.smartActionModel
          .find({ discoveryGoalId: goal._id, deleted: false })
          .populate('actionTypeId');

        const mergedObject = {
          _id: goal._id,
          title: goal.title,
          description: goal.description,
          status: goal.status,
          journeyGuideId: goal.journeyGuideId,
          journeyId: goal.journeyId,
          updatedDate: goal.updatedDate,
          smartAction: action,
        };

        details.push(mergedObject);
      }

      return {
        message: locals.discovery_goal_listing,
        success: true,
        data: details,
      };
    } catch (error) {
      console.error('Error fetching discovery goal listing:', error);
      throw new Error(locals.something_went_wrong);
    }
  }


  async addVisionVideo(addVisionVideoDto: AddVisionVideoDto): Promise<void> {
    try {
      const newVisionVideo = new this.visionVideoModel(addVisionVideoDto);
      await newVisionVideo.save();
    } catch (error) {
      throw new Error('Failed to add vision video');
    }
  }


  async updateVisionVideo(input: any, updateVisionVideoDto: UpdateVisionVideoDto): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    try {
      const userData = await this.helperService.validateUser(input);
      const { id, remove, imageUrl, ...updateFields } = updateVisionVideoDto;

      if (!id) {
        throw new BadRequestException(locals.id_required);
      }

      if (remove === true || imageUrl) {
        await this.visionVideoModel.updateOne({ _id: id }, { $pull: { videoImages: imageUrl } });
      } else {
        await this.visionVideoModel.updateOne({ _id: id }, { $set: updateFields });
      }

      return {
        message: locals.vision_video_updated,
        success: true,
        data: null,
      };
    } catch (err) {
      console.error('Error in updateVisionVideo:', err);
      throw new BadRequestException('Failed to update vision video. Please try again later.');
    }
  }

  async getVisionVideoListing(getVisionVideoListingDto: GetVisionVideoListingDto): Promise<{ message: string; success: boolean; data: VisionVideoDocument[] }> {
    const locals = this.helperService.getLocaleMessages();
    try {
      const { journeyId, journeyGuideId } = getVisionVideoListingDto;

      let condition: any = {
        journeyId,
      };

      if (journeyGuideId) {
        condition.journeyGuideId = journeyGuideId;
      }

      const fields = [
        '_id',
        'userId',
        'journeyGuideId',
        'journeyId',
        'title',
        'videoImages',
        'transition',
        'timing',
        'status',
        'createdDate',
        'updatedDate',
        '__v',
      ];

      const data = await this.visionVideoModel
        .find(condition)
        .sort({ updatedDate: -1 })
        .select(fields);

      return {
        message: locals.vision_video_listing,
        success: true,
        data,
      };
    } catch (err) {
      console.error('Error in getVisionVideoListing service:', err);
      return {
        message: locals.something_went_wrong,
        success: false,
        data: null,
      };
    }
  }


  async updateStageType(): Promise<{ data: any; data1: any; data2: any }> {

    const update = { $set: { stageType: 'inspiration' } };
    const data = await this.inspiringMediaModel.updateMany(update).exec();
    const data1 = await this.myThoughtsAndInspirationsModel.updateMany(update).exec();
    const data2 = await this.linksModel.updateMany(update).exec();

    return { data, data1, data2 };
  }


  // async getInspiringImages(userId: string, journeyId: string): Promise<any[]> {
  //   const locals = this.helperService.getLocaleMessages();
  //   try {
  //     const inspirationImages = await this.inspiringMediaModel
  //       .find({ userId, journeyId, type: 'image', stageType: 'inspiration' })
  //       .sort({ createdDate: -1 })
  //       .exec();

  //     const data = inspirationImages.map((element) => element.document).filter(Boolean); // Ensure no empty strings
  //     return data;
  //   } catch (err) {
  //     console.error('Error in getInspiringImages service:', err);
  //     throw new Error(locals.something_went_wrong);
  //   }
  // }

  async getInspiringImages(userId: string, journeyId: string): Promise<any[]> {
    const locals = this.helperService.getLocaleMessages();
    try {
      const inspirationImages = await this.inspiringMediaModel
        .find({ userId, journeyId, type: 'image', stageType: 'inspiration' })
        .sort({ createdDate: -1 })
        .exec();

      const data = inspirationImages.map((element) => element.document).filter(Boolean); // Ensure no empty strings

      if (data.length === 0) {
        throw new Error(locals.record_not_found);
      }

      return data;
    } catch (err) {
      // console.error('Error in getInspiringImages service:', err);
      throw new Error(err.message); // Re-throw the specific error message
    }
  }


  async getActionTypeListing(): Promise<ActionType[]> {
    try {
      return await this.actionTypeModel.find({}).select(['type', 'description', 'createdDate', 'updatedDate']).exec();
    } catch (err) {
      console.error('Error in getActionTypeListing:', err);
      throw new BadRequestException('Failed to fetch action types. Please try again later.');
    }
  }


  async actionTypeAddUpdate(dto: UpdateActionTypeDto): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    try {
      let data;
      if (dto.id) {
        data = await this.actionTypeModel.updateOne({ _id: dto.id }, { $set: dto }).exec();
      } else if (dto.deleteId) {
        data = await this.actionTypeModel.deleteOne({ _id: dto.deleteId }).exec();
      } else {
        data = await this.actionTypeModel.create(dto);
      }
      return data;
    } catch (err) {
      console.error('Error in actionTypeAddUpdate:', err);
      throw new BadRequestException(locals.something_went_wrong);
    }
  }



  // async updateSmartActionCheckListStatus(dto: UpdateSmartActionCheckListStatusDto) {
  //   try {
  //     const { smartActionId, type, checkListStatus, status, ids } = dto;

  //     const data = await this.smartActionModel.findOne({ _id: smartActionId, deleted: false });
  //     if (!data) {
  //       return {
  //         message: 'Invalid smartActionId provided.',
  //         success: false,
  //         data: null,
  //       };
  //     }

  //     // Log the retrieved data for debugging purposes
  //     console.log('Retrieved data:', data);

  //     // Update logic based on type and status
  //     if (type === 'checkList') {
  //       // Handle checkList updates if needed
  //     } else {
  //       // Handle status updates
  //       if (status && data.status !== status) {
  //         // Log the status before update
  //         console.log('Updating status to:', status);

  //         // Perform the update operation
  //         const updateResult = await this.smartActionModel.updateOne(
  //           { _id: smartActionId },
  //           { $set: { status, updatedDate: new Date() } }
  //         );

  //         // Log the update result
  //         console.log('Update result:', updateResult);
  //       }
  //     }

  //     // Retrieve updated document after update
  //     const updatedAction = await this.smartActionModel.findById(smartActionId);

  //     // Log the updated document
  //     console.log('Updated action:', updatedAction);

  //     return {
  //       message: 'Smart Action successfully updated.',
  //       success: true,
  //       data: updatedAction,
  //     };
  //   } catch (err) {
  //     console.error('Error updating smart action:', err);
  //     return {
  //       message: 'Failed to update smart action.',
  //       success: false,
  //       data: null,
  //     };
  //   }
  // }

  //  async updateSmartActionCheckListStatus(dto: UpdateSmartActionCheckListStatusDto) {
  //     try {
  //       const { smartActionId, type, checkListStatus, status, ids } = dto;

  //       const data = await this.smartActionModel.findOne({ _id: smartActionId, deleted: false });
  //       if (!data) {
  //         return {
  //           message: 'Invalid smartActionId provided.',
  //           success: false,
  //           data: null,
  //         };
  //       }

  //       let recurringData: SmartActionRecurringDocument | null = null;
  //       if (data.recurringId) {
  //         recurringData = await this.smartActionRecurringModel.findOne({ _id: data.recurringId, deleted: false });
  //       }

  //       let setStatus = 'done';
  //       if (checkListStatus) {
  //         setStatus = checkListStatus;
  //       }

  //       let updatedAction: SmartActionDocument | null = null;
  //       if (type === 'checkList') {
  //         const updatedCheckList = data.checkList.map(item => ({
  //           _id: item._id,
  //           text: item.text,
  //           status: ids.includes(item._id.toString()) ? setStatus : item.status,
  //         }));

  //         await this.smartActionModel.updateOne({ _id: smartActionId }, { $set: { checkList: updatedCheckList, updatedDate: new Date() } });
  //         updatedAction = await this.smartActionModel.findById(smartActionId);
  //       } else {
  //         if (status === 'completed' && data.actionType !== 'standalone') {
  //           if (recurringData && recurringData.recurringType === 'annual') {
  //             await this.smartActionModel.updateOne({ _id: smartActionId }, { $set: { status, completedDate: new Date(), updatedDate: new Date() } });
  //           } else {
  //             await this.smartActionModel.updateOne({ _id: smartActionId }, { $set: { status, updatedDate: new Date() } });
  //           }
  //         } else if (status === 'planned' && data.actionType !== 'standalone') {
  //           // Handle 'planned' status logic here if needed
  //         } else {
  //           // Handle other status updates based on your requirements
  //         }

  //         updatedAction = await this.smartActionModel.findById(smartActionId);
  //       }

  //       return {
  //         message: 'Smart Action successfully updated.',
  //         success: true,
  //         data: updatedAction,
  //       };
  //     } catch (err) {
  //       console.error('Error updating smart action:', err);
  //       return {
  //         message: 'Failed to update smart action.',
  //         success: false,
  //         data: null,
  //       };
  //     }
  //   }


  async updateSmartAction(dto: UpdateSmartActionDto) {
    const locals = this.helperService.getLocaleMessages(); // Ensure this method exists and returns locale messages

    try {
      const {
        smartActionId,
        recurringUpdateFields,
        trackProgressUpdateFields,
        actionTypeOtherFields,
        checkList,
        status,
        today,
      } = dto;

      // Validate smartActionId existence
      const existingAction = await this.smartActionModel.findOne({ _id: smartActionId, deleted: false });
      if (!existingAction) {
        return {
          message: locals.enter_valid_Id,
          success: false,
          data: null,
        };
      }

      // Update trackProgressUpdateFields if provided
      if (trackProgressUpdateFields) {
        await this.actionTrackProgressModel.updateOne(
          { _id: trackProgressUpdateFields._id },
          { $set: trackProgressUpdateFields }
        );
      }

      // Update recurringUpdateFields if provided
      if (recurringUpdateFields) {
        await this.smartActionModel.updateOne(
          { _id: recurringUpdateFields._id },
          { $set: recurringUpdateFields }
        );
      }

      // Handle actionTypeOtherFields based on actionType
      if (actionTypeOtherFields) {
        if (existingAction.actionType === 'target') {
          actionTypeOtherFields.targetValue = actionTypeOtherFields.target;
          actionTypeOtherFields.targetUnit = actionTypeOtherFields.unit;
          if (actionTypeOtherFields.beginningValue) {
            let sum = existingAction.currentLogTotal - actionTypeOtherFields.beginningValue;
            actionTypeOtherFields.currentLogTotal = Math.abs(sum);
          }
          await this.targetActionTypeModel.updateOne(
            { _id: actionTypeOtherFields._id },
            { $set: actionTypeOtherFields }
          );
        } else if (existingAction.actionType === 'habit') {
          actionTypeOtherFields.targetValue = actionTypeOtherFields.target;
          actionTypeOtherFields.targetUnit = actionTypeOtherFields.unit;
          await this.habitActionTypeModel.updateOne(
            { smartActionId: existingAction._id },
            { $set: actionTypeOtherFields }
          );
        }
      }

      // Update checkList if provided
      if (checkList) {
        const dataRes = checkList.map(item => ({
          _id: item._id,
          text: item.text,
          status: item.status,
        }));
        dto.checkList = dataRes;
      }

      // Handle completedDate separately
      let updateData: any = { ...dto };
      if (status === 'completed') {
        updateData.completedDate = new Date(); // Set to the current date
      } else {
        updateData.completedDate = null; // Set to null when not completed
      }

      // Remove boolean completedDate from the update object to avoid casting issues
      delete updateData.completedDate;

      // Update updatedDate
      updateData.updatedDate = new Date().toISOString();

      // Update smartAction document based on smartActionId
      await this.smartActionModel.updateOne(
        { _id: smartActionId },
        { $set: updateData }
      );

      // Update completedDate separately to avoid casting issues
      if (status === 'completed') {
        await this.smartActionModel.updateOne(
          { _id: smartActionId },
          { $set: { completedDate: new Date() } }
        );
      } else {
        await this.smartActionModel.updateOne(
          { _id: smartActionId },
          { $set: { completedDate: null } }
        );
      }

      // Return success response
      return {
        message: locals.smart_action_updated,
        success: true,
        data: null,
      };
    } catch (err) {
      console.error('Error updating smart action:', err);
      return {
        message: locals.something_went_wrong,
        success: false,
        data: null,
      };
    }
  }
  


  async updateSmartActionCheckListStatus(dto: UpdateSmartActionCheckListStatusDto) {
    try {
      const { smartActionId, type, checkListStatus, status, ids } = dto;

      const data = await this.smartActionModel.findOne({ _id: smartActionId, deleted: false });
      if (!data) {
        return {
          message: 'Invalid smartActionId provided.',
          success: false,
          data: null,
        };
      }

      let recurringData: SmartActionRecurringDocument | null = null;
      if (data.recurringId) {
        recurringData = await this.smartActionRecurringModel.findOne({ _id: data.recurringId, deleted: false });
      }

      let setStatus = 'done';
      if (checkListStatus) {
        setStatus = checkListStatus;
      }

      let updatedAction: SmartActionDocument | null = null;
      if (type === 'checkList') {
        const updatedCheckList = data.checkList.map(item => ({
          _id: item._id,
          text: item.text,
          status: ids.includes(item._id.toString()) ? setStatus : item.status,
        }));

        await this.smartActionModel.updateOne({ _id: smartActionId }, { $set: { checkList: updatedCheckList, updatedDate: new Date() } });
        updatedAction = await this.smartActionModel.findById(smartActionId);
      } else {
        if (status === 'completed' && data.actionType !== 'standalone') {
          if (recurringData && recurringData.recurringType === 'annual') {
            await this.smartActionModel.updateOne({ _id: smartActionId }, { $set: { status, completedDate: new Date(), updatedDate: new Date() } });
          } else {
            await this.smartActionCompletedStatusModel.create({ ...dto, userId: data.userId }); // Assuming dto has userId
          }
        } else if (status === 'planned' && data.actionType !== 'standalone') {
          await this.smartActionCompletedStatusModel.deleteOne({ statusUpdateDate: dto.statusUpdateDate, smartActionId });
        } else {
          if (data.actionType === 'standalone') {
            await this.smartActionModel.updateOne({ _id: smartActionId }, { $set: { status, updatedDate: new Date() } });
          }
        }
        if (status !== 'completed' && data.status === 'completed') {
          await this.smartActionModel.updateOne({ _id: smartActionId }, { $set: { status, completedDate: null, updatedDate: new Date() } });
        }

        updatedAction = await this.smartActionModel.findById(smartActionId);
      }

      return {
        message: 'Smart Action successfully updated.',
        success: true,
        data: updatedAction,
      };
    } catch (err) {
      console.error('Error updating smart action:', err);
      return {
        message: 'Failed to update smart action.',
        success: false,
        data: null,
      };
    }
  }


  async deleteSmartAction(id: string, dto: DeleteSmartActionDto) {
    const locals = this.helperService.getLocaleMessages(); // Ensure this method exists and returns locale messages

    try {
      if (!id) {
        return {
          message: locals.enter_all_filed,
          success: false,
          data: null,
        };
      }

      // Find the record by ID
      const existingRecord = await this.smartActionModel.findById(id);
      if (!existingRecord) {
        return {
          message: locals.record_not_found,
          success: false,
          data: null,
        };
      }

      if (existingRecord.actionType === 'standalone' || existingRecord.actionType === 'target') {
        await this.smartActionModel.deleteOne(
          { _id: new Types.ObjectId(id) },
          { $set: { deleted: true, deletedAt: Date.now(), updatedDate: new Date() } }
        );
      } else {
        if (dto.today === true) {
          await this.smartActionModel.deleteOne(
            { _id: new Types.ObjectId(id) },
            { $set: { deleted: true, deletedAt: Date.now(), updatedDate: new Date() } }
          );
        } else {
          await this.smartActionModel.deleteMany(
            { trackProgressId: existingRecord.trackProgressId },
            { $set: { deleted: true, deletedAt: Date.now(), updatedDate: new Date() } }
          );
        }
      }

      return {
        message: locals.smart_action_deleted,
        success: true,
        data: null,
      };
    } catch (err) {
      console.error('Error deleting smart action:', err);
      return {
        message: locals.something_went_wrong,
        success: false,
        data: null,
      };
    }
  }


}
