import { CarEntity } from '../entity/car.entity';
import { Car } from '../interface/car.interface';
import { GetCarResponse } from '../response/get.car.response';
import { ManufacturerEntity } from '../entity/manufacturer.entity';
import { Manufacturer } from '../interface/manufacturer.interface';
import { GetManufacturerResponse } from '../response/get.manufacturer.response';
import { OwnerEntity } from '../entity/owner.entity';
import { Owner } from '../interface/owner.interface';
import { GetOwnerResponse } from '../response/get.owner.response';

export class ResponseFactory {

  static createGetCarResponse(carEntity: CarEntity): Car {
    const getCarResponse = new GetCarResponse();
    getCarResponse.id = carEntity.id;
    getCarResponse.manufacturer = ResponseFactory.createGetManufacturerResponse(carEntity.manufacturer);
    getCarResponse.price = carEntity.price;
    getCarResponse.firstRegistrationDate = carEntity.firstRegistrationDate.toISOString();
    getCarResponse.owners = ResponseFactory.createGetOwnersResponse(carEntity.owners);
    return getCarResponse;
  }

  static createGetAllCarsResponse(carEntities: CarEntity[]): Car[] {
    const getAllCarsResponse: Car[] = new Array(carEntities.length);
    for (let index = 0; index < getAllCarsResponse.length; index++) {
      getAllCarsResponse[index] = this.createGetCarResponse(carEntities[index]);
    }
    return getAllCarsResponse;
  }

  static createGetManufacturerResponse(manufacturerEntity: ManufacturerEntity): Manufacturer {
    const getManufacturerResponse = new GetManufacturerResponse();
    getManufacturerResponse.id = manufacturerEntity.id;
    getManufacturerResponse.name = manufacturerEntity.name;
    getManufacturerResponse.phone = manufacturerEntity.phone;
    getManufacturerResponse.siret = manufacturerEntity.siret;
    return getManufacturerResponse;
  }

  static createGetOwnersResponse(ownerEntities: OwnerEntity[]): Owner[] {
    const getOwnersResponse: Owner[] = new Array(ownerEntities.length);
    for (let index = 0; index < getOwnersResponse.length; index++) {
      getOwnersResponse[index] = this.createGetOwnerResponse(ownerEntities[index]);
    }
    return getOwnersResponse;
  }

  static createGetOwnerResponse(ownerEntity: OwnerEntity): Owner {
    const getOwnerResponse = new GetOwnerResponse();
    getOwnerResponse.id = ownerEntity.id;
    getOwnerResponse.name = ownerEntity.name;
    getOwnerResponse.purchaseDate = ownerEntity.purchaseDate.toISOString();
    return getOwnerResponse;
  }
}
