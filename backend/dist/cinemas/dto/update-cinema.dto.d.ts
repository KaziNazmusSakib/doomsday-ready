export interface UpdateCinemaDto {
    name?: string;
    bundleSizes?: number[];
}
export declare function parseUpdateCinema(body: any): UpdateCinemaDto;
