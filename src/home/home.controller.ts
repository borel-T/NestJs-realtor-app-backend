import { Controller, Query, Get, Post, Put, Delete } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeResponseDtos } from './dtos/home.dtos';
import { HouseType } from '@prisma/client';

@Controller('homes')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getHomes(
    @Query('city') city: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: HouseType,
  ): Promise<HomeResponseDtos[]> {
    console.log('query params', city);
    // priceFilter
    const priceFilter =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
          }
        : undefined;
    // search filters
    const filters = {
      ...(city && { city }),
      ...(propertyType && { propertyType }),
      ...(priceFilter && { price: priceFilter }),
    };
    // controller
    return this.homeService.getAll(filters);
  }

  @Get('/:id')
  getHomeById() {
    return this.homeService.getByid;
  }

  @Post()
  createHome() {
    return this.homeService.create();
  }

  @Put('/:homeId')
  updateHome() {
    return this.homeService.update();
  }

  @Delete('/:homeId')
  deleteHome() {
    return this.homeService.delete();
  }
}
