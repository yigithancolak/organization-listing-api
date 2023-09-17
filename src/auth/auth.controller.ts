import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req
} from '@nestjs/common'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { AuthService } from './auth.service'
import { Public } from './decorators/public.decorators'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async signIn(@Body() signInDto: { email: string; password: string }) {
    return await this.authService.signIn(signInDto.email, signInDto.password)
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto)
  }

  @Get('profile')
  getProfile(@Req() req) {
    return req.user
  }

  @Delete('profile')
  async deleteProfile(@Req() req) {
    const id = req.user.sub

    return await this.authService.deleteUser(id)
  }
}
