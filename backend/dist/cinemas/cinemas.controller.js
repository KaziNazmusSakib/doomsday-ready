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
exports.CinemasController = void 0;
const common_1 = require("@nestjs/common");
const cinemas_service_1 = require("./cinemas.service");
const create_cinema_dto_1 = require("./dto/create-cinema.dto");
const update_cinema_dto_1 = require("./dto/update-cinema.dto");
let CinemasController = class CinemasController {
    cinemasService;
    constructor(cinemasService) {
        this.cinemasService = cinemasService;
    }
    create(body) {
        return this.cinemasService.create((0, create_cinema_dto_1.parseCreateCinema)(body));
    }
    update(id, body) {
        return this.cinemasService.update(id, (0, update_cinema_dto_1.parseUpdateCinema)(body));
    }
    findAll() {
        return this.cinemasService.findAll();
    }
    booking(id, groupSize) {
        return this.cinemasService.booking(id, (0, create_cinema_dto_1.parseGroupSize)(groupSize));
    }
};
exports.CinemasController = CinemasController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CinemasController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], CinemasController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CinemasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id/booking'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('groupSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], CinemasController.prototype, "booking", null);
exports.CinemasController = CinemasController = __decorate([
    (0, common_1.Controller)('cinemas'),
    __metadata("design:paramtypes", [cinemas_service_1.CinemasService])
], CinemasController);
//# sourceMappingURL=cinemas.controller.js.map