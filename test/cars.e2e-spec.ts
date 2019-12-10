import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { CarsService } from '../src/cars/cars.service';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { CarsController } from '../src/cars/cars.controller';
import { UpdateCarRequest } from '../src/cars/request/update/updare.car.request';
import { CreateCarRequest } from '../src/cars/request/create/create.car.request';
import { CarMock } from './mock/car.mock';
import { ManufacturerMock } from './mock/manufacturer.mock';
import { CreateManufacturerRequest } from '../src/cars/request/create/create.manufacturer.request';
import { UpdateManufacturerRequest } from '../src/cars/request/update/update.manufacturer.request';
import { CreateOwnerRequest } from '../src/cars/request/create/create.owner.request';
import { OwnerMock } from './mock/owner.mock';
import { ErrorMock } from './mock/error.mock';

describe('CarsController (e2e)', () => {
  let application: INestApplication;

  const URL = '/cars';

  // Happy path request (POST)
  const createManufacturerReq = new CreateManufacturerRequest();
  createManufacturerReq.id = 'Manufacturer1';
  createManufacturerReq.name = 'Manufacturer Enterprises';
  createManufacturerReq.phone = '+33 1 47 ...';
  createManufacturerReq.siret = 123456;

  const validCreateCarReq = new CreateCarRequest();
  validCreateCarReq.id = 'Car1';
  validCreateCarReq.manufacturer = createManufacturerReq;
  validCreateCarReq.price = 25000;
  validCreateCarReq.firstRegistrationDate = '2019-11-25T15:22:00.000Z';

  const createOwnerReq = new CreateOwnerRequest();
  createOwnerReq.id = 'Owner1';
  createOwnerReq.name = 'Happy Owner1';
  validCreateCarReq.owners = [createOwnerReq];

  // Error requests (POST)
  // Invalid date: month=13
  const invalidDateCreateCarReq = new CreateCarRequest();
  invalidDateCreateCarReq.id = 'Car1';
  invalidDateCreateCarReq.manufacturer = createManufacturerReq;
  invalidDateCreateCarReq.price = 25000;
  invalidDateCreateCarReq.firstRegistrationDate = '2019-13-25T15:22:00.000Z';
  invalidDateCreateCarReq.owners = [];

  // Invalid car id
  const createCarReqInvalidId = new CreateCarRequest();

  // No Manufacturer
  const createCarReqNoManufacturer = new CreateCarRequest();
  createCarReqNoManufacturer.id = 'Car1';
  createCarReqNoManufacturer.price = 25000;
  createCarReqNoManufacturer.firstRegistrationDate = '2019-11-25T15:22:00.000Z';

  // Invalid manufacturer id
  const createCarReqInvalidManufacturerId = new CreateCarRequest();
  createCarReqInvalidManufacturerId.id = 'Car1';
  createCarReqInvalidManufacturerId.manufacturer = new CreateManufacturerRequest();

  // Happy path expected response (GET)
  const getCarRes = computeGetCarResponse('Car1');
  const getCar2Res = computeGetCarResponse('Car2');

  // Happy path requests (PUT)
  const updateCarReq = new UpdateCarRequest();
  const updateManufacturerReq = new UpdateManufacturerRequest();
  updateManufacturerReq.name = 'Vendor Enterprises';
  updateManufacturerReq.phone = '+33 1 42 ...';
  updateManufacturerReq.siret = 123456;
  updateCarReq.manufacturer = updateManufacturerReq;
  updateCarReq.owners = undefined;

  // Error requests (PUT)
  const updateCarReqWithoutManufacturer = new UpdateCarRequest();
  updateCarReqWithoutManufacturer.owners = undefined;

  // Happy path expected response (PUT)
  const updateCarRes = computeGetCarResponse('Car2');

  const carsService = {
    create: () => getCar2Res,
    getAll: () => [getCarRes, getCar2Res],
    get: () => getCar2Res,
    update: () => updateCarRes,
    delete: () => {
    },
  };

  // Expected error responses (GET, PUT, DELETE)
  const invalidIdRes = new ErrorMock(HttpStatus.BAD_REQUEST, 'Invalid id');

  // Expected error responses (POST)
  const invalidDateRes = new ErrorMock(HttpStatus.BAD_REQUEST, 'Invalid date');

  // Expected error responses (POST)
  const noManufacturerRes = new ErrorMock(HttpStatus.BAD_REQUEST, 'Missing manufacturer');

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      controllers: [CarsController],
      providers: [CarsService],
    })
      .overrideProvider(CarsService)
      .useValue(carsService)
      .compile();

    application = testingModule.createNestApplication();
    await application.init();
  });

  it('/cars (POST)', () => {
    return request(application.getHttpServer())
      .post(URL)
      .send(validCreateCarReq)
      .expect(HttpStatus.CREATED)
      .expect(JSON.stringify(carsService.create()));
  });

  it('/cars (POST) should return invalid id when no car id is given', () => {
    return request(application.getHttpServer())
      .post(URL)
      .send(createCarReqInvalidId)
      .expect(HttpStatus.BAD_REQUEST)
      .expect(JSON.stringify(invalidIdRes));
  });

  it('/cars (POST) should return no manufacturer when no car manufacturer is given', () => {
    return request(application.getHttpServer())
      .post(URL)
      .send(createCarReqNoManufacturer)
      .expect(HttpStatus.BAD_REQUEST)
      .expect(JSON.stringify(noManufacturerRes));
  });

  it('/cars (POST) should return invalid id when no manufacturer id is given', () => {
    return request(application.getHttpServer())
      .post(URL)
      .send(createCarReqInvalidManufacturerId)
      .expect(HttpStatus.BAD_REQUEST)
      .expect(JSON.stringify(invalidIdRes));
  });

  it('/cars (POST) should return invalid date when firstRegistrationDate is not parsable', () => {
    return request(application.getHttpServer())
      .post(URL)
      .send(invalidDateCreateCarReq)
      .expect(HttpStatus.BAD_REQUEST)
      .expect(JSON.stringify(invalidDateRes));
  });

  it('/cars (GET)', () => {
    return request(application.getHttpServer())
      .get(URL)
      .expect(HttpStatus.OK)
      .expect(JSON.stringify(carsService.getAll()));
  });

  it('/cars/Car2 (GET)', () => {
    return request(application.getHttpServer())
      .get(URL + '/Car2')
      .expect(HttpStatus.OK)
      .expect(JSON.stringify(carsService.get()));
  });

  it('/cars/Car2/manufacturer (GET)', () => {
    return request(application.getHttpServer())
      .get(URL + '/Car2/manufacturer')
      .expect(HttpStatus.OK)
      .expect(JSON.stringify(carsService.get().manufacturer));
  });

  it('/cars/Car2 (PUT)', () => {
    return request(application.getHttpServer())
      .put(URL + '/Car2')
      .send(updateCarReq)
      .expect(HttpStatus.OK)
      .expect(JSON.stringify(carsService.update()));
  });

  it('/cars/Car2 (PUT) without manufacturer', () => {
    return request(application.getHttpServer())
      .put(URL + '/Car2')
      .send(updateCarReqWithoutManufacturer)
      .expect(HttpStatus.OK)
      .expect(JSON.stringify(carsService.update()));
  });

  it('/cars/Car2 (DELETE)', () => {
    return request(application.getHttpServer())
      .delete(URL + '/Car2')
      .expect(HttpStatus.NO_CONTENT);
  });
});

