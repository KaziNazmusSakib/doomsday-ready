import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column({ name: 'release_year', type: 'int' })
  releaseYear: number;

  @Column({ name: 'runtime_minutes', type: 'int' })
  runtimeMinutes: number;

  @Column({ default: false })
  watched: boolean;

  @ManyToMany(() => Movie)
  @JoinTable({
    name: 'movie_prerequisites',
    joinColumn: { name: 'movie_id' },
    inverseJoinColumn: { name: 'prerequisite_id' },
  })
  prerequisites: Movie[];
}