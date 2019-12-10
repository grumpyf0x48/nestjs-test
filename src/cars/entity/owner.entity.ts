import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { CarEntity } from './car.entity';

@Entity()
export class OwnerEntity {

  @PrimaryColumn({ unique: true })
  id: string;

  @Column()
  name: string;

  @Column()
  purchaseDate: Date;

  @ManyToOne(type => CarEntity, car => car.owners)
  car: CarEntity;
}
