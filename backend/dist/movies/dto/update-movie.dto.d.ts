export interface UpdateMovieDto {
    title?: string;
    releaseYear?: number;
    runtimeMinutes?: number;
    watched?: boolean;
    prerequisiteIds?: number[];
}
export declare function parseUpdateMovie(body: any): UpdateMovieDto;
