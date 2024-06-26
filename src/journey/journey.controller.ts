// journey.controller.ts
import { Controller, Post, Body, UseGuards, BadRequestException, Req, HttpStatus, Res, Param, NotFoundException, Get, UnauthorizedException, InternalServerErrorException, Query, Put, Delete, ValidationPipe, UsePipes, UseInterceptors, UploadedFile } from '@nestjs/common';
import { JourneyService } from './journey.service';
import { JwtAuthGuard } from '../middlewares/auth.guard'; // Adjust path as per your project structure
import { UserDocument } from 'src/databases/models/user.schema';
import { JwtRequest } from 'src/jwt-request.interface';
import { HelperService } from 'src/helpers/helper.service';
import { Response } from 'express';
import { ActionListDto } from './dto/action-list.dto';
import { ActionSearchDto } from './dto/action-search.dto';
import { GetProjectIdsAndStandaloneIdsDto } from './dto/project-ids-standalone.dto';
import { ProjectIdsDto } from './dto/project-ids.dto';
import { NewArtefactDto } from './dto/new-artefact.dto';
import { NewMediaDto } from './dto/new-media.dto';
import { ShareArtefactDto } from './dto/share-artefact.dto';
import { ValidateTokenMiddleware } from 'src/middlewares/validate-token.middleware';
import { AbundanceAreaDto } from 'src/admin/dto/abundance-area.dto';
import { FocusAreaDto } from 'src/admin/dto/focus-area.dto';
import { ActionAreaDto } from 'src/admin/dto/action-area.dto';
import { FocusAreaListDto } from './dto/focus-area-list.dto';
import { ActionAreaListDto } from './dto/action-area-list.dto';
import { AddJourneyDto } from 'src/admin/dto/add-journey.dto';
import { EditJourneyDto } from './dto/edit-journey.dto';
import { GetJourneyListingDto } from './dto/get-journey-listing.dto';
import { AddStickyNotesDto } from './dto/add-sticky-notes.dto';
import { UpdateStickyNotesDto } from './dto/update-sticky-notes.dto';
import { GetStickyNotesDetailsDto } from './dto/get-sticky-notes-details.dto';
import { GetStickyNotesListingDto } from './dto/get-sticky-notes-listing.dto';
import { TagListingDto } from './dto/get-tag-list.dto';
import { GetJourneyDetailsDto } from './dto/get-journey-details.dto';
import { AddJourneyGuideDto } from './dto/add-journey-guide.dto';
import { TagListingResponseDto } from './dto/tag-listing-response.dto';
import { GetTagListingDto } from './dto/get-taglisting.dto';
import { GetJourneyGuideDetailsDto } from './dto/get-journeyguide-details.dto';
import { DeleteJourneyGuideDto } from './dto/delete-journey-guide.dto';
import { InspirationStageListDto } from './dto/inspiration-stage-list.dto';
import { AddInspiringMediaDto } from './dto/add-inspiring-media.dto';
import { UpdateInspiringMediaDto } from './dto/update-inspiring-media.dto';
import { DeleteInspiringMediaDto } from './dto/delete-inspiring-media.dto';
import { GetInspiringMediaDetailsDto } from './dto/get-inspiring-media-details.dto';
import { GetInspiringMediaListingDto } from './dto/get-inspiring-media-listing.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { AddLinkDto } from './dto/add-links.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { GetLinkListingDto } from './dto/get-link-listing.dto';
import { AddDiscoveryGoalDto } from './dto/add-discovery-goal.dto';
import { UpdateDiscoveryGoalDto } from './dto/update-discovery-goal.dto';
import { DeleteDiscoveryGoalDto } from './dto/delete-discovery-goal.dto';
import { GetDiscoveryGoalDto } from './dto/get-discovery-goal.dto';
import { DiscoveryGoalListingResponseDto, GetDiscoveryGoalListingDto } from './dto/goal.listing.dto';
import { AddVisionVideoDto } from './dto/add-vision-video.dto';
import { UpdateVisionVideoDto } from './dto/update-vision-video.dto';
import { GetVisionVideoListingDto } from './dto/get-vision-video-listing.dto';
import { GetInspiringImagesDto } from './dto/get-inspiring-image.dto';
import { GetActionTypeListingResponseDto } from './dto/get-action-type-list.dto';
import { ActionTypeResponseDto, UpdateActionTypeDto } from './dto/update-action-type.schema.dto';
import { ActionType, ActionTypeDocument } from 'src/databases/models/action-type.schema';
import { UpdateSmartActionCheckListStatusDto } from './dto/smartaction.dto';
import { UpdateSmartActionDto } from './dto/update-smart-action.dto';
import { DeleteSmartActionDto } from './dto/delete-smart-action.dto';
// import { SmartActionDto } from './dto/smartaction.dto';

interface ExtendedRequest extends Request {
  user: {
    userId: string;
    username: string;
  };
}

@Controller('journey')
export class JourneyController {
  constructor(private readonly journeyService: JourneyService, private readonly helperService: HelperService) { }

  @Post('/getAllJournalEntries')
  @UseGuards(JwtAuthGuard) // Assuming you have JwtAuthGuard defined
  async getAllJournalEntries(
    @Req() req: JwtRequest, // Use JwtRequest instead of Request
    @Body('startDate') startDate?: Date,
    @Body('endDate') endDate?: Date,
    @Body('tags') tags?: string[],
    @Body('title') title?: string,
  ): Promise<{ message: string; success: boolean; data: { globalJournalEntries: any[]; OtherJournalEntries: any[] } }> {
    if ((startDate && !endDate) || (endDate && !startDate)) {
      throw new BadRequestException('Both startDate and endDate are required if either is provided.');
    }
    const user: UserDocument = req.user; // TypeScript should recognize user property now
    return this.journeyService.getAllJournalEntries(user, startDate, endDate, tags, title);
  }


