import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ManufacturerEntity {

  @PrimaryColumn({ unique: true })
  id: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  siret: number;
}
