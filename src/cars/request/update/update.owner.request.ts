import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOwnerRequest {

  @ApiProperty({ name: 'id', description: 'identifier of the owner' })
  id: string;

  @ApiPropertyOptional({ name: 'name', description: 'name' })
  name: string;
}
