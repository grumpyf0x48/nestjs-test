import { ApiProperty } from '@nestjs/swagger';

export class CreateOwnerRequest {

  @ApiProperty({ name: 'id', description: 'identifier of the owner' })
  id: string;

  @ApiProperty({ name: 'name', description: 'name' })
  name: string;
}
