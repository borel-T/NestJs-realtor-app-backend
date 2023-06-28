import { Controller, Get, Post, Put, Delete } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeResponseDtos } from './dtos/home.dtos';

@Controller('homes')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getHomes(): Promise<HomeResponseDtos[]> {
    return this.homeService.getAll();
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
