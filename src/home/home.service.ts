import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/service/service.module';
import { HomeResponseDtos } from './dtos/home.dtos';

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  // returns a promise of type home-array
  async getAll(): Promise<HomeResponseDtos[]> {
    let homes = await this.prismaService.home.findMany();
    return homes.map((home) => new HomeResponseDtos(home));
  }

  async getByid(homeId: number) {
    const home = await this.prismaService.home.findUnique({
      where: {
        id: homeId,
      },
    });
    return home;
  }

  async create() {
    // find
    // if found throw error
    // if not found create
  }

  update() {
    // find
    // if not found throw error
    // if found update
  }

  delete() {
    // find
    // if not found throw error
    // if found delete
  }
}
