import { Owner } from '../interface/owner.interface';
import { ApiProperty } from '@nestjs/swagger';

export class GetOwnerResponse implements Owner {

  @ApiProperty({ name: 'id', description: 'identifier of the owner' })
  id: string;

  @ApiProperty({ name: 'name', description: 'name' })
  name: string;

  @ApiProperty({ name: 'purchaseDate', description: 'date of car purchase' })
  purchaseDate: string;
}
