import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarEntity } from './entity/car.entity';
import { ScheduleService } from './schedule.service';
import { ScheduleModule } from 'nest-schedule';

@Module({
  imports: [TypeOrmModule.forFeature([CarEntity]), ScheduleModule.register()],
  providers: [CarsService, ScheduleService],
  controllers: [CarsController],
})
export class CarsModule {
}
