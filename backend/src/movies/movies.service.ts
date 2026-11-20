import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MoviesService {
  constructor(@InjectRepository(Movie) private readonly repo: Repository<Movie>) {}

  private toResponse(m: Movie) {
    return {
      id: m.id,
      title: m.title,
      releaseYear: m.releaseYear,
      runtimeMinutes: m.runtimeMinutes,
      watched: m.watched,
      prerequisiteIds: (m.prerequisites ?? []).map((p) => p.id),
    };
  }

  async create(dto: CreateMovieDto) {
    const exists = await this.repo.findOne({ where: { title: dto.title } });
    if (exists) {
      throw new ConflictException({ code: 'DUPLICATE_TITLE', message: 'A movie with this title already exists' });
    }

    let prerequisites: Movie[] = [];
    if (dto.prerequisiteIds.length) {
      prerequisites = await this.repo.findBy({ id: In(dto.prerequisiteIds) });
      if (prerequisites.length !== dto.prerequisiteIds.length) {
        throw new BadRequestException({ code: 'PREREQUISITE_NOT_FOUND', message: 'One or more prerequisite movies do not exist' });
      }
    }

    const saved = await this.repo.save(
      this.repo.create({
        title: dto.title,
        releaseYear: dto.releaseYear,
        runtimeMinutes: dto.runtimeMinutes,
        watched: dto.watched,
        prerequisites,
      }),
    );
    return this.toResponse(saved);
  }

  async findAll() {
    // const movies = await this.repo.find({ relations: ['prerequisites'], order: { id: 'ASC' } });
    const movies = await this.repo.find({ relations: { prerequisites: true }, order: { id: 'ASC' } });
    return movies.map((m) => this.toResponse(m));
  }
}