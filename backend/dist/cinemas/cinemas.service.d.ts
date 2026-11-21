import { Repository } from 'typeorm';
import { Cinema } from './entities/cinema.entity';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
export declare class CinemasService {
    private readonly repo;
    constructor(repo: Repository<Cinema>);
    create(dto: CreateCinemaDto): Promise<Cinema>;
    update(id: number, dto: UpdateCinemaDto): Promise<Cinema>;
    findAll(): Promise<Cinema[]>;
    booking(id: number, groupSize: number): Promise<{
        possible: boolean;
        bundleCount?: number;
        bundles?: {
            size: number;
            count: number;
        }[];
        message?: string;
        cinemaId: number;
        cinemaName: string;
        groupSize: number;
    }>;
}
