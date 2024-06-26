import { Controller, Post, Body, Headers, Req, Res, UnauthorizedException, BadRequestException, Get, HttpStatus, Delete, UseGuards, UseInterceptors, UploadedFiles, Put, NotFoundException, Param, ParseUUIDPipe, Query, ValidationPipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { LoginDto } from './dto/login.dto';
import { SetPasswordDto } from './dto/setpassword.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { SendOtpDto } from './dto/send-opt.dto';
import { LogoutDto } from './dto/logout.dto';
import { ChangePasswordDto } from './dto/changepassword.dto';
import { DeleteUserAccountDto } from './dto/delete-user-account.dto';
import { JwtAuthGuard } from 'src/middlewares/auth.guard';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddAbundanceAreaDto } from './dto/add-abundance-area.dto';
import { AbundanceArea } from 'src/databases/models/abundancearea.schema';
import { UpdateAbundanceAreaDto } from './dto/update-abundance-area.dto';
import { DeleteAbundanceAreaDto } from './dto/delete-abundancearea.dto';
import { GetAbundanceAreaDetailsDto } from './dto/get-abundance-area-details.dto';
import { Response } from 'express';
import { FocusArea } from 'src/databases/models/focusarea.schema';
import { ObjectId } from 'mongoose';
import { ActionArea } from 'src/databases/models/actionarea.schema';
import { UpdateActionAreaDto } from './dto/update-action-area.dto';
import { DeleteActionAreaDto } from './dto/delete-action-area.dto';
import { GetActionAreaListingDto } from './dto/getactionarea-listing.dto';
import { QuoteManagement } from 'src/databases/models/quote-management.schema';
import { JourneyInstruction } from 'src/databases/models/journeyInstruction.schema';
import { HelperService } from 'src/helpers/helper.service';
import { CreateSubAdminDto } from './dto/createsubadmin.dto';
import { Admin } from 'src/databases/models/admin.schema';
import { UpdateSubAdminDto } from './dto/update-subadmin.dto';
import { UpdateSubAdminStatusDto } from './dto/update-subadmin-ststus.dto';
import { DeleteSubAdminDto } from './dto/delete-subadmin.dto';
import { GetQuoteListDto } from './dto/get-quote-list.dto';

@Controller('admin')
export class AdminController {
  quoteManagementModel: any;
  constructor(private readonly adminService: AdminService, private readonly helperService: HelperService) {
  const locals = this.helperService.getLocaleMessages();
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.adminService.login(loginDto);
  }

  @Post('setPassword')
  async setPassword(@Body() setPasswordDto: SetPasswordDto) {
    return this.adminService.setPassword(setPasswordDto);
  }

  @Post('verifyOtp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.adminService.verifyOtp(verifyOtpDto);
  }

