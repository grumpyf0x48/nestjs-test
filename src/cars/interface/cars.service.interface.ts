import { CarEntity } from '../entity/car.entity';

export interface CarsServiceInterface {

  create(carEntity: CarEntity): Promise<CarEntity>;

  getAll(): Promise<CarEntity[]>;

  get(carId: string): Promise<CarEntity>;

  update(carEntity: CarEntity): Promise<void>;

  delete(carEntity: CarEntity): Promise<void>;

  toDiscount(): Promise<CarEntity[]>;

  toUndiscount(): Promise<CarEntity[]>;

  startDiscount(carEntity: CarEntity): Promise<void>;

  endDiscount(carEntity: CarEntity): Promise<void>;

  cleanupOwners(): Promise<void>;
}
