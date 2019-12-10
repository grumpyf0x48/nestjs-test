import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarRequest } from './request/create/create.car.request';
import { EntityFactory } from './factory/entity.factory';
import { UpdateCarRequest } from './request/update/updare.car.request';
import { Car } from './interface/car.interface';
import { ResponseFactory } from './factory/response.factory';
import { Manufacturer } from './interface/manufacturer.interface';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetCarResponse } from './response/get.car.response';

@ApiTags('cars')
@Controller('cars')
export class CarsController {

  constructor(private carsService: CarsService) {
  }

  @Post()
  @ApiOperation({ description: 'Create a car.' })
  @ApiCreatedResponse({ description: 'The car has been successfully created.', type: GetCarResponse })
  @ApiBadRequestResponse({ description: 'A parameter has an incorrect value.' })
  @ApiConflictResponse({ description: 'A car with the same id already exists.' })
  @ApiInternalServerErrorResponse({ description: 'An internal error occurred.' })
  async create(@Body() createCarRequest: CreateCarRequest): Promise<Car> {
    try {
      console.log('POST /cars', createCarRequest);
      const carEntity = EntityFactory.createCarEntity(createCarRequest);
      const createdCarEntity = await this.carsService.create(carEntity);
      return ResponseFactory.createGetCarResponse(createdCarEntity);
    } catch (exception) {
      console.error('POST /cars: ', exception.message);
      if (exception instanceof HttpException) {
        throw exception;
      }
      throw new HttpException('Car was not created', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @ApiOperation({ description: 'Retrieve all cars.' })
  @ApiOkResponse({ description: 'The cars have been successfully returned.' })
  @ApiInternalServerErrorResponse({ description: 'An internal error occurred.' })
  async getAll(): Promise<Car[]> {
    try {
      console.log('GET /cars');
      const carEntities = await this.carsService.getAll();
      return ResponseFactory.createGetAllCarsResponse(carEntities);
    } catch (exception) {
      console.error('GET /cars: ', exception.message);
      throw new HttpException(exception.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({ description: 'Retrieve a car.' })
  @ApiParam({ name: 'id', description: 'The car identifier' })
  @ApiOkResponse({ description: 'The car has been successfully returned.' })
  @ApiNotFoundResponse({ description: 'The car does not exist' })
  @ApiBadRequestResponse({ description: 'A parameter has an incorrect value.' })
  @ApiInternalServerErrorResponse({ description: 'An internal error occurred.' })
  async get(@Param('id') carId): Promise<Car> {
    try {
      console.log('GET /cars/%s', carId);
      const carEntity = await this.carsService.get(carId);
      return ResponseFactory.createGetCarResponse(carEntity);
    } catch (exception) {
      console.error('GET /cars/%s: %s', carId, exception.message);
      if (exception instanceof HttpException) {
        throw exception;
      }
      throw new HttpException(exception.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id/manufacturer')
  @ApiOperation({ description: 'Retrieve the manufacturer of a car.' })
  @ApiParam({ name: 'id', description: 'The car identifier' })
  @ApiOkResponse({ description: 'The manufacturer has been successfully returned.' })
  @ApiNotFoundResponse({ description: 'The car does not exist' })
  @ApiInternalServerErrorResponse({ description: 'An internal error occurred.' })
  async getManufacturer(@Param('id') carId): Promise<Manufacturer> {
    try {
      console.log('GET /cars/%s/manufacturer', carId);
      const carEntity = await this.carsService.get(carId);
      return ResponseFactory.createGetManufacturerResponse(carEntity.manufacturer);
    } catch (exception) {
      console.error('GET /cars/%s/manufacturer: %s', carId, exception.message);
      if (exception instanceof HttpException) {
        throw exception;
      }
      throw new HttpException(exception.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  @ApiOperation({ description: 'Update a car.' })
  @ApiParam({ name: 'id', description: 'The car identifier' })
  @ApiOkResponse({ description: 'The car has been successfully updated.' })
  @ApiNotFoundResponse({ description: 'The car does not exist' })
  @ApiInternalServerErrorResponse({ description: 'An internal error occurred.' })
  async update(@Param('id') carId, @Body() updateCarRequest: UpdateCarRequest): Promise<Car> {
    try {
      console.log('PUT /cars/%s %s', carId, updateCarRequest);
      const carEntity = await this.carsService.get(carId);
      const updatedCarEntity = EntityFactory.updateCarEntity(carEntity, updateCarRequest);
      await this.carsService.update(updatedCarEntity);
      return ResponseFactory.createGetCarResponse(updatedCarEntity);
    } catch (exception) {
      console.error('PUT /cars/%s: %s', carId, exception.message);
      if (exception instanceof HttpException) {
        throw exception;
      }
      throw new HttpException('Car was not updated', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ description: 'Delete a car.' })
  @ApiParam({ name: 'id', description: 'The car identifier' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The car has been successfully deleted.' })
  @ApiNotFoundResponse({ description: 'The car does not exist' })
  @ApiResponse({ status: HttpStatus.PRECONDITION_FAILED, description: 'The car still has owners.' })
  @ApiInternalServerErrorResponse({ description: 'An internal error occurred.' })
  async delete(@Param('id') carId): Promise<void> {
    try {
      console.log('DELETE /cars/%s', carId);
      const carEntity = await this.carsService.get(carId);
      await this.carsService.delete(carEntity);
    } catch (exception) {
      console.error('DELETE /cars/%s: ', carId, exception.message);
      if (exception instanceof HttpException) {
        throw exception;
      }
      throw new HttpException('Car was not deleted', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
