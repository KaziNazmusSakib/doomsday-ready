"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoviesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const movie_entity_1 = require("./entities/movie.entity");
const common_2 = require("@nestjs/common");
const circular_check_1 = require("./logic/circular-check");
const rewatch_order_1 = require("./logic/rewatch-order");
let MoviesService = class MoviesService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    toResponse(m) {
        return {
            id: m.id,
            title: m.title,
            releaseYear: m.releaseYear,
            runtimeMinutes: m.runtimeMinutes,
            watched: m.watched,
            prerequisiteIds: (m.prerequisites ?? []).map((p) => p.id),
        };
    }
    async create(dto) {
        const exists = await this.repo.findOne({ where: { title: dto.title } });
        if (exists) {
            throw new common_1.ConflictException({ code: 'DUPLICATE_TITLE', message: 'A movie with this title already exists' });
        }
        let prerequisites = [];
        if (dto.prerequisiteIds.length) {
            prerequisites = await this.repo.findBy({ id: (0, typeorm_2.In)(dto.prerequisiteIds) });
            if (prerequisites.length !== dto.prerequisiteIds.length) {
                throw new common_1.BadRequestException({ code: 'PREREQUISITE_NOT_FOUND', message: 'One or more prerequisite movies do not exist' });
            }
        }
        const saved = await this.repo.save(this.repo.create({
            title: dto.title,
            releaseYear: dto.releaseYear,
            runtimeMinutes: dto.runtimeMinutes,
            watched: dto.watched,
            prerequisites,
        }));
        return this.toResponse(saved);
    }
    async update(id, dto) {
        const movie = await this.repo.findOne({ where: { id }, relations: { prerequisites: true } });
        if (!movie)
            throw new common_2.NotFoundException({ code: 'MOVIE_NOT_FOUND', message: 'Movie not found' });
        if (dto.title !== undefined && dto.title !== movie.title) {
            const dup = await this.repo.findOne({ where: { title: dto.title } });
            if (dup)
                throw new common_1.ConflictException({ code: 'DUPLICATE_TITLE', message: 'A movie with this title already exists' });
        }
        if (dto.prerequisiteIds !== undefined) {
            const found = dto.prerequisiteIds.length ? await this.repo.findBy({ id: (0, typeorm_2.In)(dto.prerequisiteIds) }) : [];
            if (found.length !== dto.prerequisiteIds.length)
                throw new common_1.BadRequestException({ code: 'PREREQUISITE_NOT_FOUND', message: 'One or more prerequisite movies do not exist' });
            const all = await this.repo.find({ relations: { prerequisites: true } });
            const graph = {};
            for (const m of all)
                graph[m.id] = m.prerequisites.map((p) => p.id);
            if ((0, circular_check_1.wouldCreateCycle)(id, dto.prerequisiteIds, graph))
                throw new common_1.ConflictException({ code: 'CIRCULAR_DEPENDENCY', message: 'This change would create a circular dependency' });
            movie.prerequisites = found;
        }
        if (dto.title !== undefined)
            movie.title = dto.title;
        if (dto.releaseYear !== undefined)
            movie.releaseYear = dto.releaseYear;
        if (dto.runtimeMinutes !== undefined)
            movie.runtimeMinutes = dto.runtimeMinutes;
        if (dto.watched !== undefined)
            movie.watched = dto.watched;
        return this.toResponse(await this.repo.save(movie));
    }
    async rewatchOrder(id) {
        const movies = await this.repo.find({ relations: { prerequisites: true } });
        const byId = {};
        const graph = {};
        for (const m of movies) {
            byId[m.id] = m;
            graph[m.id] = m.prerequisites.map((p) => p.id);
        }
        const target = byId[id];
        if (!target)
            throw new common_2.NotFoundException({ code: 'MOVIE_NOT_FOUND', message: 'Movie not found' });
        const order = (0, rewatch_order_1.getRewatchOrder)(id, graph).map((x) => ({
            id: x,
            title: byId[x].title,
            releaseYear: byId[x].releaseYear,
            runtimeMinutes: byId[x].runtimeMinutes,
            watched: byId[x].watched,
        }));
        let watchedCount = 0;
        let remainingRuntimeMinutes = 0;
        for (const m of order) {
            if (m.watched)
                watchedCount++;
            else
                remainingRuntimeMinutes += m.runtimeMinutes;
        }
        return { movieId: id, title: target.title, order, watchedCount, totalCount: order.length, remainingRuntimeMinutes };
    }
    async findAll() {
        const movies = await this.repo.find({ relations: { prerequisites: true }, order: { id: 'ASC' } });
        return movies.map((m) => this.toResponse(m));
    }
};
exports.MoviesService = MoviesService;
exports.MoviesService = MoviesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(movie_entity_1.Movie)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MoviesService);
//# sourceMappingURL=movies.service.js.map