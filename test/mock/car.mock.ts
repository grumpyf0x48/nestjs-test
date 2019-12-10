import { ManufacturerMock } from './manufacturer.mock';
import { OwnerMock } from './owner.mock';

export class CarMock {
  id: string;
  manufacturer: ManufacturerMock;
  price: number;
  firstRegistrationDate: Date;
  owners: OwnerMock[];
}
