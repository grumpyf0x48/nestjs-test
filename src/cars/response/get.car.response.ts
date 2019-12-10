import { Car } from '../interface/car.interface';
import { Manufacturer } from '../interface/manufacturer.interface';
import { Owner } from '../interface/owner.interface';
import { ApiProperty } from '@nestjs/swagger';
import { GetOwnerResponse } from './get.owner.response';
import { GetManufacturerResponse } from './get.manufacturer.response';

export class GetCarResponse implements Car {

  @ApiProperty({ name: 'id', description: 'identifier of the car' })
  id: string;

  @ApiProperty({ name: 'manufacturer', description: 'manufacturer of the car', type: GetManufacturerResponse })
  manufacturer: Manufacturer;

  @ApiProperty({ name: 'price', description: 'current price' })
  price: number;

  @ApiProperty({ name: 'firstRegistrationDate', description: 'date of first registration' })
  firstRegistrationDate: string;

  @ApiProperty({ name: 'owners', description: 'owners of the car', type: [GetOwnerResponse] })
  owners: Owner[];
}
