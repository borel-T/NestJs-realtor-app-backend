import {
  Controller,
  Post,
  Body,
  Param,
  ParseEnumPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, SigninDto, ProductKeyDto } from './dtos/auth.dtos';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup/:userType')
  async signup(
    @Body() body: SignupDto,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    // throw error: if user is not buyer
    if (userType !== UserType.BUYER) {
      if (!body.productKey) {
        throw new UnauthorizedException();
      }
      // else if user is realtor, check product key
      // create pdt key and compare with what is provided in payload
      const validPdtKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
      // now compare this key with user provided key
      const isValidProductKey = await bcrypt.compare(
        validPdtKey,
        body.productKey,
      );
      // throw error if not valid
      if (!isValidProductKey) {
        throw new UnauthorizedException();
      }
      // if valid create account
      return this.authService.signup(body, userType);
    }
  }

  @Post('/login')
  login(@Body() body: SigninDto) {
    return this.authService.login(body);
  }

  @Post('/key')
  generateProductKey(@Body() body: ProductKeyDto) {
    return this.authService.generateProductKey(body);
  }
}
