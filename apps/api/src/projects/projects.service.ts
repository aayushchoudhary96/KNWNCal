import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateProjectDto {
  name: string;
  clientId: string;
}

export interface UpdateProjectDto {
  name?: string;
  clientId?: string;
}

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userRole: string, userClientId?: string, clientId?: string) {
    if (userRole === 'CLIENT' && userClientId) {
      // Client users can only see projects from their client
      return this.prisma.project.findMany({
        where: { clientId: userClientId },
        include: {
          client: {
            select: { id: true, name: true }
          }
        }
      });
    }
    
    // CEO, MANAGER, MEMBER can see all projects or filter by client
    const where: any = {};
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

  async findOne(id: string, userRole: string, userClientId?: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        client: {
          select: { id: true, name: true }
        }
      }
    });

    if (!project) {
      throw new BadRequestException('Project not found');
    }

    if (userRole === 'CLIENT' && userClientId && project.clientId !== userClientId) {
      throw new ForbiddenException('You can only access projects from your own client');
    }

    return project;
  }

  async create(createProjectDto: CreateProjectDto, userRole: string) {
    if (userRole === 'CLIENT' || userRole === 'MEMBER') {
      throw new ForbiddenException('Only CEO and Manager can create projects');
    }

    // Verify the client exists
    const client = await this.prisma.client.findUnique({
      where: { id: createProjectDto.clientId }
    });

    if (!client) {
      throw new BadRequestException('Client not found');
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

  async update(id: string, updateProjectDto: UpdateProjectDto, userRole: string, userClientId?: string) {
    if (userRole === 'CLIENT' || userRole === 'MEMBER') {
      throw new ForbiddenException('Only CEO and Manager can update projects');
    }

    // If updating clientId, verify the new client exists
    if (updateProjectDto.clientId) {
      const client = await this.prisma.client.findUnique({
        where: { id: updateProjectDto.clientId }
      });

      if (!client) {
        throw new BadRequestException('Client not found');
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

  async remove(id: string, userRole: string) {
    if (userRole === 'CLIENT' || userRole === 'MEMBER') {
      throw new ForbiddenException('Only CEO and Manager can delete projects');
    }

    return this.prisma.project.delete({
      where: { id }
    });
  }
}