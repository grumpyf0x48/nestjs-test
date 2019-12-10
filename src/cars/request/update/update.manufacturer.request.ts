import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateManufacturerRequest {

  @ApiPropertyOptional({ name: 'name', description: 'name of the manufacturer' })
  name: string;

  @ApiPropertyOptional({ name: 'phone', description: 'phone number' })
  phone: string;

  @ApiPropertyOptional({ name: 'siret', description: 'siret number' })
  siret: number;
}
