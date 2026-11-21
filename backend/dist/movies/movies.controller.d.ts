import { MoviesService } from './movies.service';
export declare class MoviesController {
    private readonly moviesService;
    constructor(moviesService: MoviesService);
    create(body: unknown): Promise<{
        id: number;
        title: string;
        releaseYear: number;
        runtimeMinutes: number;
        watched: boolean;
        prerequisiteIds: number[];
    }>;
    update(id: number, body: unknown): Promise<{
        id: number;
        title: string;
        releaseYear: number;
        runtimeMinutes: number;
        watched: boolean;
        prerequisiteIds: number[];
    }>;
    rewatchOrder(id: number): Promise<{
        movieId: number;
        title: string;
        order: {
            id: number;
            title: string;
            releaseYear: number;
            runtimeMinutes: number;
            watched: boolean;
        }[];
        watchedCount: number;
        totalCount: number;
        remainingRuntimeMinutes: number;
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
