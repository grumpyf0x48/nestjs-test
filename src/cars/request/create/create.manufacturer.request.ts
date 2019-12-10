import { ApiProperty } from '@nestjs/swagger';

export class CreateManufacturerRequest {

  @ApiProperty({ name: 'id', description: 'identifier of the manufacturer' })
  id: string;

  @ApiProperty({ name: 'name', description: 'name' })
  name: string;

  @ApiProperty({ name: 'phone', description: 'phone number' })
  phone: string;

  @ApiProperty({ name: 'siret', description: 'siret number' })
  siret: number;
}
