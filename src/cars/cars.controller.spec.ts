import { Test, TestingModule } from '@nestjs/testing';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { CarsServiceMock } from './mock/cars.service.mock';
import { CreateCarRequest } from './request/create/create.car.request';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateManufacturerRequest } from './request/create/create.manufacturer.request';
import { UpdateCarRequest } from './request/update/updare.car.request';
import { UpdateManufacturerRequest } from './request/update/update.manufacturer.request';
import { CreateOwnerRequest } from './request/create/create.owner.request';

describe('CarsController', () => {
  let controller: CarsController;
  let carsService: CarsServiceMock;

  beforeEach(async () => {
    carsService = new CarsServiceMock();

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [CarsController],
      providers: [CarsService],
    }).overrideProvider(CarsService)
      .useValue(carsService)
      .compile();

    controller = module.get<CarsController>(CarsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create without id should return Invalid id', async () => {
    const createCarRequest = new CreateCarRequest();
    try {
      await controller.create(createCarRequest);
      fail('expected HttpException');
    } catch (exception) {
      if (!(exception instanceof HttpException)) {
        fail('expected HttpException');
      }
      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect(exception.message).toBe('Invalid id');
    }
  });

  it('create with not parsable date should return Invalid date', async () => {
    const invalidDateCreateCarReq = computeCreateCarRequest();
    invalidDateCreateCarReq.firstRegistrationDate = '2019-13-25T15:22:00.000Z';
    try {
      await controller.create(invalidDateCreateCarReq);
      fail('expected HttpException');
    } catch (exception) {
      if (!(exception instanceof HttpException)) {
        fail('expected HttpException');
      }
      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect(exception.message).toBe('Invalid date');
    }
  });

  it('create without manufacturer should return Missing manufacturer', async () => {
    const createCarRequest = new CreateCarRequest();
    createCarRequest.id = 'Car1';
    try {
      await controller.create(createCarRequest);
      fail('expected HttpException');
    } catch (exception) {
      if (!(exception instanceof HttpException)) {
        fail('expected HttpException');
      }
      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect(exception.message).toBe('Missing manufacturer');
    }
  });

  it('create without manufacturer id should return Invalid id', async () => {
    const createCarRequest = new CreateCarRequest();
    createCarRequest.id = 'Car1';
    const createManufacturerRequest = new CreateManufacturerRequest();
    createCarRequest.manufacturer = createManufacturerRequest;
    try {
      await controller.create(createCarRequest);
      fail('expected HttpException');
    } catch (exception) {
      if (!(exception instanceof HttpException)) {
        fail('expected HttpException');
      }
      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect(exception.message).toBe('Invalid id');
    }
  });

  it('create should return created car', async () => {
    const createCarRequest = computeCreateCarRequest();
    const createCarResponse: string = '{"id":"Car1","manufacturer":{"id":"Manufacturer id","name":"Manufacturer name","phone":"+33 1 47 ...","siret":12345},"price":5000,"firstRegistrationDate":"2019-11-25T15:23:00.000Z","owners":[]}';
    return await controller.create(createCarRequest).then(response => expect(JSON.stringify(response)).toEqual(createCarResponse));
  });

  it('getAll should return an empty array when no car exist', async () => {
    return await controller.getAll().then(result => expect(result).toEqual([]));
  });

  it('getAll should return existing cars', async () => {
    const createCarRequest = computeCreateCarRequest();
    await controller.create(createCarRequest);
    const getAllCarsResponse: string = '[{"id":"Car1","manufacturer":{"id":"Manufacturer id","name":"Manufacturer name","phone":"+33 1 47 ...","siret":12345},"price":5000,"firstRegistrationDate":"2019-11-25T15:23:00.000Z","owners":[]}]';
    return await controller.getAll().then(response => expect(JSON.stringify(response)).toEqual(getAllCarsResponse));
  });

  it('get should return not found for a non existing car', async () => {
    try {
      await controller.get('Car1');
      fail('expected HttpException');
    } catch (exception) {
      if (!(exception instanceof HttpException)) {
        fail('expected HttpException');
      }
      expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect(exception.message).toBe('Car was not found');
    }
  });

  it('get should return requested car', async () => {
    await controller.create(computeCreateCarRequest());
    const getCarResponse: string = '{"id":"Car1","manufacturer":{"id":"Manufacturer id","name":"Manufacturer name","phone":"+33 1 47 ...","siret":12345},"price":5000,"firstRegistrationDate":"2019-11-25T15:23:00.000Z","owners":[]}';
    return await controller.get('Car1').then(response => expect(JSON.stringify(response)).toEqual(getCarResponse));
  });

  it('getManufacturer should return not found for a non existing car', async () => {
    try {
      await controller.getManufacturer('Car1');
      fail('expected HttpException');
    } catch (exception) {
      if (!(exception instanceof HttpException)) {
        fail('expected HttpException');
      }
      expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect(exception.message).toBe('Car was not found');
    }
  });

  it('getManufacturer should return requested manufacturer', async () => {
    await controller.create(computeCreateCarRequest());
    const getManufacturerResponse: string = '{"id":"Manufacturer id","name":"Manufacturer name","phone":"+33 1 47 ...","siret":12345}';
    return await controller.getManufacturer('Car1').then(response => expect(JSON.stringify(response)).toEqual(getManufacturerResponse));
  });

  it('update should return not found for a non existing car', async () => {
    try {
      await controller.update('Car1', new UpdateCarRequest());
      fail('expected HttpException');
    } catch (exception) {
      if (!(exception instanceof HttpException)) {
        fail('expected HttpException');
      }
      expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect(exception.message).toBe('Car was not found');
    }
  });

  it('update can update manufacturer fields', async () => {
    await controller.create(computeCreateCarRequest());
    const updateCarRequest = new UpdateCarRequest();
    const updateManufacturerRequest = new UpdateManufacturerRequest();
    updateManufacturerRequest.name = 'Manufacturer name renamed';
    updateManufacturerRequest.phone = '+33 1 47 ... renamed';
    updateManufacturerRequest.siret = 123;
    updateCarRequest.manufacturer = updateManufacturerRequest;
    const updatedCar = await controller.update('Car1', updateCarRequest);
    expect(updatedCar.manufacturer.name).toEqual(updateManufacturerRequest.name);
    expect(updatedCar.manufacturer.phone).toEqual(updateManufacturerRequest.phone);
    expect(updatedCar.manufacturer.siret).toEqual(updateManufacturerRequest.siret);
  });

  it('delete should return not found for a non existing car', async () => {
    try {
      await controller.delete('Car1');
      fail('expected HttpException');
    } catch (exception) {
      if (!(exception instanceof HttpException)) {
        fail('expected HttpException');
      }
      expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect(exception.message).toBe('Car was not found');
    }
  });

  it('delete should return not found after car is deleted', async () => {
    await controller.create(computeCreateCarRequest());
    await controller.delete('Car1');
    try {
      await controller.get('Car1');
      fail('expected HttpException');
    } catch (exception) {
      if (!(exception instanceof HttpException)) {
        fail('expected HttpException');
      }
      expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect(exception.message).toBe('Car was not found');
    }
  });
});

function computeCreateCarRequest(): CreateCarRequest {
  const createCarRequest = new CreateCarRequest();
  createCarRequest.id = 'Car1';
  createCarRequest.manufacturer = computeCreateManufacturerRequest();
  createCarRequest.price = 5000;
  createCarRequest.firstRegistrationDate = '2019-11-25T15:23:00.000Z';
  createCarRequest.owners = [];
  return createCarRequest;
}

function computeCreateManufacturerRequest(): CreateManufacturerRequest {
  const createManufacturerRequest = new CreateManufacturerRequest();
  createManufacturerRequest.id = 'Manufacturer id';
  createManufacturerRequest.name = 'Manufacturer name';
  createManufacturerRequest.phone = '+33 1 47 ...';
  createManufacturerRequest.siret = 12345;
  return createManufacturerRequest;
}

// TODO: find a way to handle purchaseDate
function createOwnerRequest(): CreateOwnerRequest {
  const createOwnerRequest = new CreateOwnerRequest();
  createOwnerRequest.id = 'Owner1';
  createOwnerRequest.name = 'Name1';
  return createOwnerRequest;
}

