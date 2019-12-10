import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Between, getConnection, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CarEntity } from './entity/car.entity';
import { CarsServiceInterface } from './interface/cars.service.interface';
import { OwnerEntity } from './entity/owner.entity';

@Injectable()
export class CarsService implements CarsServiceInterface {

  constructor(
    @InjectRepository(CarEntity)
    private carsRepository: Repository<CarEntity>,
  ) {
  }

  async create(carEntity: CarEntity): Promise<CarEntity> {
    const existingCar = await this.carsRepository.findOne({ where: { id: carEntity.id } });
    if (existingCar) {
      throw new HttpException('Car already exists', HttpStatus.CONFLICT);
    }
    await this.carsRepository.save(carEntity);
    return carEntity;
  }

  async getAll(): Promise<CarEntity[]> {
    return await this.carsRepository.find();
  }

  async get(carId: string): Promise<CarEntity> {
    const car = await this.carsRepository.findOne({ where: { id: carId } });
    if (!car) {
      throw new HttpException('Car was not found', HttpStatus.NOT_FOUND);
    }
    return car;
  }

  async update(carEntity: CarEntity): Promise<void> {
    await this.carsRepository.save(carEntity);
  }

  async delete(carEntity: CarEntity) {
    if (carEntity.owners !== undefined && carEntity.owners.length > 0) {
      throw new HttpException('Car has owners', HttpStatus.PRECONDITION_FAILED);
    }
    await this.carsRepository.remove(carEntity);
  }

  async toDiscount(): Promise<CarEntity[]> {
    return await this.carsRepository.find({
      discounted: false,
      firstRegistrationDate: Between(this.getStartDiscount(), this.getEndDiscount()),
    });
  }

  async toUndiscount(): Promise<CarEntity[]> {
    return await this.carsRepository.find({
      discounted: true,
      firstRegistrationDate: MoreThan(this.getEndDiscount()),
    });
  }

  async startDiscount(carEntity: CarEntity): Promise<void> {
    carEntity.price = carEntity.price * 0.8;
    carEntity.discounted = true;
    await this.carsRepository.save(carEntity);
  }

  async endDiscount(carEntity: CarEntity): Promise<void> {
    carEntity.price = carEntity.price / 0.8;
    carEntity.discounted = false;
    await this.carsRepository.save(carEntity);
  }

  async cleanupOwners(): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(OwnerEntity)
      .where('purchaseDate < :eighteenMonths', { eighteenMonths: this.getStartDiscount() })
      .execute();
  }

  private getStartDiscount(): Date {
    const startDiscount = new Date();
    startDiscount.setFullYear(startDiscount.getFullYear() - 1);
    startDiscount.setDate(startDiscount.getDate() - 180);
    return startDiscount;
  }

  private getEndDiscount(): Date {
    const endDiscount = new Date();
    endDiscount.setFullYear(endDiscount.getFullYear() - 1);
    return endDiscount;
  }
}
