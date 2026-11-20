"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUpdateMovie = parseUpdateMovie;
const common_1 = require("@nestjs/common");
function parseUpdateMovie(body) {
    const errors = [];
    const dto = {};
    if (body?.title !== undefined) {
        const t = typeof body.title === 'string' ? body.title.trim() : '';
        if (!t)
            errors.push('title must be a non-empty string');
        else
            dto.title = t;
    }
    if (body?.releaseYear !== undefined) {
        if (!Number.isInteger(body.releaseYear) || body.releaseYear < 1888 || body.releaseYear > 2100)
            errors.push('releaseYear must be an integer between 1888 and 2100');
        else
            dto.releaseYear = body.releaseYear;
    }
    if (body?.runtimeMinutes !== undefined) {
        if (!Number.isInteger(body.runtimeMinutes) || body.runtimeMinutes < 1 || body.runtimeMinutes > 300)
            errors.push('runtimeMinutes must be an integer between 1 and 300');
        else
            dto.runtimeMinutes = body.runtimeMinutes;
    }
    if (body?.watched !== undefined) {
        if (typeof body.watched !== 'boolean')
            errors.push('watched must be true or false');
        else
            dto.watched = body.watched;
    }
    if (body?.prerequisiteIds !== undefined) {
        const ids = body.prerequisiteIds;
        if (!Array.isArray(ids) || !ids.every((n) => Number.isInteger(n) && n > 0))
            errors.push('prerequisiteIds must be an array of positive integers');
        else
            dto.prerequisiteIds = [...new Set(ids)];
    }
    if (errors.length)
        throw new common_1.BadRequestException({ code: 'VALIDATION_ERROR', message: errors });
    return dto;
}
//# sourceMappingURL=update-movie.dto.js.map