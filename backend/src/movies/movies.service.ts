import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { wouldCreateCycle } from './logic/circular-check';
import { getRewatchOrder } from './logic/rewatch-order';

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



  async update(id: number, dto: UpdateMovieDto) {
  const movie = await this.repo.findOne({ where: { id }, relations: { prerequisites: true } });
  if (!movie) throw new NotFoundException({ code: 'MOVIE_NOT_FOUND', message: 'Movie not found' });

  if (dto.title !== undefined && dto.title !== movie.title) {
    const dup = await this.repo.findOne({ where: { title: dto.title } });
    if (dup) throw new ConflictException({ code: 'DUPLICATE_TITLE', message: 'A movie with this title already exists' });
  }

  if (dto.prerequisiteIds !== undefined) {
    const found = dto.prerequisiteIds.length ? await this.repo.findBy({ id: In(dto.prerequisiteIds) }) : [];
    if (found.length !== dto.prerequisiteIds.length)
      throw new BadRequestException({ code: 'PREREQUISITE_NOT_FOUND', message: 'One or more prerequisite movies do not exist' });

    const all = await this.repo.find({ relations: { prerequisites: true } });
    const graph: Record<number, number[]> = {};
  for (const m of all) graph[m.id] = m.prerequisites.map((p) => p.id);
    if (wouldCreateCycle(id, dto.prerequisiteIds, graph))
      throw new ConflictException({ code: 'CIRCULAR_DEPENDENCY', message: 'This change would create a circular dependency' });
    movie.prerequisites = found;
  }

  if (dto.title !== undefined) movie.title = dto.title;
  if (dto.releaseYear !== undefined) movie.releaseYear = dto.releaseYear;
  if (dto.runtimeMinutes !== undefined) movie.runtimeMinutes = dto.runtimeMinutes;
  if (dto.watched !== undefined) movie.watched = dto.watched;

  return this.toResponse(await this.repo.save(movie));
}


async rewatchOrder(id: number) {
  const movies = await this.repo.find({ relations: { prerequisites: true } });
  const byId: Record<number, Movie> = {};
  const graph: Record<number, number[]> = {};
  for (const m of movies) {
    byId[m.id] = m;
    graph[m.id] = m.prerequisites.map((p) => p.id);
  }

  const target = byId[id];
  if (!target) throw new NotFoundException({ code: 'MOVIE_NOT_FOUND', message: 'Movie not found' });

  const order = getRewatchOrder(id, graph).map((x) => ({
    id: x,
    title: byId[x].title,
    releaseYear: byId[x].releaseYear,
    runtimeMinutes: byId[x].runtimeMinutes,
    watched: byId[x].watched,
  }));

  let watchedCount = 0;
  let remainingRuntimeMinutes = 0;
  for (const m of order) {
    if (m.watched) watchedCount++;
    else remainingRuntimeMinutes += m.runtimeMinutes;
  }

  return { movieId: id, title: target.title, order, watchedCount, totalCount: order.length, remainingRuntimeMinutes };
}


  async findAll() {
    // const movies = await this.repo.find({ relations: ['prerequisites'], order: { id: 'ASC' } });
    const movies = await this.repo.find({ relations: { prerequisites: true }, order: { id: 'ASC' } });
    return movies.map((m) => this.toResponse(m));
  }
}