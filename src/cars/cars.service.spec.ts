import { Test, TestingModule } from '@nestjs/testing';
import { CarsService } from './cars.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CarEntity } from './entity/car.entity';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { OwnerEntity } from './entity/owner.entity';

type MockType<T> = {
  [P in keyof T]: jest.Mock<{}>;
};

// @ts-ignore
const repositoryMockFactory: () => MockType<Repository<CarEntity>> = jest.fn(() => ({
  save: jest.fn(),
  insert: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));

describe('CarsService', () => {
  let carsService: CarsService;
  let carsRepositoryMock: MockType<Repository<CarEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarsService,
        { provide: getRepositoryToken(CarEntity), useFactory: repositoryMockFactory },
      ],
    }).compile();

    carsService = module.get<CarsService>(CarsService);
    carsRepositoryMock = module.get(getRepositoryToken(CarEntity));
  });

  it('should be defined', () => {
    expect(carsService).toBeDefined();
  });

  // Happy Path
  it('create should return the car', async () => {
    const newCar = new CarEntity();
    newCar.id = 'R5';
    carsRepositoryMock.findOne.mockReturnValue(undefined);
    expect(await carsService.create(newCar)).toEqual(newCar);
  });

  it('getAll should return all cars', async () => {
    const car1 = new CarEntity();
    car1.id = 'Car1';
    const car2 = new CarEntity();
    car2.id = 'Car2';
    const carEntities: CarEntity[] = [car1, car2];
    carsRepositoryMock.find.mockReturnValue(carEntities);
    expect(await carsService.getAll()).toEqual(carEntities);
  });

  it('get should return the requested car', async () => {
    const car1 = new CarEntity();
    car1.id = 'Car1';
    carsRepositoryMock.findOne.mockReturnValue(car1);
    expect(await carsService.get('Car1')).toEqual(car1);
  });

  it('update should call repository save', async () => {
    await carsService.update(new CarEntity());
    expect(carsRepositoryMock.save).toBeCalled();
  });

  it('delete should call repository delete', async () => {
    await carsService.delete(new CarEntity());
    expect(carsRepositoryMock.remove).toBeCalled();
  });

  // Errors
  it('create should return conflict for an existing car', async () => {
    const newCar = new CarEntity();
    newCar.id = 'R5';
    carsRepositoryMock.findOne.mockReturnValue(newCar);
    try {
      await carsService.create(newCar);
      fail('expected HttpException');
    } catch (exception) {
      if (!(exception instanceof HttpException)) {
        fail('expected HttpException');
      }
      expect(exception.getStatus()).toBe(HttpStatus.CONFLICT);
      expect(exception.message).toBe('Car already exists');
    }
  });

  it('get should return not found for a not existing car', async () => {
    carsRepositoryMock.findOne.mockReturnValue(undefined);
    try {
      await carsService.get('NotFound');
      fail('expected HttpException');
    } catch (exception) {
      if (!(exception instanceof HttpException)) {
        fail('expected HttpException');
      }
      expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect(exception.message).toBe('Car was not found');
    }
  });

  it('delete should return conflicts when a car still have owners', async () => {
    try {
      const carEntity = new CarEntity();
      const owner = new OwnerEntity();
      carEntity.owners = [owner];
      await carsService.delete(carEntity);
      fail('expected Exception');
    } catch (exception) {
      expect(exception.message).toBe('Car has owners');
    }
  });

  it('delete should return internal server error when database fails', async () => {
    // @ts-ignore
    carsRepositoryMock.remove.mockRejectedValueOnce(new Error('Write to Db failed'));
    try {
      await carsService.delete(new CarEntity());
      fail('expected Exception');
    } catch (exception) {
      expect(exception.message).toBe('Write to Db failed');
    }
  });
});
