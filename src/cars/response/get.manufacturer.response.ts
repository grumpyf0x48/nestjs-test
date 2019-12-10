import { Manufacturer } from '../interface/manufacturer.interface';
import { ApiProperty } from '@nestjs/swagger';

export class GetManufacturerResponse implements Manufacturer {

  @ApiProperty({ name: 'id', description: 'identifier of the manufacturer' })
  id: string;

  @ApiProperty({ name: 'name', description: 'name' })
  name: string;

  @ApiProperty({ name: 'phone', description: 'phone number' })
  phone: string;

  @ApiProperty({ name: 'siret', description: 'siret number' })
  siret: number;
}
