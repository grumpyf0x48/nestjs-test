import { Manufacturer } from './manufacturer.interface';

export interface Car {
  id: string;
  manufacturer: Manufacturer;
  price: number;
  firstRegistrationDate: string;
}
