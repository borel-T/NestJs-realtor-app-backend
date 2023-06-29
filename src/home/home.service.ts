import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/service/service.module';
import { HomeResponseDtos } from './dtos/home.dtos';

interface filterParams {
  city?: string;
  propertyType?: HouseType;
  price?: {
    gte?: number;
    lte?: number;
  };
}

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  // returns a promise of type home-array
  async getAll(filters: filterParams): Promise<HomeResponseDtos[]> {
    let homes = await this.prismaService.home.findMany({
      select: {
        id: true,
        address: true,
        city: true,
        price: true,
        propertyType: true,
        realtor_id: true,
        bathrooms: true,
        bedrooms: true,
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
      where: {
        ...filters,
        // city: 'Douala',
        // propertyType: 'RESIDENTIAL',
        // price: { gte: 1000, lte: 3000000 },
      },
    });
    if (!homes.length) {
      throw new NotFoundException();
    }
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
import { HouseType } from '@prisma/client';
