import { ProjectsService, CreateProjectDto, UpdateProjectDto } from './projects.service';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(createProjectDto: CreateProjectDto, req: any): Promise<{
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
    findAll(req: any, clientId?: string): Promise<({
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
    findOne(id: string, req: any): Promise<{
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
    update(id: string, updateProjectDto: UpdateProjectDto, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        clientId: string;
    }>;
}
