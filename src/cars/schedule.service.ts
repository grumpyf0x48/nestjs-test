import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectSchedule, Schedule } from 'nest-schedule';
import { CarsService } from './cars.service';

@Injectable()
export class ScheduleService implements OnModuleInit, OnModuleDestroy {

  private _interval: number = 60 * 60 * 1000;

  constructor(
    @InjectSchedule() private readonly schedule: Schedule,
    private carsService: CarsService,
  ) {
  }

  set interval(value: number) {
    this._interval = value;
  }

  onModuleInit(): any {
    this.createJobs();
  }

  onModuleDestroy(): any {
    this.cancelJobs();
  }

  createJobs() {
    // @ts-ignore
    this.schedule.scheduleIntervalJob('ScheduleJob', this._interval, () => {
      console.log('Processing Car discounts');

      // Process cars to undiscount
      this.carsService.toUndiscount()
        .then(carEntities => carEntities.forEach(carEntity => {
          console.log('Car is not anymore discountable: ', carEntity.id);
          this.carsService.endDiscount(carEntity);
        }));

      // Process cars to discount
      this.carsService.toDiscount()
        .then(carEntities => carEntities.forEach(carEntity => {
          console.log('Car is discountable: ', carEntity.id);
          this.carsService.startDiscount(carEntity);
        }));

      console.log('Processing Owners removal');
      // Process owners removal
      this.carsService.cleanupOwners();
    });
  }

  cancelJobs() {
    this.schedule.cancelJob('ScheduleJob');
  }
}
