import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from './schedule.service';
import { CarsService } from './cars.service';
import { CarsServiceMock } from './mock/cars.service.mock';
import { ScheduleModule } from 'nest-schedule';
import { CarEntity } from './entity/car.entity';
import { OwnerEntity } from './entity/owner.entity';

describe('ScheduleService', () => {
  let service: ScheduleService;
  let carsService: CarsServiceMock;

  beforeEach(async () => {
    carsService = new CarsServiceMock();

    const module: TestingModule = await Test.createTestingModule({
      imports: [ScheduleModule.register()],
      providers: [CarsService, ScheduleService],
    }).overrideProvider(CarsService)
      .useValue(carsService)
      .compile();

    service = module.get<ScheduleService>(ScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should apply cars discounts and owners cleanup', async () => {
    const carEntity = createCarEntity('Car', 1000, false);
    const carEntityDiscounted = createCarEntity('CarDiscounted', 800, true);
    carEntityDiscounted.owners = [createOwnerEntity('Old')];

    await carsService.create(carEntity);
    await carsService.create(carEntityDiscounted);

    service.interval = 750;
    service.createJobs();

    await delay(1 * 1000);

    const carEntityAfter = await carsService.get('Car');
    expect(carEntityAfter.price).toEqual(800);

    const carEntityDiscountedAfter = await carsService.get('CarDiscounted');
    expect(carEntityDiscountedAfter.price).toEqual(1000);
    expect(carEntityDiscountedAfter.owners).toEqual([]);
  });
});

function createCarEntity(id: string, price: number, discounted: boolean): CarEntity {
  const carEntity = new CarEntity();
  carEntity.id = id;
  carEntity.price = price;
  carEntity.discounted = discounted;
  return carEntity;
}

function createOwnerEntity(id: string): OwnerEntity {
  const owner = new OwnerEntity();
  owner.id = 'id';
  return owner;
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
