import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/service/service.module';
import { User, UserType } from '@prisma/client';
const jwt = require('jsonwebtoken');
import * as bcrypt from 'bcryptjs';

interface SignupParams {
  email: string;
  password: string;
  name: string;
  phone: string;
}
interface LoginParams {
  email: string;
  password: string;
}
interface GenKeyParams {
  email: string;
  userType: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signup(
    { email, name, phone, password }: SignupParams,
    userType: UserType,
  ) {
    // check user existence
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (userExists) {
      throw new ConflictException();
    }
    // hashing password
    const hashed = await bcrypt.hash(password, 10);
    // save user
    const newUser = await this.prismaService.user.create({
      data: {
        name,
        phone,
        email,
        password: hashed,
        userType: userType,
      },
    });
    //generate jw-token
    console.log(process.env.JSON_TOKEN_KEY);
    const token = await this.generateJWT(name, newUser.id);
    return token;
  }

  async login({ email, password }: LoginParams) {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    // check user existence
    if (!user) {
      throw new HttpException('user not found', 400);
    }

    // check user password match
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      const token = await this.generateJWT(user.name, user.id);
      console.log(token);
      return token;
    } else {
      throw new HttpException('password do not match', 400);
    }
  }

  private async generateJWT(name: string, id: number) {
    return jwt.sign(
      {
        name,
        id,
      },
      process.env.JSON_TOKEN_KEY,
      { expiresIn: 360000 },
    );
  }

  async generateProductKey({ email, userType }: GenKeyParams) {
    let toBeHashed = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
    let hashedKey = await bcrypt.hash(toBeHashed, 10);
    return hashedKey;
  }
}
