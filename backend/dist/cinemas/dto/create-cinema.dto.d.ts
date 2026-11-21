export interface CreateCinemaDto {
    name: string;
    bundleSizes: number[];
}
export declare function parseCreateCinema(body: any): CreateCinemaDto;
export declare function parseGroupSize(raw: unknown): number;
