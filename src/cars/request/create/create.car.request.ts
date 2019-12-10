import { CreateManufacturerRequest } from './create.manufacturer.request';
import { CreateOwnerRequest } from './create.owner.request';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCarRequest {

  @ApiProperty({ name: 'id', description: 'identifier of the car' })
  id: string;

  @ApiProperty({ name: 'manufacturer', description: 'manufacturer of the car', type: CreateManufacturerRequest })
  manufacturer: CreateManufacturerRequest;

  @ApiProperty({ name: 'price', description: 'current price' })
  price: number;

  @ApiProperty({ name: 'firstRegistrationDate', description: 'date of first registration (ISO 8601)' })
  firstRegistrationDate: string;

  @ApiPropertyOptional({ name: 'owners', description: 'owners of the car', type: [CreateOwnerRequest] })
  owners: CreateOwnerRequest[];
}