  @UseGuards(JwtAuthGuard)
  @Post('addActionLog')
  async addActionLog(@Body() reqBody: any, @Res() res: Response) {
    try {
      const result = await this.journeyService.addActionLog(reqBody);

      if (!result.success) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: result.message,
          success: false,
          data: null,
        });
      }

      return res.status(HttpStatus.OK).json({
        message: result.message,
        success: true,
        data: result.data,
      });
    } catch (error) {
      console.error('Error in addActionLog:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Something went wrong',
        success: false,
        data: null,
      });
    }
  }

  // @Get('/getActionLog/:smartActionId')
  // @UseGuards(JwtAuthGuard)
  // async getActionLog(
  //   @Param('smartActionId') smartActionId: string,
  //   @Req() req: JwtRequest,
  // ) {
  //   try {
  //     const dto = { smartActionId } as GetActionLogDto;
  //     const result = await this.journeyService.getActionLog(dto, req);
  //     return result;
  //   } catch (error) {
  //     if (error instanceof UnauthorizedException) {
  //       throw new BadRequestException('Invalid token.');
  //     }
  //     throw new BadRequestException(error.message || 'Something went wrong.');
  //   }
  // }

  @Get('getActionLog/:smartActionId')
  async getActionLog(@Req() req: Request, @Param() params: { smartActionId: string }) {
    const { smartActionId } = params;
    return this.journeyService.getActionLog(req, smartActionId);
  }

  @Post('/actionListWithSearch')
  // @UseGuards(JwtAuthGuard)
  async actionListWithSearchAccordingAction(@Body() dto: ActionListDto, @Req() req: Request, @Res() res: Response) {
    try {
      const userData = await this.helperService.validateUser(req);
      const result = await this.journeyService.actionListWithSearchAccordingAction(dto, userData);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({
        message: 'Something went wrong while fetching records.',
        success: false,
        data: null
      });
    }
  }

  @Post('/actionListWithSearchNew')
  async actionListWithSearchAccordingActionNew(@Req() req: Request, @Res() res: Response, @Body() actionListDto: ActionListDto) {
    try {
      const response = await this.journeyService.actionListWithSearchAccordingActionNew(req, actionListDto);
      return res.status(200).json(response);
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }


  @Get('/getActionSearchIdsList')
  async getActionSearchIdsList(@Query() dto: ActionSearchDto, @Res() res: Response) {
    const userData = {}; // Implement your user validation logic here
    const result = await this.journeyService.getActionSearchIdsList(dto, userData['_id']);
    return res.status(result.success ? 200 : 500).send(result);
  }

  @Post('/getProjectIdsAndStandaloneIds')
  @UseGuards(JwtAuthGuard)
  async getProjectIdsAndStandaloneIds(
    @Body() dto: GetProjectIdsAndStandaloneIdsDto,
    @Req() req: JwtRequest,
  ) {
    try {
      const userData = await this.helperService.validateUser(req);

      if (!userData || !userData._id) {
        throw new BadRequestException('User data is missing or invalid.');
      }

      const result = await this.journeyService.getProjectIdsAndStandaloneIds(dto, userData._id.toString());
      return result;
    } catch (error) {
      throw new BadRequestException(error.message || 'Something went wrong.');
    }
  }

  // @Post('/addSmartAction')
  // async addSmartAction(@Body() reqBody: any): Promise<{ message: string; success: boolean; data: any }> {
  //   const locals = this.helperService.getLocaleMessages();
  //   try {
  //     const userId = reqBody.userId;

  //     if (!userId) {
  //       throw new BadRequestException(locals.id_required);
  //     }

  //     const result = await this.journeyService.addSmartAction(reqBody, userId);
  //     return result;
  //   } catch (error) {
  //     throw new BadRequestException(error.message || locals.something_went_wrong);
  //   }
  // }

  @Post('addSmartAction')
  @UseGuards(JwtAuthGuard)
  async addSmartAction(@Body() reqBody: any, @Req() req: any) {
    const userId = req.user.userId;
    return this.journeyService.addSmartAction(reqBody, userId);
  }

  @Post('addSmartActionNew')
  @UseGuards(JwtAuthGuard)
  async addSmartActionNew(
    @Body() dto: ProjectIdsDto,
    @Req() req: ExtendedRequest,
    @Res() res: Response,
  ) {
    const locals = this.helperService.getLocaleMessages();
    try {
      const userId = req.user?.userId;
      const userData = await this.helperService.validateUser(req);
      if (!userData._id) {
        return res.status(401).send({
          message: 'Unauthorized',
          success: false,
          data: null,
        });
      }

      const result = await this.journeyService.addSmartActionNew(dto, userData._id.toString());
      return res.status(200).send(result);
    } catch (err) {
      console.error(err);
      return res.status(500).send({
        message: locals.something_went_wrong,
        success: false,
        data: null,
      });
    }
  }

  @Post('addNewArtefact')
  async addNewArtefact(@Body() dto: NewArtefactDto, @Req() req: any, @Res() res: any) {
    const locals = this.helperService.getLocaleMessages();

    try {
      const userId = req.user?.userId; // Assuming you have a way to get userId from request
      const result = await this.journeyService.addNewStage(dto, userId);
      return res.status(200).send(result);
    } catch (err) {
      console.error('Error in controller:', err);
      return res.status(500).send({
        message: locals.something_went_wrong,
        success: false,
        data: null,
      });
    }
  }


  @Post('getAllJourneyLibrary')
  async getAllJourneyMedia(@Body() dto: NewMediaDto, @Req() req: Request, @Res() res: Response) {
    const locals = this.helperService.getLocaleMessages();

    try {
      const userData = await this.helperService.validateUser(req); // Assuming user data is attached to request object
      const result = await this.journeyService.getAllJourneyMedia(dto, userData);
      return res.status(200).send(result);
    } catch (err) {
      console.error(err);
      return res.status(400).send({
        message: locals.something_went_wrong,
        success: false,
        data: null,
      });
    }
  }

  // @Post('sharewithcommunity')
  // async shareWithCommunity(@Body() dto: ShareArtefactDto, @Req() req: any, @Res() res: any) {
  //   const locals = this.helperService.getLocaleMessages();
  //   try {
  //     let userData = await this.helperService.validateUser(req);
  //     const result = await this.journeyService.shareWithCommunity(dto);
  //     return res.status(HttpStatus.OK).send(result);
  //   } catch (err) {
  //     console.error(err);
  //     return res.status(HttpStatus.BAD_REQUEST).send({
  //       message: locals.something_went_wrong,
  //       success: false,
  //       data: null,
  //     });
  //   }
  // }

  // @Post('sharewithcommunity')
  // async shareWithCommunity(@Body() dto: ShareArtefactDto, @Req() req: any, @Res() res: any) { // Inject @Req() here
  //   const locals = this.helperService.getLocaleMessages();

  //   try {
  //     await this.helperService.validateUser(req); // Use req here to validate user
  //     const result = await this.journeyService.shareWithCommunity(dto);
  //     return res.status(HttpStatus.OK).send(result);
  //   } catch (err) {
  //     console.error(err);
  //     return res.status(HttpStatus.BAD_REQUEST).send({
  //       message: locals.something_went_wrong,
  //       success: false,
  //       data: null,
  //     });
  //   }
  // }
  @Post('sharewithcommunity')
  async shareWithCommunity(@Body() dto: ShareArtefactDto, @Req() req: any, @Res() res: any) {
    const locals = this.helperService.getLocaleMessages();

    try {
      await this.helperService.validateUser(req);
      const result = await this.journeyService.shareWithCommunity(dto);
      return res.status(HttpStatus.OK).send(result);
    } catch (err) {
      console.error(err);

      // Handle specific error types
      if (err instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).send({
          message: 'Artefact not found',
          success: false,
          data: null,
        });
      }

      // Handle other types of errors
      return res.status(HttpStatus.BAD_REQUEST).send({
        message: locals.something_went_wrong,
        success: false,
        data: null,
      });
    }
  }

  @Get('newActionAddIdsList')
  @UseGuards(ValidateTokenMiddleware)
  async newActionAddIdsList(@Req() req: Request, @Res() res: Response): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    try {

      const userData = await this.helperService.validateUser(req);
      // const userId = req.user.userId; // Assuming your token middleware sets userId on req.user

      const result = await this.journeyService.newActionAddIdsList(userData._id.toString());
      return res.status(HttpStatus.OK).send(result);
    } catch (err) {
      console.error(err);
      if (err instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).send({
          message: locals.user_not_found, // Customize as per your application's error handling
          success: false,
          data: null,
        });
      }

      return res.status(HttpStatus.BAD_REQUEST).send({
        message: locals.something_went_wrong,
        success: false,
        data: null,
      });
    }
  }


  // @Post('addArea')
  // async addArea(@Body() dto: AddAreaDto,@Req() req: Request, @Res() res: Response): Promise<any> {
  // const locals = this.helperService.getLocaleMessages();

  //   try {
  //     const userData = await this.helperService.validateUser(req); // Implement this helper function
  //     const result = await this.journeyService.addArea(dto, userData._id);
  //     return res.status(HttpStatus.OK).send(result);
  //   } catch (err) {
  //     console.error(err);
  //     return res.status(HttpStatus.BAD_REQUEST).send({
  //       message: locals.something_went_wrong,
  //       success: false,
  //       data: null,
  //     });
  //   }
  // }

  @Post('areaAdd')
  async addArea(@Body() dto: AbundanceAreaDto | FocusAreaDto | ActionAreaDto, @Req() req: Request, @Res() res: Response): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    try {
      // Replace 'yourUserId' with actual user ID obtained from request or token
      // const userId = 'yourUserId';
      const userData = await this.helperService.validateUser(req);
      const result = await this.journeyService.addArea(dto, userData._id.toString());
      return res.status(HttpStatus.OK).send(result);
    } catch (err) {
      console.error(err);
      if (err instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).send({
          message: locals.user_not_found,
          success: false,
          data: null,
        });
      }
      return res.status(HttpStatus.BAD_REQUEST).send({
        message: locals.something_went_wrong,
        success: false,
        data: null,
      });
    }
  }


  @Get('focusAreaList/:abundanceAreaId')
  @UseGuards(ValidateTokenMiddleware) // Example of using a guard for token validation
  async listOfFocusArea(
    @Param('abundanceAreaId') abundanceAreaId: string,
    @Req() req: Request
  ): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    try {
      const userData = await this.helperService.validateUser(req);
      const dto: FocusAreaListDto = { abundanceAreaId };

      return await this.journeyService.listOfFocusArea(dto, userData._id.toString(), req);
    } catch (err) {
      console.error(err);
      return {
        message: locals.something_went_wrong,
        success: false,
        data: null,
      };
    }
  }

  @Get('actionAreaList/:focusAreaId')
  @UseGuards(ValidateTokenMiddleware)
  async listOfActionArea(
    @Param('focusAreaId') focusAreaId: string,
    @Req() req: Request
  ): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    try {
      const userData = await this.helperService.validateUser(req);
      const dto: ActionAreaListDto = { focusAreaId };

      return await this.journeyService.listOfActionArea(dto, userData._id.toString(), req);
    } catch (err) {
      console.error(err);
      return {
        message: locals.something_went_wrong,
        success: false,
        data: null,
      };
    }
  }


  @Post('add')
  @UseGuards(ValidateTokenMiddleware)
  async addJourney(@Body() dto: AddJourneyDto, @Req() req: Request): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    try {
      const userData = await this.helperService.validateUser(req);

      return await this.journeyService.addJourney(dto, userData._id.toString());
    } catch (err) {
      console.error(err);
      return {
        message: locals.something_went_wrong,
        success: false,
        data: null,
      };
    }
  }


  @Put('update')
  @UseGuards(ValidateTokenMiddleware)
  async editJourney(@Body() dto: EditJourneyDto, @Req() req: Request): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    try {
      const userData = await this.helperService.validateUser(req);

      return await this.journeyService.editJourney(dto);
    } catch (err) {
      console.error(err);
      return {
        message: locals.something_went_wrong,
        success: false,
        data: null,
      };
    }
  }

  @Delete('delete/:id')
  @UseGuards(ValidateTokenMiddleware)
  async deleteJourney(@Param('id') id: string, @Req() req: Request): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    try {
      const userData = await this.helperService.validateUser(req);

      return await this.journeyService.deleteJourney(id);
    } catch (err) {
      console.error(err);
      return {
        message: locals.something_went_wrong,
        success: false,
        data: null,
      };
    }
  }

  @Get('areaList')
  @UseGuards(ValidateTokenMiddleware)
  async listOfArea(@Req() req: Request): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    try {
      const userData = await this.helperService.validateUser(req);

      return await this.journeyService.listOfArea(userData._id.toString());
    } catch (err) {
      console.error(err);
      return {
        message: locals.something_went_wrong,
        success: false,
        data: null,
      };
    }
  }


  @Get('journeyList')
  @UseGuards(ValidateTokenMiddleware)
  async journeyListForUser(@Req() req: Request, @Query('status') status?: string): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    try {
      const userData = await this.helperService.validateUser(req);
      return await this.journeyService.journeyListForUser(userData._id.toString(), status);
    } catch (err) {
      console.error(err);
      return {
        message: locals.something_went_wrong,
        success: false,
        data: null,
      };
    }
  }


  @Get('/getJourneyListing')
  @UseGuards(ValidateTokenMiddleware)
  async getJourneyListing(@Query() dto: GetJourneyListingDto): Promise<any> {
    return await this.journeyService.getJourneyListing(dto);
  }


  @Post('/addMyThoughtsAndInspirations')
  @UseGuards(ValidateTokenMiddleware)
  async addStickyNotes(@Body() dto: AddStickyNotesDto, @Req() req: Request): Promise<any> {
    const userData = await this.helperService.validateUser(req);

    // const userId = req.user.id; // Assuming req.user contains the authenticated user's information
    return await this.journeyService.addStickyNotes(dto, userData._id.toString());
  }

  @Put('/updateMyThoughtsAndInspirations')
  @UseGuards(ValidateTokenMiddleware)
  async updateStickyNotes(@Body() dto: UpdateStickyNotesDto, @Res() res: Response): Promise<any> {
    try {
      const result = await this.journeyService.updateStickyNotes(dto);
      return res.status(200).send(result);
    } catch (err) {
      console.error(err);
      return res.status(200).send({
        message: err.message || 'Something went wrong',
        success: false,
        data: null,
      });
    }
  }

  @Delete('/deleteMyThoughtsAndInspirations/:id')
  @UseGuards(ValidateTokenMiddleware)
  async deleteStickyNotes(@Param('id') id: string, @Res() res: Response): Promise<any> {
    try {
      const result = await this.journeyService.deleteStickyNotes({ id });
      return res.status(HttpStatus.OK).send(result);
    } catch (err) {
      console.error(err);
      const locals = this.helperService.getLocaleMessages();
      return res.status(HttpStatus.BAD_REQUEST).send({
        message: err.message || locals.something_went_wrong,
        success: false,
        data: null,
      });
    }
  }


  @Get('/getMyThoughtsAndInspirations/:id')
  async getStickyNotesDetails(@Param() params: GetStickyNotesDetailsDto, @Res() res: Response) {
    try {
      const { id } = params;
      const isRecordExists = await this.journeyService.getStickyNotesDetails(id);

      return res.status(HttpStatus.OK).json({
        message: 'Successfully fetched sticky notes details',
        success: true,
        data: isRecordExists,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Record Not Found',
          success: false,
          data: null,
        });
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Something went wrong while fetching sticky notes details',
          success: false,
          data: null,
        });
      }
    }
  }

  // @Get('/getMyThoughtsAndInspirations/:id')
  // async getMyThoughtsAndInspirations(@Param('id') id: GetStickyNotesListingDto, @Res() res: Response): Promise<any> {
  //   try {
  //     const thought = await this.journeyService.getStickyNotesListing(id);
  //     return res.status(HttpStatus.OK).json(thought);
  //   } catch (err) {
  //     if (err instanceof NotFoundException) {
  //       return res.status(HttpStatus.NOT_FOUND).json({
  //         message: 'MyThoughtsAndInspirations not found',
  //         success: false,
  //         data: null,
  //       });
  //     }
  //     return res.status(HttpStatus.BAD_REQUEST).json({
  //       message: 'Something went wrong',
  //       success: false,
  //       data: null,
  //     });
  //   }
  // }


  @Post('getMyThoughtsAndInspirationsListing')
  @UseGuards(ValidateTokenMiddleware)
  async getStickyNotesListing(@Body() dto: GetStickyNotesListingDto, @Res() res: Response): Promise<any> {
    try {
      const result = await this.journeyService.getStickyNotesListing(dto);
      const locals = this.helperService.getLocaleMessages();
      return res.status(HttpStatus.OK).send({
        message: locals.sticky_notes_listing,
        success: true,
        data: result,
      });
    } catch (err) {
      console.error('Error in getStickyNotesListing:', err);
      const locals = this.helperService.getLocaleMessages();
      return res.status(HttpStatus.BAD_REQUEST).send({
        message: locals.something_went_wrong,
        success: false,
        data: null,
      });
    }
  }

  // @Post('/getMyThoughtsAndInspirationsListing')
  // async getStickyNotesListing(
  //   @Body(ValidationPipe) dto: GetStickyNotesListingDto,
  // ): Promise<any> {
  //   return await this.journeyService.getStickyNotesListing(dto);
  // }

  @Post('/getMyThoughtsAndInspirationsListing')
  async getMyThoughtsAndInspirationsListing(@Body('journeyId') journeyId: string, @Res() res: Response) {
    try {
      const { journalEntries, stickyNotes } = await this.journeyService.getMyThoughtsAndInspirationsListing(journeyId);
      return res.status(HttpStatus.OK).json({
        message: 'Successfully fetched thoughts and inspirations',
        success: true,
        data: { journalEntries, stickyNotes }
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Something went wrong while fetching thoughts and inspirations',
        success: false,
        data: null
      });
    }
  }


  // @UseGuards(JwtAuthGuard)
  // @Get('getTagListing/:journeyId')
  // async getTagListingByJourneyId(
  //   @Param('journeyId') journeyId: string,
  //   @Query('journeyGuideId') journeyGuideId: string,
  //   @Query('stageType') stageType: string,
  //   @Res() res: Response,
  // ) {
  //   try {
  //     console.log(`Journey ID: ${journeyId}`);
  //     console.log(`Journey Guide ID: ${journeyGuideId}`);
  //     console.log(`Stage Type: ${stageType}`);

  //     const tagListing = await this.journeyService.getTagListingByJourneyId(
  //       journeyId,
  //       journeyGuideId,
  //       stageType,
  //     );

  //     console.log('Tag Listing:', tagListing);

  //     return res.status(200).send({
  //       message: 'Successfully fetched tag listing',
  //       success: true,
  //       data: tagListing,
  //     });
  //   } catch (err) {
  //     console.error('Error:', err);
  //     return res.status(400).send({
  //       message: 'Something went wrong',
  //       success: false,
  //       data: null,
  //     });
  //   }
  // }
  @Get('/getTagListing/:journeyId')
  async getTagListingByJourneyId(
    @Param('journeyId') journeyId: string,
    @Query() query: GetTagListingDto,
  ): Promise<TagListingResponseDto> {
    try {
      const { journeyGuideId, stageType } = query;
      return await this.journeyService.getTagListingByJourneyId(journeyId, journeyGuideId, stageType);
    } catch (err) {
      console.error(err);
      throw new BadRequestException('Something went wrong');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getTagListing')
  async getTagListing(@Query() query: TagListingDto, @Req() req: any) {
    try {
      const userData = await this.helperService.validateUser(req);
      const result = await this.journeyService.getTagListing(userData, query);
      return result;
    } catch (err) {
      console.error('Error in getTagListing:', err.message);
      return {
        message: err.message || 'Something went wrong',
        success: false,
        data: null,
      };
    }
  }

  @Get(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getJourneyDetails(@Param() params: GetJourneyDetailsDto) {
    const locals = this.helperService.getLocaleMessages();
    try {
      const { id } = params;
      if (!id) {
        return {
          message: locals.enter_all_field,
          success: false,
          data: null,
        };
      }

      const data = await this.journeyService.getJourneyDetails(id);

      if (!data) {
        return {
          message: locals.record_not_found,
          success: false,
          data: null,
        };
      }

      return {
        message: locals.record_fetch,
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

  @Post('addJourneyGuide')
  async addJourneyGuide(@Body() dto: AddJourneyGuideDto, @Res() res: Response, @Req() req) {
    const result = await this.journeyService.addJourneyGuide(dto, req);
    if (result.success) {
      return res.status(200).send({
        message: result.message,
        success: true,
        data: null,
      });
    } else {
      return res.status(400).send({
        message: result.message,
        success: false,
        data: null,
      });
    }
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('/getJourneyGuideListing/:journeyId')
  // async getJourneyGuideListing(
  //   @Param('journeyId') journeyId: string,
  //   @Req() req: any, // Ensure req is properly typed as per your implementation
  // ) {
  //   try {
  //     const userData = await this.helperService.validateUser(req);
  //     const result = await this.journeyService.getJourneyGuideListing(journeyId, userData._id.toString());

  //     return {
  //       message: result.message,
  //       success: result.success,
  //       data: result.data,
  //     };
  //   } catch (err) {
  //     console.error(err); // Log the error for debugging
  //     return {
  //       message: err.message || 'Something went wrong',
  //       success: false,
  //       data: null,
  //     };
  //   }
  // }
  @UseGuards(JwtAuthGuard)
  @Get('getJourneyGuideListing/:journeyId')
  async getJourneyGuideListing(@Param('journeyId') journeyId: string, @Req() req: any) {
    const locals = this.helperService.getLocaleMessages();
    try {
      const userData = await this.helperService.validateUser(req);
      const result = await this.journeyService.getJourneyGuideListing(journeyId, userData._id.toString());
      return {
        message: result.message,
        success: result.success,
        data: result.data,
      };
    } catch (err) {
      console.error(`Error fetching journey guides for journeyId ${journeyId}:`, err);
      if (err instanceof NotFoundException) {
        throw new NotFoundException('No journey guides found');
      }
      throw new BadRequestException(locals.something_went_wrong);
    }
  }


  @UseGuards(JwtAuthGuard)
  @Get('getJourneyGuideDetails/:id')
  async getJourneyGuideDetails(
    @Param() params: GetJourneyGuideDetailsDto,
  ): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    try {
      const result = await this.journeyService.getJourneyGuideDetails(params.id);
      return {
        message: result.message,
        success: result.success,
        data: result.data,
      };
    } catch (err) {
      console.error(err); // Log the error for debugging purposes

      if (err instanceof BadRequestException) {
        throw new BadRequestException(err.message); // Handle bad request exceptions
      } else {
        throw new BadRequestException(locals.something_went_wrong); // Handle other unexpected errors
      }
    }
  }


  @UseGuards(JwtAuthGuard)
  @Delete('deleteJourneyGuide/:id')
  async deleteJourneyGuide(
    @Param() params: DeleteJourneyGuideDto,
  ): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    try {
      await this.journeyService.deleteJourneyGuide(params.id);
      return {
        message: locals.journey_guide_deleted,
        success: true,
        data: null,
      };
    } catch (err) {
      console.error(err); // Log the error for debugging purposes

      if (err instanceof BadRequestException) {
        throw new BadRequestException(err.message); // Handle bad request exceptions
      } else {
        throw new BadRequestException(locals.something_went_wrong); // Handle other unexpected errors
      }
    }
  }


  @Get('inspirationStageList/:journeyId/:journeyGuideId')
  async inspirationStageList(
    @Param() params: InspirationStageListDto,
  ): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    try {
      const result = await this.journeyService.inspirationStageList(params);
      return {
        message: result.message,
        success: result.success,
        data: result.data,
      };
    } catch (err) {
      console.error(err);
      throw new BadRequestException(locals.something_went_wrong);
    }
  }


  // @UseGuards(JwtAuthGuard)
  // @Post('/addInspiringMedia')
  // async addInspiringMedia(@Body() dto: AddInspiringMediaDto, @Req() req: Request): Promise<any> {
  //   const locals = this.helperService.getLocaleMessages();

  //   try {
  //     const userData = await this.helperService.validateUser(req);

  //     if (!userData) {
  //       throw new UnauthorizedException('User not authenticated');
  //     }

  //     dto.userId = userData._id.toString();

  //     await this.journeyService.addInspiringMedia(dto);

  //     return {
  //       message: locals.inspiring_media_created,
  //       success: true,
  //       data: null,
  //     };
  //   } catch (error) {
  //     console.error(error);
  //     throw new BadRequestException(locals.something_went_wrong);
  //   }
  // }



  @UseGuards(JwtAuthGuard)
  @Post('/addInspiringMedia')
  @UseInterceptors(FileInterceptor('document', {
    storage: diskStorage({
      destination: './uploads', // Adjust destination path as needed
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  async addInspiringMedia(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Req() req: Request
  ): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    try {
      const userData = await this.helperService.validateUser(req);

      if (!userData) {
        throw new UnauthorizedException('User not authenticated');
      }

      const { type, journeyId, journeyGuideId, inspiringMediaVideo, inspiringMediaImage, inspiringMediaAudio, tags, title } = body;

      if (![type, journeyId, title].every(Boolean)) {
        throw new BadRequestException(locals.enter_all_filed);
      }

      const dto: AddInspiringMediaDto = {
        type,
        journeyId,
        journeyGuideId,
        userId: userData._id.toString(),
        title,
        document: file ? file.path : (inspiringMediaVideo || inspiringMediaImage || inspiringMediaAudio || ''),
        tags: Array.isArray(tags) ? tags : [],
      };

      await this.journeyService.addInspiringMedia(dto);

      return {
        message: locals.inspiring_media_created,
        success: true,
        data: null,
      };
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException) {
        throw error; // Re-throw BadRequestException to handle it with NestJS's exception filter
      }
      throw new BadRequestException(locals.something_went_wrong);
    }
  }


  @UseGuards(ValidateTokenMiddleware) // Assuming middleware is implemented separately
  @Put('/updateInspiringMedia')
  async updateInspiringMedia(@Body() dto: UpdateInspiringMediaDto, @Req() req: Request): Promise<any> {
    const locals = this.helperService.getLocaleMessages();

    try {
      const userData = await this.helperService.validateUser(req);

      if (!userData) {
        throw new UnauthorizedException('User not authenticated');
      }

      const success = await this.journeyService.updateInspiringMedia(dto);

      if (!success) {
        throw new BadRequestException(locals.record_not_found);
      }

      return {
        message: locals.inspiring_media_updated,
        success: true,
        data: null,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(locals.something_went_wrong);
    }
  }


  @UseGuards(JwtAuthGuard)
  @Delete('deleteInspiringMedia/:id')
  async deleteInspiringMedia(
    @Param() params: DeleteInspiringMediaDto,
  ): Promise<any> {
    const locals = this.helperService.getLocaleMessages();
    try {
      await this.journeyService.deleteInspiringMedia(params.id);
      return {
        message: locals.inspiring_media_deleted,
        success: true,
        data: null,
      };
    } catch (err) {
      console.error(err); // Log the error for debugging purposes

      if (err instanceof BadRequestException) {
        throw new BadRequestException(err.message); // Handle bad request exceptions
      } else {
        throw new BadRequestException(locals.something_went_wrong); // Handle other unexpected errors
      }
    }
  }


  @UseGuards(ValidateTokenMiddleware) // Assuming middleware is implemented separately
  @Get('/getInspiringMedia/:id')
  async getInspiringMediaDetails(@Param('id') id: string, @Req() req: Request): Promise<any> {
    const locals = this.helperService.getLocaleMessages();

    try {
      const userData = await this.helperService.validateUser(req);

      if (!userData) {
        throw new UnauthorizedException('User not authenticated');
      }

      const detailsDto: GetInspiringMediaDetailsDto = { id };

      const isRecordExists = await this.journeyService.getInspiringMediaDetails(detailsDto);

      if (!isRecordExists) {
        throw new BadRequestException(locals.record_not_found);
      }

      return {
        message: locals.inspiring_media_details,
        success: true,
        data: isRecordExists,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(locals.something_went_wrong);
    }
  }


  //   @UseGuards(ValidateTokenMiddleware)
  // @Get('/getInspiringMediaListing/:journeyId')
  // async getInspiringMediaListing(
  //   @Param('journeyId') journeyId: string,
  //   @Query('journeyGuideId') journeyGuideId: string | undefined,
  //   @Query('stageType') stageType: string | undefined,
  //   @Req() req: Request,
  // ): Promise<any> {
  //   const locals = this.helperService.getLocaleMessages();

  //   try {
  //     const userData = await this.helperService.validateUser(req);

  //     if (!userData) {
  //       throw new UnauthorizedException('User not authenticated');
  //     }

  //     const dto: GetInspiringMediaListingDto = {
  //       journeyId,
  //       journeyGuideId,
  //       stageType,
  //     };

  //     const result = await this.journeyService.getInspiringMediaListing(dto);

  //     return result;
  //   } catch (error) {
  //     console.error(error);
  //     throw new BadRequestException(locals.something_went_wrong);
  //   }
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get('getInspiringMediaListing/:journeyId')
  // async getInspiringMediaListing(@Param('journeyId') journeyId: string, @Req() req: any) {
  //   const locals = this.helperService.getLocaleMessages();
  //   try {
  //     const userData = await this.helperService.validateUser(req);
  //     console.log('userData',userData);

  //     const result = await this.journeyService.getInspiringMediaListing(journeyId, userData._id.toString());
  //     return {
  //       message: result.message,
  //       success: result.success,
  //       data: result.data,
  //     };
  //   } catch (err) {
  //     console.error(`Error fetching journey guides for journeyId ${journeyId}:`, err);
  //     if (err instanceof NotFoundException) {
  //       throw new NotFoundException('No journey guides found');
  //     }
  //     throw new BadRequestException(locals.something_went_wrong);
  //   }
  // }

  @UseGuards(JwtAuthGuard)
  @Get('getInspiringMediaListing/:journeyId')
  async getInspiringMediaListing(
    @Param('journeyId') journeyId: string,
    @Query('journeyGuideId') journeyGuideId: string,
    @Query('stageType') stageType: string,
    @Req() req: any,
  ) {
    const locals = this.helperService.getLocaleMessages();
    try {
      const userData = await this.helperService.validateUser(req);
      if (!userData) {
        throw new BadRequestException('User not authenticated');
      }

      const result = await this.journeyService.getInspiringMediaListing(journeyId, journeyGuideId, stageType);

      return {
        message: result.message,
        success: result.success,
        data: result.data,
      };
    } catch (err) {
      console.error(`Error fetching inspiring media listing for journeyId ${journeyId}:`, err);
      if (err instanceof NotFoundException) {
        throw new NotFoundException('No inspiring media found');
      }
      throw new BadRequestException(locals.something_went_wrong);
    }
  }


  @Get('getQuotesListing')
  async getQuotesListing(req: any, res: any) {
    try {
      const result = await this.journeyService.getQuotesListing(req);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        message: 'Something went wrong',
        success: false,
        data: null,
      });
    }
  }

  @Post('addLink')
  async addLink(@Req() req: Request, @Res() res: Response, @Body() addLinkDto: AddLinkDto) {
    const locals = this.helperService.getLocaleMessages();

    try {
      const userData = await this.helperService.validateUser(req);
      if (!userData) {
        throw new BadRequestException('User not authenticated');
      }

      await this.journeyService.addLink(userData, addLinkDto);

      return res.status(200).send({
        message: locals.links_created,
        success: true,
        data: null,
      });
    } catch (err) {
      console.error('Something went wrong:', err);

      return res.status(400).send({
        message: locals.something_went_wrong,
        success: false,
        data: null,
      });
    }
  }

  @Put('updateLink')
  async updateLink(@Req() req: Request, @Res() res: Response, @Body() updateLinkDto: UpdateLinkDto) {
    const locals = this.helperService.getLocaleMessages();

    try {
      const userData = await this.helperService.validateUser(req);
      if (!userData) {
        throw new Error('User not authenticated');
      }

      const updatedLink = await this.journeyService.updateLink(userData, updateLinkDto);
      if (!updatedLink) {
        return res.status(200).send({
          message: locals.record_not_found,
          success: false,
          data: null,
        });
      }

      return res.status(200).send({
        message: locals.links_updated,
        success: true,
        data: null,
      });
    } catch (err) {
      return res.status(200).send({
        message: locals.something_went_wrong,
        success: false,
        data: null,
      });
    }
  }


  @Delete('deleteLink/:id')
  async deleteLink(@Param('id') id: string): Promise<{ message: string; success: boolean; data: null }> {
    const locals = this.helperService.getLocaleMessages();

    try {
      // Validate ID
      if (!id) {
        throw new BadRequestException('Link ID should not be empty');
      }

      // Delete link using service method
      const isDeleted = await this.journeyService.deleteLink({ id });

      if (!isDeleted) {
        return {
          message: locals.something_went_wrong,
          success: false,
          data: null,
        };
      }

      return {
        message: locals.links_deleted,
        success: true,
        data: null,
      };
    } catch (error) {
      console.error('Error deleting link:', error);
      return {
        message: locals.something_went_wrong,
        success: false,
        data: null,
      };
    }
  }


  @Get('getLink/:id')
  async getLinkDetails(@Param('id') id: string): Promise<{ message: string; success: boolean; data: any }> {
    const locals = this.helperService.getLocaleMessages();

    try {
      if (!id) {
        throw new BadRequestException('Link ID should not be empty');
      }

      const result = await this.journeyService.getLinkDetails({ id });

      return {
        message: result.success ? locals.links_details : locals.record_not_found,
        success: result.success,
        data: result.data,
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

  @Get('getLinkListing/:journeyId')
  async getLinkListing(@Param('journeyId') journeyId: string, @Query() query: GetLinkListingDto): Promise<{ message: string; success: boolean; data: any }> {
    const locals = this.helperService.getLocaleMessages();

    try {

      if (!journeyId) {
        return {
          message: locals.enter_all_filed,
          success: false,
          data: null,
        };
      }

      const dto: GetLinkListingDto = {
        journeyId,
        journeyGuideId: query.journeyGuideId,
        stageType: query.stageType,
      };

      const result = await this.journeyService.getLinkListing(dto);

      return {
        message: result.success ? locals.links_listing : locals.something_went_wrong,
        success: result.success,
        data: result.data,
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


  @Post('addDiscoveryGoal')
  async addDiscoveryGoal(
    @Req() req: Request,
    @Res() res: Response,
    @Body() addDiscoveryGoalDto: AddDiscoveryGoalDto,
  ) {
    const locals = this.helperService.getLocaleMessages();

    try {
      const userData = await this.helperService.validateUser(req);
      if (!userData) {
        throw new Error('User not authenticated');
      }

      addDiscoveryGoalDto.userId = userData._id.toString();

      await this.journeyService.addDiscoveryGoal(addDiscoveryGoalDto);

      return res.status(200).send({
        message: locals.discovery_goal_created,
        success: true,
        data: null,
      });
    } catch (err) {
      console.error('Error adding discovery goal:', err);

      return res.status(200).send({
        message: locals.something_went_wrong,
        success: false,
        data: null,
      });
    }
  }

  // @Put('updateDiscoveryGoal')
  // async updateDiscoveryGoal(@Body() updateDiscoveryGoalDto: UpdateDiscoveryGoalDto) {
  //   try {
  //     // Validate updateDiscoveryGoalDto here if needed

  //     await this.journeyService.updateDiscoveryGoal(updateDiscoveryGoalDto);

  //     return {
  //       message: 'Discovery goal updated successfully',
  //       success: true,
  //       data: null,
  //     };
  //   } catch (error) {
  //     console.error('Error updating discovery goal:', error);

  //     return {
  //       message: 'Something went wrong',
  //       success: false,
  //       data: null,
  //     };
  //   }
  // }

  @Put('updateDiscoveryGoal')
  async updateDiscoveryGoal(
    @Req() req: Request,
    @Res() res: Response,
    @Body() updateDiscoveryGoalDto: UpdateDiscoveryGoalDto,
  ) {
    const locals = this.helperService.getLocaleMessages();

    try {
      const userData = await this.helperService.validateUser(req);
      if (!userData) {
        throw new Error('User not authenticated');
      }

      const updatedGoal = await this.journeyService.updateDiscoveryGoal(updateDiscoveryGoalDto);

      if (!updatedGoal) {
        return res.status(200).send({
          message: locals.record_not_found,
          success: false,
          data: null,
        });
      }

      return res.status(200).send({
        message: locals.discovery_goal_updated,
        success: true,
        data: null,
      });
    } catch (err) {
      console.error('Error updating discovery goal:', err);

      return res.status(200).send({
        message: locals.something_went_wrong,
        success: false,
        data: null,
      });
    }
  }

  @Delete('deleteDiscoveryGoal/:id')
  async deleteDiscoveryGoal(
    @Req() req: Request,
    @Res() res: Response,
    @Param() params: DeleteDiscoveryGoalDto,
  ) {
    const locals = this.helperService.getLocaleMessages();

    try {
      const userData = await this.helperService.validateUser(req);
      if (!userData) {
        throw new Error('User not authenticated');
      }

      const deletedGoal = await this.journeyService.deleteDiscoveryGoal(params.id);

      if (!deletedGoal) {
        return res.status(200).send({
          message: locals.record_not_found,
          success: false,
          data: null,
        });
      }

      return res.status(200).send({
        message: locals.discovery_goal_deleted,
        success: true,
        data: null,
      });
    } catch (err) {
      console.error('Error deleting discovery goal:', err);

      return res.status(200).send({
        message: locals.something_went_wrong,
        success: false,
        data: null,
      });
    }
  }


  @Get('getDiscoveryGoal/:id')
  async getDiscoveryGoal(
    @Req() req: Request,
    @Res() res: Response,
    @Param() params: GetDiscoveryGoalDto,
  ) {
    const locals = this.helperService.getLocaleMessages();

    try {
      const userData = await this.helperService.validateUser(req);
      if (!userData) {
        throw new Error('User not authenticated');
      }

      const data = await this.journeyService.getDiscoveryGoal(params.id);

      if (!data) {
        return res.status(200).send({
          message: locals.record_not_found,
          success: false,
          data: null,
        });
      }

      return res.status(200).send({
        message: locals.discovery_goal_details,
        success: true,
        data: data,
      });
    } catch (err) {
      console.error('Error fetching discovery goal:', err);

      return res.status(400).send({
        message: locals.something_went_wrong,
        success: false,
        data: null,
      });
    }
  }


  @Get('getDiscoveryGoalListing/:journeyId')
  async getDiscoveryGoalListing(
    @Req() req: Request,
    @Res() res: Response,
    @Param() params: GetDiscoveryGoalListingDto,
  ) {
    const locals = this.helperService.getLocaleMessages();
    try {
      const result = await this.journeyService.getDiscoveryGoalListing(params.journeyId);

      if (result.success) {
        return res.status(200).send(result);
      } else {
        return res.status(404).send(result);
      }
    } catch (err) {
      console.error('Error fetching discovery goal listing:', err);
      return res.status(400).send({
        message: locals.something_went_wrong,
        success: false,
        data: null,
      });
    }
  }


  @Post('addVisionVideo')
  async addVisionVideo(
    @Body() addVisionVideoDto: AddVisionVideoDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const locals = this.helperService.getLocaleMessages();

    try {
      const userData = await this.helperService.validateUser(req);

      // Optionally, validate addVisionVideoDto here if needed

      const visionVideoData = {
        ...addVisionVideoDto,
        userId: userData._id, // Assign userId here
      };

      await this.journeyService.addVisionVideo(visionVideoData);

      return res.status(HttpStatus.OK).send({
        message: locals.vision_video_created,
        success: true,
        data: null,
      });
    } catch (err) {
      console.error('Error adding vision video:', err);
      return res.status(HttpStatus.BAD_REQUEST).send({
        message: locals.something_went_wrong,
        success: false,
        data: null,
      });
    }
  }

  @Put('/updateVisionVideo')
  async updateVisionVideo(@Req() req: Request, @Res() res: Response, @Body() updateVisionVideoDto: UpdateVisionVideoDto) {
    const locals = this.helperService.getLocaleMessages();
    try {
      const result = await this.journeyService.updateVisionVideo(req, updateVisionVideoDto);
      return res.status(200).json(result);
    } catch (err) {
      console.error('Error in updateVisionVideo controller:', err);
      return res.status(400).json({
        message: locals.something_went_wrong,
        success: false,
        data: null,
      });
    }
  }


  @Get('/getVisionVideoListing/:journeyId')
  async getVisionVideoListing(@Param('journeyId') journeyId: string, @Query() query: GetVisionVideoListingDto): Promise<{ message: string; success: boolean; data: any }> {
    const locals = this.helperService.getLocaleMessages();
    try {
      if (!journeyId) {
        return {
          message: locals.enter_all_filed,
          success: false,
          data: null,
        };
      }

      const dto: GetVisionVideoListingDto = {
        journeyId,
        journeyGuideId: query.journeyGuideId,
      };

      const result = await this.journeyService.getVisionVideoListing(dto);
      return {
        message: result.success ? locals.vision_video_listing : locals.something_went_wrong,
        success: result.success,
        data: result.data,
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


  @Post('/updateStageType')
  async updateStageType(@Res() res: Response): Promise<Response> {
    const locals = this.helperService.getLocaleMessages();
    try {
      const result = await this.journeyService.updateStageType();
      return res.status(HttpStatus.OK).json({
        message: locals.discovery_goal_listing,
        success: true,
        data: result.data,
        data1: result.data1,
        data2: result.data2,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: locals.something_went_wrong,
        success: false,
        data: null,
      });
    }
  }


  // @Get('/getInspiringImages/:journeyId')
  // @UseGuards(JwtAuthGuard)
  // async getInspiringImages(@Req() req: Request, @Param() params: GetInspiringImagesDto) {
  //   const locals = this.helperService.getLocaleMessages();
  //   try {
  //     const userData = await this.helperService.validateUser(req);
  //     const { journeyId } = params;
  //     if (![journeyId].every(Boolean)) {
  //       return {
  //         message: locals.enter_all_filed,
  //         success: false,
  //         data: null,
  //       };
  //     }
  //     const result = await this.journeyService.getInspiringImages(userData._id.toString(), journeyId);
  //     return {
  //       message: locals.record_fetch,
  //       success: true,
  //       data: result,
  //     };
  //   } catch (err) {
  //     console.error('Error fetching inspiring images:', err);
  //     return {
  //       message: locals.something_went_wrong,
  //       success: false,
  //       data: null,
  //     };
  //   }
  // }


  @Get('/getInspiringImages/:journeyId')
  @UseGuards(JwtAuthGuard)
  async getInspiringImages(@Req() req: Request, @Param() params: GetInspiringImagesDto) {
    const locals = this.helperService.getLocaleMessages();
    try {
      const userData = await this.helperService.validateUser(req);
      const { journeyId } = params;
      if (![journeyId].every(Boolean)) {
        return {
          message: locals.enter_all_filed,
          success: false,
          data: null,
        };
      }
      const result = await this.journeyService.getInspiringImages(userData._id.toString(), journeyId);

      return {
        message: result.length > 0 ? locals.record_fetch : locals.record_not_found,
        success: result.length > 0,
        data: result.length > 0 ? result : null,
      };
    } catch (err) {
      // console.error('Error fetching inspiring images:', err);
      return {
        message: err.message === 'Record Not Found' ? locals.record_not_found : locals.something_went_wrong,
        success: false,
        data: null,
      };
    }
  }


  // @Get('/getActionTypeListing')
  // @UseGuards(JwtAuthGuard) // Assuming you have a JwtAuthGuard defined
  // async getActionTypeListing(): Promise<GetActionTypeListingResponseDto> {
  //   try {
  //     const data = await this.journeyService.getActionTypeListing();
  //     return {
  //       message: 'Action type listing fetched successfully',
  //       success: true,
  //       data,
  //     };
  //   } catch (err) {
  //     console.error('Error fetching action type listing:', err);
  //     return {
  //       message: 'Something went wrong',
  //       success: false,
  //       data: null,
  //     };
  //   }
  // }


  @Post('/actionTypeAddUpdate')
  @UseGuards(JwtAuthGuard)
  async actionTypeAddUpdate(
    @Body() updateActionTypeDto: UpdateActionTypeDto,
  ): Promise<ActionTypeResponseDto> {
    const locals = this.helperService.getLocaleMessages();
    try {
      const data = await this.journeyService.actionTypeAddUpdate(updateActionTypeDto);
      return {
        message: locals.record_fetch,
        success: true,
        data,
      };
    } catch (err) {
      console.error('Error in actionTypeAddUpdate controller:', err);
      return {
        message: locals.something_went_wrong,
        success: false,
        data: null,
      };
    }
  }


  @Get('/getActionTypeListing')
  async getActionTypeListing(): Promise<{ message: string; success: boolean; data: ActionType[] }> {
    try {
      const actionTypes = await this.journeyService.getActionTypeListing();
      return {
        message: 'Action types fetched successfully',
        success: true,
        data: actionTypes,
      };
    } catch (err) {
      console.error('Error in getActionTypeListing controller:', err);
      throw new BadRequestException('Failed to fetch action types. Please try again later.');
    }
  }


  @Put('/updateSmartAction')
  @UseGuards(JwtAuthGuard)
  async updateSmartAction(@Body() dto: UpdateSmartActionDto) {
    return this.journeyService.updateSmartAction(dto);
  }


  @Put('/updateSmartActionCheckListStatus')
  @UseGuards(JwtAuthGuard) // Ensure authentication guard is correctly configured
  async updateSmartActionCheckListStatus(@Body() dto: UpdateSmartActionCheckListStatusDto) {
    return this.journeyService.updateSmartActionCheckListStatus(dto);
  }


  @Delete('/deleteSmartAction/:id')
  async deleteSmartAction(@Param('id') id: string, @Body() dto: DeleteSmartActionDto) {
    return this.journeyService.deleteSmartAction(id, dto);
  }

}
