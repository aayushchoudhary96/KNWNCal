import { ClientsService, CreateClientDto, UpdateClientDto } from './clients.service';
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    create(createClientDto: CreateClientDto, req: any): Promise<{
        _count: {
            users: number;
            projects: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
    }>;
    findAll(req: any): Promise<({
        _count: {
            users: number;
            projects: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
    })[]>;
    findOne(id: string, req: any): Promise<{
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
    update(id: string, updateClientDto: UpdateClientDto, req: any): Promise<{
        _count: {
            users: number;
            projects: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
    }>;
    remove(id: string, req: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
    }>;
}
