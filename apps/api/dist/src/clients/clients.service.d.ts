import { PrismaService } from '../prisma/prisma.service';
export interface CreateClientDto {
    name: string;
}
export interface UpdateClientDto {
    name?: string;
}
export declare class ClientsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userRole: string, userClientId?: string): Promise<({
        _count: {
            users: number;
            projects: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
    })[]>;
    findOne(id: string, userRole: string, userClientId?: string): Promise<{
        users: {
            id: string;
            name: string;
            createdAt: Date;
            clientId: string | null;
            email: string;
            passwordHash: string;
            role: string;
            updatedAt: Date;
        }[];
        projects: {
            id: string;
            name: string;
            createdAt: Date;
            clientId: string;
        }[];
        _count: {
            users: number;
            projects: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
    }>;
    create(createClientDto: CreateClientDto, userRole: string): Promise<{
        _count: {
            users: number;
            projects: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
    }>;
    update(id: string, updateClientDto: UpdateClientDto, userRole: string, userClientId?: string): Promise<{
        _count: {
            users: number;
            projects: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
    }>;
    remove(id: string, userRole: string, userClientId?: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
    }>;
}
