import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cinema } from './entities/cinema.entity';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
import { getBookingQuote } from './logic/booking-quote';

@Injectable()
export class CinemasService {
  constructor(@InjectRepository(Cinema) private readonly repo: Repository<Cinema>) {}

  async create(dto: CreateCinemaDto) {
    const exists = await this.repo.findOneBy({ name: dto.name });
    if (exists) throw new ConflictException({ code: 'DUPLICATE_NAME', message: 'A cinema with this name already exists' });
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: UpdateCinemaDto) {
  const cinema = await this.repo.findOneBy({ id });
  if (!cinema) throw new NotFoundException({ code: 'CINEMA_NOT_FOUND', message: 'Cinema not found' });

  if (dto.name !== undefined && dto.name !== cinema.name) {
    const dup = await this.repo.findOneBy({ name: dto.name });
    if (dup) throw new ConflictException({ code: 'DUPLICATE_NAME', message: 'A cinema with this name already exists' });
    cinema.name = dto.name;
  }
  if (dto.bundleSizes !== undefined) cinema.bundleSizes = dto.bundleSizes;

  return this.repo.save(cinema);
}


  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async booking(id: number, groupSize: number) {
    const cinema = await this.repo.findOneBy({ id });
    if (!cinema) throw new NotFoundException({ code: 'CINEMA_NOT_FOUND', message: 'Cinema not found' });
    return { cinemaId: cinema.id, cinemaName: cinema.name, groupSize, ...getBookingQuote(cinema.bundleSizes, groupSize) };
  }
}

