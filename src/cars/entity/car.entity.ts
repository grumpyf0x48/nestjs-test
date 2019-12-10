import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { ManufacturerEntity } from './manufacturer.entity';
import { OwnerEntity } from './owner.entity';

@Entity()
export class CarEntity {

  @PrimaryColumn({ unique: true })
  id: string;

  @ManyToOne(type => ManufacturerEntity, { cascade: ['insert', 'update'], eager: true })
  manufacturer: ManufacturerEntity;

  @Column()
  price: number;

  @Column()
  firstRegistrationDate: Date;

  @OneToMany(type => OwnerEntity, owner => owner.car, { cascade: ['insert', 'update'], eager: true })
  owners: OwnerEntity[];

  @Column({ default: false })
  discounted: boolean;
}