function computeGetCarResponse(id: string): CarMock {
  const getCarResponse = new CarMock();
  getCarResponse.id = id;
  getCarResponse.manufacturer = computeGetManufacturerResponse();
  getCarResponse.price = 10000;
  getCarResponse.firstRegistrationDate = new Date(Date.parse('2019-11-25T15:32:00.000Z'));
  getCarResponse.owners = computeGetOwnersResponse();
  return getCarResponse;
}

function computeGetManufacturerResponse(): ManufacturerMock {
  const getManufacturerResponse = new ManufacturerMock();
  getManufacturerResponse.id = 'Vendor';
  getManufacturerResponse.name = 'Vendor Enterprises';
  getManufacturerResponse.phone = '+33 1 42 ...';
  getManufacturerResponse.siret = 123456;
  return getManufacturerResponse;
}

function computeGetOwnersResponse(): OwnerMock[] {
  const ownerMock1 = new OwnerMock();
  ownerMock1.id = 'owner1';
  ownerMock1.name = 'owner1 name';
  ownerMock1.purchaseDate = new Date();
  const ownerMock2 = new OwnerMock();
  ownerMock2.id = 'owner2';
  ownerMock2.name = 'owner2 name';
  ownerMock2.purchaseDate = new Date();
  return [ownerMock1, ownerMock2];
}
