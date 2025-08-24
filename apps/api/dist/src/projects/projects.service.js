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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProjectsService = class ProjectsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userRole, userClientId, clientId) {
        if (userRole === 'CLIENT' && userClientId) {
            return this.prisma.project.findMany({
                where: { clientId: userClientId },
                include: {
                    client: {
                        select: { id: true, name: true }
                    }
                }
            });
        }
        const where = {};
        if (clientId) {
            where.clientId = clientId;
        }
        return this.prisma.project.findMany({
            where,
            include: {
                client: {
                    select: { id: true, name: true }
                }
            }
        });
    }
    async findOne(id, userRole, userClientId) {
        const project = await this.prisma.project.findUnique({
            where: { id },
            include: {
                client: {
                    select: { id: true, name: true }
                }
            }
        });
        if (!project) {
            throw new common_1.BadRequestException('Project not found');
        }
        if (userRole === 'CLIENT' && userClientId && project.clientId !== userClientId) {
            throw new common_1.ForbiddenException('You can only access projects from your own client');
        }
        return project;
    }
    async create(createProjectDto, userRole) {
        if (userRole === 'CLIENT' || userRole === 'MEMBER') {
            throw new common_1.ForbiddenException('Only CEO and Manager can create projects');
        }
        const client = await this.prisma.client.findUnique({
            where: { id: createProjectDto.clientId }
        });
        if (!client) {
            throw new common_1.BadRequestException('Client not found');
        }
        return this.prisma.project.create({
            data: createProjectDto,
            include: {
                client: {
                    select: { id: true, name: true }
                }
            }
        });
    }
    async update(id, updateProjectDto, userRole, userClientId) {
        if (userRole === 'CLIENT' || userRole === 'MEMBER') {
            throw new common_1.ForbiddenException('Only CEO and Manager can update projects');
        }
        if (updateProjectDto.clientId) {
            const client = await this.prisma.client.findUnique({
                where: { id: updateProjectDto.clientId }
            });
            if (!client) {
                throw new common_1.BadRequestException('Client not found');
            }
        }
        return this.prisma.project.update({
            where: { id },
            data: updateProjectDto,
            include: {
                client: {
                    select: { id: true, name: true }
                }
            }
        });
    }
    async remove(id, userRole) {
        if (userRole === 'CLIENT' || userRole === 'MEMBER') {
            throw new common_1.ForbiddenException('Only CEO and Manager can delete projects');
        }
        return this.prisma.project.delete({
            where: { id }
        });
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map