  @Post('sendOtp')
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.adminService.sendOtp(sendOtpDto);
  }
  
  @Post('updatePassword')
  async updatePassword(@Body('email') email: string, @Body('password') password: string) {
    return this.adminService.updatePassword(email, password);
  }

  // @Post('createSubAdmin')
  // async createSubAdmin(
  //   @Body() reqBody: { fullName: string; email: string; password: string },
  //   @Headers('authorization') authorization: string
  // ): Promise<{ message: string; success: boolean; data: null }> {
  // const locals = this.helperService.getLocaleMessages();

  //   try {
  //     const adminUserData = await this.helperService.validateAdminToken(authorization); // Pass authorization header to validateAdminToken
  //     const { fullName, email, password } = reqBody;
  //     if (![fullName, email, password].every(Boolean)) {
  //       return { message: locals.enter_all_field, success: false, data: null };
  //     }

  //     await this.adminService.createSubAdmin(fullName, email, password);

  //     // Send OTP logic (not implemented in this example)

  //     return { message: locals.subadmin_added, success: true, data: null };
  //   } catch (err) {
  //     if (err instanceof BadRequestException) {
  //       throw err; // Re-throw BadRequestException to let Nest handle it
  //     }
  //     return { message: locals.something_went_wrong, success: false, data: null };
  //   }
  // }


  @Post('createSubAdmin')
  async createSubAdmin(@Body() createSubAdminDto: CreateSubAdminDto): Promise<{ message: string; success: boolean; data: Admin }> {
    try {
      const result = await this.adminService.createSubAdmin(createSubAdminDto);
      return result;
    } catch (error) {
      throw new BadRequestException(error.message || 'Something went wrong');
    }
  }

  @Put('updateSubAdmin/:id')
  async updateSubAdmin(
    @Param('id') id: string,
    @Body() updateSubAdminDto: UpdateSubAdminDto,
  ): Promise<{ message: string; success: boolean; data: any }> {
    try {
      return await this.adminService.updateSubAdmin(id, updateSubAdminDto);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Something went wrong');
    }
  }


  @Get('getSubAdminDetails/:id')
  async getSubAdminDetails(@Param('id') id: string): Promise<{ message: string; success: boolean; data: any }> {
    try {
      return await this.adminService.getSubAdminDetails(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Unexpected error:', error);
      throw new BadRequestException('Something went wrong');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('getSubAdminUsers')
  async getSubAdminUsers(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search: string
  ): Promise<{ message: string; success: boolean; data: any; totalPages: number; count: number; perPageData: number }> {
    try {
      const pageNumber = parseInt(page) || 1;
      const limitNumber = parseInt(limit) || 10;
      return await this.adminService.getSubAdminUsers(pageNumber, limitNumber, search);
    } catch (error) {
      throw new BadRequestException(error.message || 'Something went wrong');
    }
  }


  @Put('updateSubAdminStatus/:id')
  @UseGuards(JwtAuthGuard)
  async updateSubAdminStatus(
    @Param('id') id: string,
    @Body() updateSubAdminStatusDto: UpdateSubAdminStatusDto,
  ): Promise<{ message: string; success: boolean }> {
    try {
      const result = await this.adminService.updateSubAdminStatus(id, updateSubAdminStatusDto);
      return result;
    } catch (error) {
      throw new BadRequestException(error.message || 'Something went wrong');
    }
  }

  @Delete('/deleteSubAdmin/:id')
  async deleteSubAdmin(@Param('id') id: string): Promise<{ message: string; success: boolean }> {
    try {
      const result = await this.adminService.deleteSubAdmin(id);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new BadRequestException('Something went wrong');
      }
    }
  }


  @Post('logout')
  async logout(@Req() req: any) {
    try {
      const authorizationHeader = req.headers.authorization;
      const result = await this.adminService.logout(authorizationHeader, req.body);
      if (!result.success) {
        throw new UnauthorizedException(result.message);
      }
      return result;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  @Post('generateTokenByRefreshToken')
  async generateTokenByRefreshToken(@Body('refreshToken') refreshToken: string): Promise<any> {
    try {
      const result = await this.adminService.generateTokenByRefreshToken(refreshToken);
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('changePassword')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Req() req: any) {
    try {
      const { newPassword, oldPassword } = changePasswordDto;
      const result = await this.adminService.changePassword(req, oldPassword, newPassword);
      return result; // Return the result directly if successful
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error; // Throw UnauthorizedException directly to maintain status code and message
      } else {
        throw error; // Throw any other errors as they are
      }
    }
  }

  @Get('dashboard')
  async list(@Res() res: any) {
    try {
      const result = await this.adminService.list();
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message || 'Something went wrong.',
        success: false,
        data: {},
      });
    }
  }

  @Post('addlink')
  async linkAddUpdate(@Req() req: any) {
    try {
      return await this.adminService.linkAddUpdate(req);
    } catch (error) {
      console.error('Error in linkAddUpdate:', error);
      throw new BadRequestException(error.message); // Let NestJS handle the error
    }
  }

  @Get('link')
  async linkGet() {
    try {
      return await this.adminService.linkget();
    } catch (error) {
      console.error('Error in linkGet:', error);
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('deleteUserAccount')
  async deleteAccount(@Body() deleteUserAccountDto: DeleteUserAccountDto) {
    try {
      console.log(`Received userId: ${deleteUserAccountDto.userId}`);
      const result = await this.adminService.deleteUserAccount(deleteUserAccountDto);
      return result;
    } catch (error) {
      console.error(error);
      return { message: 'Something went wrong', success: false, data: null };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('updateUser')
  @UseInterceptors(AnyFilesInterceptor())
  async updateUser(@Body() updateUserDto: UpdateUserDto, @UploadedFiles() files: any) {
    try {
      const result = await this.adminService.updateUser(updateUserDto, files);
      return result;
    } catch (error) {
      console.error(error);
      return { message: 'Something went wrong', success: false, data: null };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('addAbundanceArea')
  async addAbundanceArea(@Body() addAbundanceAreaDto: AddAbundanceAreaDto) {
    try {
      const result = await this.adminService.addAbundanceArea(addAbundanceAreaDto);
      return result;
    } catch (error) {
      console.error(error);
      return { message: 'Something went wrong', success: false, data: null };
    }
  }

  @Put('updateAbundanceArea')
  async updateAbundanceArea(
    @Req() req: Request,
    @Body() updateAbundanceAreaDto: UpdateAbundanceAreaDto
  ): Promise<{ message: string; success: boolean }> {
    const authorization = req.headers['authorization'];
    const { id, ...updateData } = updateAbundanceAreaDto;
    const result = await this.adminService.updateAbundanceArea(authorization, id, updateData);
    return { message: result.message, success: result.success };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('deleteAbundanceArea/:id')
  async deleteAbundanceArea(@Param() params: DeleteAbundanceAreaDto) {
    return this.adminService.deleteAbundanceArea(params.id);
  }

  // @Get('getAbundanceAreaDetails:id')
  // async getAbundanceAreaDetails(@Param('id') id: string, @Res() res: Response) {
  //   try {
  //     const result = await this.adminService.getAbundanceAreaDetails(id);
  //     if (!result.success) {
  //       return res.status(HttpStatus.OK).json({
  //         message: result.message,
  //         success: false,
  //         data: null,
  //       });
  //     }
  //     return res.status(HttpStatus.OK).json({
  //       message: result.message,
  //       success: true,
  //       data: result.data,
  //     });
  //   } catch (error) {
  //     console.error('Error in getAbundanceAreaDetails:', error);
  //     return res.status(HttpStatus.BAD_REQUEST).json({
  //       message: 'Something went wrong',
  //       success: false,
  //       data: null,
  //     });
  //   }
  // }

  @UseGuards(JwtAuthGuard)
  @Get('getAbundanceAreaDetails/:id')
  async getAbundanceAreaDetails(@Param() params: GetAbundanceAreaDetailsDto) {
    try {
      return this.adminService.getAbundanceAreaDetails(params.id);
    } catch (err) {
      console.error(`Controller Error: ${err.message}`);
      throw new BadRequestException('Something went wrong');
    }
  }

  @Get('getAbundanceAreaListing')
  async getAbundanceAreaListing(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('title') title: string,
  ) {
    try {
      const result = await this.adminService.getAbundanceAreaListing(page, limit, title);
      return result;
    } catch (err) {
      console.error('Error in getAbundanceAreaListing controller:', err);
      throw new Error('Something went wrong');
    }
  }

  @Post('addFocusArea')
  async addFocusArea(@Body() body: Partial<FocusArea>): Promise<{ message: string; success: boolean; data: null }> {
    try {
      const result = await this.adminService.addFocusArea(body);
      return { message: result.message, success: result.success, data: result.data };
    } catch (err) {
      console.error('Error in adding focus area:', err);
      throw new Error('Something went wrong');
    }
  }

  @Put('updateFocusArea')
  async updateFocusArea(@Body() body: { id: ObjectId; title: string; status: string; description?: string; helpText?: string }): Promise<{ message: string; success: boolean; data: null }> {
    try {
      const result = await this.adminService.updateFocusArea(body);
      return { message: result.message, success: result.success, data: result.data };
    } catch (err) {
      console.error('Error in updating focus area:', err);
      throw new Error('Something went wrong');
    }
  }


  // @Delete('deleteFocusArea/:id')
  // async deleteFocusArea(@Param('id') id: string): Promise<{ message: string; success: boolean; data: null }> {
  //   try {
  //     return await this.adminService.deleteFocusArea(id);
  //   } catch (err) {
  //     console.error('Error deleting focus area:', err);
  //     throw new Error('Something went wrong');
  //   }
  // }

  @UseGuards(JwtAuthGuard)
  @Delete('deleteFocusArea/:id')
  async deleteFocusArea(@Param() params: DeleteAbundanceAreaDto) {
    return this.adminService.deleteFocusArea(params.id);
  }


  @Get('getFocusAreaDetails/:id')
  async getFocusAreaDetails(@Param('id') id: string): Promise<{ message: string; success: boolean; data: any }> {
    try {
      return await this.adminService.getFocusAreaDetails(id);
    } catch (err) {
      console.error('Error fetching focus area details:', err);
      throw new Error('Something went wrong');
    }
  }

  @Get('getFocusAreaListing')
  async getFocusAreaListing(@Query() queryParams: any): Promise<any> {
    try {
      return await this.adminService.getFocusAreaListing(queryParams);
    } catch (err) {
      console.error('Error fetching focus area listing:', err);
      throw new Error('Something went wrong');
    }
  }

  @Post('addActionArea')
  async addActionArea(@Body() data: Partial<ActionArea>): Promise<{ message: string; success: boolean; data: null }> {
    try {
      return await this.adminService.addActionArea(data);
    } catch (err) {
      console.error('Error adding action area:', err);
      throw new Error('Something went wrong');
    }
  }


  // @Put('updateActionArea/:id')
  // async updateActionArea(@Body() data: Partial<ActionArea>, @Param('id') id: string): Promise<{ message: string; success: boolean; data: null }> {
  //   try {
  //     return await this.adminService.updateActionArea(id, data);
  //   } catch (err) {
  //     console.error('Error updating action area:', err);
  //     throw new Error('Something went wrong');
  //   }
  // }

  @Put('updateActionArea')
  async updateActionArea(@Body() updateActionAreaDto: UpdateActionAreaDto): Promise<{ message: string; success: boolean; data: null }> {
    try {
      return await this.adminService.updateActionArea(updateActionAreaDto);
    } catch (error) {
      console.error('Error updating action area:', error);
      throw new Error('Something went wrong');
    }
  }


  // @Delete('deleteActionArea/:id')
  // async deleteActionArea(@Param('id') id: string, @Res() res: Response): Promise<any> {
  //   try {
  //     const result = await this.adminService.deleteActionArea(id);
  //     return res.status(HttpStatus.OK).json(result);
  //   } catch (err) {
  //     return res.status(HttpStatus.BAD_REQUEST).json({
  //       message: 'Something went wrong',
  //       success: false,
  //       data: null,
  //     });
  //   }
  // }

  @UseGuards(JwtAuthGuard)
  @Delete('deleteActionArea/:id')
  async deleteActionArea(@Param() params: DeleteActionAreaDto) {
    return this.adminService.deleteActionArea(params.id);
  }


  @Get('getActionAreaDetails/:id')
  async getActionAreaDetails(@Param('id') id: string, @Res() res: Response): Promise<any> {
    try {
      const result = await this.adminService.getActionAreaDetails(id);
      return res.status(HttpStatus.OK).json(result);
    } catch (err) {
      console.error('Error fetching action area details:', err);
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Something went wrong',
        success: false,
        data: null,
      });
    }
  }

  @Get('getActionAreaListing')
  async getActionAreaListing(@Query() query: GetActionAreaListingDto, @Res() res: Response): Promise<any> {
    try {
      const result = await this.adminService.getActionAreaListing(query);
      return res.status(HttpStatus.OK).json(result);
    } catch (err) {
      console.error('Error in controller:', err); // Debugging line
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Something went wrong',
        success: false,
        data: null,
      });
    }
  }


  @Get('getUserListing')
  async getUserListing(@Res() res: Response): Promise<any> {
    try {
      const result = await this.adminService.getUserListing();
      return res.status(200).json(result);
    } catch (err) {
      console.error('Error in user listing controller:', err);
      return res.status(400).json({
        message: 'Something went wrong. Please try again.', // Replace with local messages
        success: false,
        data: null,
      });
    }
  }

  @Put('updateJourney')
  async updateJourney(@Body() body: any, @Res() res: Response): Promise<any> {
    try {
      const { id, ...updateDto } = body;
      const result = await this.adminService.updateJourney(id, updateDto);
      return res.status(200).json(result);
    } catch (err) {
      console.error('Error in journey update controller:', err);
      return res.status(200).json({
        message: 'Something went wrong. Please try again.', // Replace with local messages
        success: false,
        data: null,
      });
    }
  }

  @Get('journeyScreenAreas')
  async listOfArea(@Res() res: Response): Promise<any> {
    try {
      const result = await this.adminService.listOfArea();
      return res.status(200).json(result);
    } catch (err) {
      console.error('Error in fetching areas:', err);
      return res.status(200).json({
        message: 'Something went wrong. Please try again.', // Replace with local messages
        success: false,
        data: null,
      });
    }
  }

  // @Post('addUpdateQuote')
  // async quoteAddUpdate(@Body() body: QuoteManagement, @Res() res: Response): Promise<any> {
  //   try {
  //     const result = await this.adminService.quoteAddUpdate(body);
  //     return res.status(HttpStatus.OK).json({
  //       message: result.message,
  //       success: result.success,
  //       data: result.data,
  //     });
  //   } catch (err) {
  //     console.error('Error adding/updating quote:', err);
  //     return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
  //       message: 'Failed to add/update quote. Please try again later.',
  //       success: false,
  //       data: null,
  //     });
  //   }
  // }

  @Post('addUpdateQuote')
  async addUpdateQuote(@Body() body: any, @Res() res: Response): Promise<any> {
    try {
      const result = await this.adminService.quoteAddUpdate(body);
      return res.status(HttpStatus.OK).json({
        message: result.message,
        success: result.success,
        data: result.data,
      });
    } catch (err) {
      console.error('Error adding/updating quote:', err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to add/update quote. Please try again later.',
        success: false,
        data: null,
      });
    }
  }

  // @Get('getQuote/:areaId')
  // async quoteListbyAreaId(
  //   @Param('areaId') areaId: string,
  //   @Res() res: Response,
  //   @Query('page') page: number = 1,
  //   @Query('limit') limit: number = 10,
  //   @Query('status') status?: string,
  //   @Query('quote') quote?: string,
  // ): Promise<any> {
  //   try {
  //     const quotes = await this.adminService.quoteListbyAreaId(areaId, page, limit, status, quote);
      
  //     return res.status(HttpStatus.OK).json({
  //       message: 'Record fetched successfully.',
  //       success: true,
  //       page: quotes.page,
  //       limit: quotes.limit,
  //       totalItems: quotes.totalItems,
  //       totalPages: quotes.totalPages,
  //       data: quotes.data,
  //     });
  //   } catch (err) {
  //     console.error('Error fetching quotes:', err);
  //     return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
  //       message: 'Failed to fetch quotes. Please try again later.',
  //       success: false,
  //       data: null,
  //     });
  //   }
  // }
  
  @Get('getQuote/:areaId')
  async quoteListByAreaId(
    @Param('areaId') areaId: string,
    @Query() dto: GetQuoteListDto,
  ): Promise<any> {
    const { page, limit, status, quote } = dto;
    return await this.adminService.quoteListByAreaId(areaId, page, limit, dto);
  }
  

  @Post('configKey')
  async configKey(@Body('keyId') keyId: string): Promise<any> {
    try {
      const configResponse = await this.adminService.configKey(keyId);
      return configResponse;
    } catch (err) {
      console.error('Error in fetching configuration details:', err);
      return {
        message: 'Failed to fetch configuration details. Please try again later.',
        success: false,
        data: null,
      };
    }
  }

  // @Post('addJourneyInstruction')
  // async addJourneyInstruction(
  //   @Body('instruction') instruction: string,
  //   @Body('title') title: string,
  //   @Body('id') id?: string, // id is now a required parameter
  //   @Res() res: Response,
  // ): Promise<any> {
  //   try {
  //     const result = await this.adminService.addJourneyInstruction(instruction, title, id);
  //     return res.status(HttpStatus.OK).json(result);
  //   } catch (err) {
  //     console.error('Error in addJourneyInstruction controller:', err);
  //     return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
  //       message: 'Something went wrong. Please try again.',
  //       success: false,
  //       data: null,
  //     });
  //   }
  // }

  @Post('addJourneyInstruction')
  async addJourneyInstruction(
    @Body() instructionData: JourneyInstruction,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const result = await this.adminService.addJourneyInstruction(instructionData);
      return res.status(HttpStatus.OK).json(result);
    } catch (err) {
      console.error('Error in addJourneyInstruction controller:', err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Something went wrong. Please try again.',
        success: false,
        data: null,
      });
    }
  }

  @Get('listJourneyInstruction')
  async listJourneyInstruction(@Res() res: Response): Promise<any> {
    try {
      const result = await this.adminService.listJourneyInstruction();
      return res.status(200).json(result);
    } catch (err) {
      console.error('Error in listJourneyInstruction controller:', err);
      return res.status(500).json({
        message: 'Something went wrong. Please try again.',
        success: false,
        data: null,
      });
    }
  }

  @Put('updateProfileImage/:id')
  async updateProfileImage(
    @Param('id') id: string,
    @Body('profileImage') avatar: string,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const result = await this.adminService.updateProfileImage(id, avatar);
      return res.status(HttpStatus.OK).json(result);
    } catch (err) {
      console.error('Error in updateProfileImage controller:', err);
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Something went wrong. Please try again.',
        success: false,
        data: null,
      });
    }
  }
}
