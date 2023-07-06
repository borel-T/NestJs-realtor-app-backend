import { Injectable, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { PrismaService } from 'src/prisma/service/service.module';
import { CreateHomeDto, HomeResponseDtos } from './dtos/home.dtos';

interface FilterParams {
  city?: string;
  propertyType?: HouseType;
  price?: {
    gte?: number;
    lte?: number;
  };
}

interface CreateHomePayload {
  address: string;
  bedrooms: number;
  bathrooms: number;
  city: string;
  price: number;
  landSize: number;
  propertyType: HouseType;
  images: { url: string }[];
}

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  // returns a promise of type home-array
  async getAll(filters: FilterParams): Promise<HomeResponseDtos[]> {
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

  async getByid(homeId: number): Promise<HomeResponseDtos> {
    const home = await this.prismaService.home.findUnique({
      where: {
        id: homeId,
      },
    });
    console.log(home);
    return new HomeResponseDtos(home);
  }

  async create({
    address,
    city,
    price,
    propertyType,
    bathrooms,
    landSize,
    bedrooms,
    images,
  }: CreateHomePayload) {
    let home = await this.prismaService.home.create({
      data: {
        address,
        city,
        price,
        propertyType,
        bathrooms,
        bedrooms,
        land_size: landSize,
        realtor_id: 1,
      },
    });

    // makeup image list
    const imgList = images.map((img) => ({ ...img, home_id: home.id }));
    // save images
    await this.prismaService.image.createMany({
      data: imgList,
    });

    return new HomeResponseDtos(home);
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
