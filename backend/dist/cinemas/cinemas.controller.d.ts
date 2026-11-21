import { CinemasService } from './cinemas.service';
export declare class CinemasController {
    private readonly cinemasService;
    constructor(cinemasService: CinemasService);
    create(body: unknown): Promise<import("./entities/cinema.entity").Cinema>;
    update(id: number, body: unknown): Promise<import("./entities/cinema.entity").Cinema>;
    findAll(): Promise<import("./entities/cinema.entity").Cinema[]>;
    booking(id: number, groupSize: string): Promise<{
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
