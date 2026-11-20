import { BadRequestException } from '@nestjs/common';

export class CreateMovieDto {
  title: string;
  releaseYear: number;
  runtimeMinutes: number;
  watched: boolean;
  prerequisiteIds: number[];
}

export function parseCreateMovie(body: any): CreateMovieDto {
  const errors: string[] = [];

  const title = typeof body?.title === 'string' ? body.title.trim() : '';
  if (!title) errors.push('title is required');

  const releaseYear = body?.releaseYear;
  if (!Number.isInteger(releaseYear) || releaseYear < 1888 || releaseYear > 2100) {
    errors.push('releaseYear must be an integer between 1888 and 2100');
  }

  const runtimeMinutes = body?.runtimeMinutes;
  if (!Number.isInteger(runtimeMinutes) || runtimeMinutes < 1 || runtimeMinutes > 300) {
    errors.push('runtimeMinutes must be an integer between 1 and 300');
  }

  let watched = false;
  if (body?.watched !== undefined) {
    if (typeof body.watched !== 'boolean') errors.push('watched must be true or false');
    else watched = body.watched;
  }

  let prerequisiteIds: number[] = [];
  if (body?.prerequisiteIds !== undefined) {
    const ids = body.prerequisiteIds;
    if (!Array.isArray(ids) || !ids.every((n) => Number.isInteger(n) && n > 0)) {
      errors.push('prerequisiteIds must be an array of positive integers');
    } else {
      prerequisiteIds = [...new Set<number>(ids)];
    }
  }

  if (errors.length) {
    throw new BadRequestException({ code: 'VALIDATION_ERROR', message: errors });
  }
  return { title, releaseYear, runtimeMinutes, watched, prerequisiteIds };
}