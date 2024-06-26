import { Body, Controller, Post, Req, Put, Param, Delete, Res, Get, Query, UnauthorizedException, UseGuards } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/middlewares/auth.guard';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.userService.signup(signupDto);
  }

  @Post('login')
  async login(@Req() req, @Body() loginDto: LoginDto) {
    return this.userService.login(req, loginDto);
  }

  @Post('newSignUp')
  async newSignup(@Req() req) {
    return this.userService.newSignUp(req);
  }

  @Post('userDetailsCheck')
  async checkUser(@Req() req) {
    return this.userService.checkUser(req);
  }

  @Post('verifyOtp')
  async verifyOtp(@Req() req) {
    return this.userService.verifyOtp(req);
  }

  @Post('sendOtp')
  async sendOtp(@Req() req) {
    return this.userService.sendOtp(req);
  }

  @Post('updatePassword')
  async updatePassword(@Req() req) {
    return this.userService.updatePassword(req);
  }
  
  @Post('checkPassword')
  async checkPassword(@Req() req) {
    return this.userService.checkPassword(req);
  }

  @Post('changePassword')
  async changePassword(@Req() req) {
    return this.userService.changePassword(req);
  }

  @Put('updateProfile')
  async updateProfile(@Req() req: any): Promise<any> {
    return this.userService.updateProfile(req);
  }

  @Post('logout')
  async logout(@Req() req: any, @Body() body: any) {
    return this.userService.logout(req);
  }

  @Delete('deleteAccount')
  async deleteAccount(@Body('deleteId') deleteId: string) {
    try {
      console.log(`Received userId: ${deleteId}`);
      const result = await this.userService.deleteUserAccount(deleteId);
      return result;
    } catch (error) {
      console.error(error);
      return { message: 'Something went wrong', success: false, data: null };
    }
  }

  @Post('refreshToken')
  async refreshToken(@Body('refreshToken') refreshToken: string): Promise<any> {
    return this.userService.refreshToken(refreshToken);
  }
  
  @Get('profileFetch')
  async profileFetch(@Req() req: any): Promise<any> {
    return this.userService.profileFetch(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('listForAdmin')
  async getUsersList(@Query() queryParams: any): Promise<any> {
    return this.userService.getUsersList(queryParams);
  }
}
