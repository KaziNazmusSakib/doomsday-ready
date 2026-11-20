export declare class CreateMovieDto {
    title: string;
    releaseYear: number;
    runtimeMinutes: number;
    watched: boolean;
    prerequisiteIds: number[];
}
export declare function parseCreateMovie(body: any): CreateMovieDto;
