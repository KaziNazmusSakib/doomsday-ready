import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
export declare class MoviesService {
    private readonly repo;
    constructor(repo: Repository<Movie>);
    private toResponse;
    create(dto: CreateMovieDto): Promise<{
        id: number;
        title: string;
        releaseYear: number;
        runtimeMinutes: number;
        watched: boolean;
        prerequisiteIds: number[];
    }>;
    update(id: number, dto: UpdateMovieDto): Promise<{
        id: number;
        title: string;
        releaseYear: number;
        runtimeMinutes: number;
        watched: boolean;
        prerequisiteIds: number[];
    }>;
    findAll(): Promise<{
        id: number;
        title: string;
        releaseYear: number;
        runtimeMinutes: number;
        watched: boolean;
        prerequisiteIds: number[];
    }[]>;
}
