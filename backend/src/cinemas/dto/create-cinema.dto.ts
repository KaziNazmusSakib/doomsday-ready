import { BadRequestException } from '@nestjs/common';

export interface CreateCinemaDto {
  name: string;
  bundleSizes: number[];
}

export function parseCreateCinema(body: any): CreateCinemaDto {
  const errors: string[] = [];

  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  if (!name) errors.push('name is required');

  const sizes = body?.bundleSizes;
  if (!Array.isArray(sizes) || sizes.length < 1 || sizes.length > 10) {
    errors.push('bundleSizes must be an array of 1 to 10 sizes');
  } else {
    const seen: Record<number, boolean> = {};
    for (const s of sizes) {
      if (!Number.isInteger(s) || s < 1 || s > 500) {
        errors.push('each bundle size must be an integer between 1 and 500');
        break;
      }
      if (seen[s]) {
        errors.push('bundle sizes must all be different');
        break;
      }
      seen[s] = true;
    }
  }

  if (errors.length) throw new BadRequestException({ code: 'VALIDATION_ERROR', message: errors });
  return { name, bundleSizes: sizes };
}

export function parseGroupSize(raw: unknown): number {
  const n = typeof raw === 'string' && /^\d+$/.test(raw) ? Number(raw) : NaN;
  if (!Number.isInteger(n) || n < 1 || n > 10000) {
    throw new BadRequestException({ code: 'VALIDATION_ERROR', message: ['groupSize must be an integer between 1 and 10000'] });
  }
  return n;
}