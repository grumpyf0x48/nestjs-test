import { UpdateManufacturerRequest } from './update.manufacturer.request';
import { UpdateOwnerRequest } from './update.owner.request';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCarRequest {

  @ApiPropertyOptional({ name: 'manufacturer', description: 'manufacturer of the car', type: UpdateManufacturerRequest })
  manufacturer: UpdateManufacturerRequest;

  @ApiPropertyOptional({ name: 'owners', description: 'owners of the car', type: [UpdateOwnerRequest] })
  owners: UpdateOwnerRequest[];
}
