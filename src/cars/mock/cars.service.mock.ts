import { CarsServiceInterface } from '../interface/cars.service.interface';
import { CarEntity } from '../entity/car.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

export class CarsServiceMock implements CarsServiceInterface {

  entities: CarEntity[];

  constructor() {
    this.entities = new Array();
  }

  async create(carEntity: CarEntity): Promise<CarEntity> {
    this.entities.push(carEntity);
    return carEntity;
  }

  async delete(carEntity: CarEntity): Promise<void> {
    const carId = carEntity.id;
    const index = this.findIndex(carId);
    if (index !== undefined) {
      this.entities = this.removeAt(index);
    }
  }

  async get(carId: string): Promise<CarEntity> {
    const index = this.findIndex(carId);
    if (index == undefined) {
      throw new HttpException('Car was not found', HttpStatus.NOT_FOUND);
    }
    return this.entities[index];
  }

  async getAll(): Promise<CarEntity[]> {
    return this.entities;
  }

  async update(carEntity: CarEntity): Promise<void> {
    const carId = carEntity.id;
    const index = this.findIndex(carId);
    this.entities[index] = carEntity;
  }

  async toDiscount(): Promise<CarEntity[]> {
    return [this.entities.find(carEntity => !carEntity.discounted)];
  }

  async toUndiscount(): Promise<CarEntity[]> {
    return [this.entities.find(carEntity => carEntity.discounted)];
  }

  async endDiscount(carEntity: CarEntity): Promise<void> {
    carEntity.price = carEntity.price / 0.8;
    carEntity.discounted = false;
  }

  async startDiscount(carEntity: CarEntity): Promise<void> {
    carEntity.price = carEntity.price * 0.8;
    carEntity.discounted = true;
  }

  async cleanupOwners(): Promise<void> {
    const carEntity = this.entities.find(carEntity => carEntity.owners !== undefined);
    carEntity.owners = [];
  }

  private findIndex(carId: string): number {
    for (let idx = 0; idx < this.entities.length; idx++) {
      const carEntity = this.entities[idx];
      if (carEntity.id == carId) {
        return idx;
      }
    }
    return undefined;
  }

  private removeAt(index: number): CarEntity[] {
    const newEntities: CarEntity[] = new Array();
    let newIndex = 0;
    for (let idx = 0; idx < this.entities.length; idx++) {
      if (idx != index) {
        newEntities[newIndex] = this.entities[idx];
        newIndex++;
      }
    }
    return newEntities;
  }
}
