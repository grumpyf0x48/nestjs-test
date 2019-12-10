import { CreateCarRequest } from '../request/create/create.car.request';
import { CarEntity } from '../entity/car.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateCarRequest } from '../request/update/updare.car.request';
import { CreateManufacturerRequest } from '../request/create/create.manufacturer.request';
import { ManufacturerEntity } from '../entity/manufacturer.entity';
import { UpdateManufacturerRequest } from '../request/update/update.manufacturer.request';
import { CreateOwnerRequest } from '../request/create/create.owner.request';
import { OwnerEntity } from '../entity/owner.entity';
import { UpdateOwnerRequest } from '../request/update/update.owner.request';

export class EntityFactory {

  static createCarEntity(createCarRequest: CreateCarRequest): CarEntity {
    const carEntity = new CarEntity();
    carEntity.id = EntityFactory.validateId(createCarRequest.id);
    carEntity.manufacturer = EntityFactory.createManufacturerEntity(createCarRequest.manufacturer);
    carEntity.price = createCarRequest.price;
    carEntity.firstRegistrationDate = EntityFactory.validateDate(createCarRequest.firstRegistrationDate);
    carEntity.owners = EntityFactory.createOwnersEntities(createCarRequest.owners);
    return carEntity;
  }

  static createManufacturerEntity(createManufacturerRequest: CreateManufacturerRequest): ManufacturerEntity {
    if (createManufacturerRequest === undefined) {
      throw new HttpException('Missing manufacturer', HttpStatus.BAD_REQUEST);
    }
    const manufacturerEntity = new ManufacturerEntity();
    manufacturerEntity.id = EntityFactory.validateId(createManufacturerRequest.id);
    manufacturerEntity.name = createManufacturerRequest.name;
    manufacturerEntity.phone = createManufacturerRequest.phone;
    manufacturerEntity.siret = createManufacturerRequest.siret;
    return manufacturerEntity;
  }

  static createOwnersEntities(createOwnerRequests: CreateOwnerRequest[]): OwnerEntity[] {
    if (createOwnerRequests === undefined) {
      return [];
    }
    const ownerEntities: OwnerEntity[] = new Array(createOwnerRequests.length);
    for (let index = 0; index < ownerEntities.length; index++) {
      ownerEntities[index] = this.createOwnerEntity(createOwnerRequests[index]);
    }
    return ownerEntities;
  }

  static createOwnerEntity(createOwnerRequest: CreateOwnerRequest): OwnerEntity {
    const ownerEntity: OwnerEntity = new OwnerEntity();
    ownerEntity.id = createOwnerRequest.id;
    ownerEntity.name = createOwnerRequest.name;
    ownerEntity.purchaseDate = new Date();
    return ownerEntity;
  }

  static updateCarEntity(carEntity: CarEntity, updateCarRequest: UpdateCarRequest): CarEntity {
    carEntity.manufacturer = EntityFactory.updateManufacturerEntity(carEntity.manufacturer, updateCarRequest.manufacturer);
    carEntity.owners = EntityFactory.updateOwnersEntities(carEntity.owners, updateCarRequest.owners);
    return carEntity;
  }

  static updateManufacturerEntity(manufacturerEntity: ManufacturerEntity, updateManufacturerRequest: UpdateManufacturerRequest): ManufacturerEntity {
    if (updateManufacturerRequest !== undefined) {
      if (updateManufacturerRequest.name) {
        manufacturerEntity.name = updateManufacturerRequest.name;
      }
      if (updateManufacturerRequest.phone) {
        manufacturerEntity.phone = updateManufacturerRequest.phone;
      }
      if (updateManufacturerRequest.siret) {
        manufacturerEntity.siret = updateManufacturerRequest.siret;
      }
    }
    return manufacturerEntity;
  }

  static updateOwnersEntities(ownerEntities: OwnerEntity[], updateOwnerRequests: UpdateOwnerRequest[]) {
    if (updateOwnerRequests === undefined) {
      return ownerEntities;
    }
    const newOwnerEntities: OwnerEntity[] = new Array(updateOwnerRequests.length);
    for (let index = 0; index < newOwnerEntities.length; index++) {
      newOwnerEntities[index] = this.updateOwnerEntity(ownerEntities, updateOwnerRequests[index]);
    }
    return newOwnerEntities;
  }

  static updateOwnerEntity(ownerEntities: OwnerEntity[], updateOwnerRequest: UpdateOwnerRequest) {
    const ownerEntity: OwnerEntity = EntityFactory.getOwnerEntity(ownerEntities, updateOwnerRequest.id);
    if (updateOwnerRequest.name) {
      ownerEntity.name = updateOwnerRequest.name;
    }
    return ownerEntity;
  }

  static getOwnerEntity(ownerEntities: OwnerEntity[], id: string): OwnerEntity {
    for (let index = 0; index < ownerEntities.length; index++) {
      const ownerEntity: OwnerEntity = ownerEntities[index];
      if (id === ownerEntity.id) {
        return ownerEntity;
      }
    }
    const newEntity = new OwnerEntity();
    newEntity.id = id;
    newEntity.purchaseDate = new Date();
    return newEntity;
  }

  static validateDate(date: string): Date {
    const parsedValue = Date.parse(date);
    if (isNaN(parsedValue)) {
      throw new HttpException('Invalid date', HttpStatus.BAD_REQUEST);
    }
    return new Date(parsedValue);
  }

  static validateId(id: string): string {
    if (id === undefined) {
      throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    }
    return id;
  }
}
