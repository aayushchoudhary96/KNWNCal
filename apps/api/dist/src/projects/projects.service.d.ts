import { PrismaService } from '../prisma/prisma.service';
export interface CreateProjectDto {
    name: string;
    clientId: string;
}
export interface UpdateProjectDto {
    name?: string;
    clientId?: string;
}
export declare class ProjectsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userRole: string, userClientId?: string, clientId?: string): Promise<({
        client: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        clientId: string;
    })[]>;
    findOne(id: string, userRole: string, userClientId?: string): Promise<{
        client: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        clientId: string;
    }>;
    create(createProjectDto: CreateProjectDto, userRole: string): Promise<{
        client: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        clientId: string;
    }>;
    update(id: string, updateProjectDto: UpdateProjectDto, userRole: string, userClientId?: string): Promise<{
        client: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        clientId: string;
    }>;
    remove(id: string, userRole: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        clientId: string;
    }>;
}
