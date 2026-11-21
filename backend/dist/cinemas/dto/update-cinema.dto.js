"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUpdateCinema = parseUpdateCinema;
const common_1 = require("@nestjs/common");
function parseUpdateCinema(body) {
    const errors = [];
    const dto = {};
    if (body?.name === undefined && body?.bundleSizes === undefined) {
        errors.push('provide name and/or bundleSizes to update');
    }
    if (body?.name !== undefined) {
        const n = typeof body.name === 'string' ? body.name.trim() : '';
        if (!n)
            errors.push('name must be a non-empty string');
        else
            dto.name = n;
    }
    if (body?.bundleSizes !== undefined) {
        const sizes = body.bundleSizes;
        if (!Array.isArray(sizes) || sizes.length < 1 || sizes.length > 10) {
            errors.push('bundleSizes must be an array of 1 to 10 sizes');
        }
        else {
            const seen = {};
            let ok = true;
            for (const s of sizes) {
                if (!Number.isInteger(s) || s < 1 || s > 500) {
                    errors.push('each bundle size must be an integer between 1 and 500');
                    ok = false;
                    break;
                }
                if (seen[s]) {
                    errors.push('bundle sizes must all be different');
                    ok = false;
                    break;
                }
                seen[s] = true;
            }
            if (ok)
                dto.bundleSizes = sizes;
        }
    }
    if (errors.length)
        throw new common_1.BadRequestException({ code: 'VALIDATION_ERROR', message: errors });
    return dto;
}
//# sourceMappingURL=update-cinema.dto.js.map