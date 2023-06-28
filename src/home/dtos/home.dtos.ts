import { HouseType } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class HomeDtos {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsNotEmpty()
  bedrooms: number;

  @IsNumber()
  @IsNotEmpty()
  bathrooms: number;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  land_size: number;

  @IsEnum(HouseType)
  @IsNotEmpty()
  propertyType: string;

  @IsArray()
  images: string[];
}

export class HomeResponseDtos {
  id: number;
  address: string;
  bedrooms: number;
  bathrooms: number;
  city: string;

  price: number;
  propertyType: HouseType;

  // class transformer decorators
  @Exclude()
  listed_date: Date;

  @Expose({ name: 'listedDate' })
  listedDate() {
    return this.listed_date;
  }

  @Exclude()
  land_size: number;

  @Expose({ name: 'landSize' })
  landSize() {
    return this.land_size;
  }

  @Exclude()
  realtor_id: number;

  // since not all fields are mandatory
  // we'll have a constructor consider partial props
  constructor(partial: Partial<HomeResponseDtos>) {
    Object.assign(this, partial);
  }
}
