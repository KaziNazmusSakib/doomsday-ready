import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cinemas')
export class Cinema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column('int', { array: true, name: 'bundle_sizes' })
  bundleSizes: number[];
}

