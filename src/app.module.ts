import { Module } from '@nestjs/common';
import { CarsModule } from './cars/cars.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [CarsModule, TypeOrmModule.forRoot()],
})
export class AppModule {
}
