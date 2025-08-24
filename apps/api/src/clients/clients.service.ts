import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateClientDto {
  name: string;
}

export interface UpdateClientDto {
  name?: string;
}

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userRole: string, userClientId?: string) {
    if (userRole === 'CLIENT' && userClientId) {
      // Client users can only see their own client
      return this.prisma.client.findMany({
        where: { id: userClientId },
        include: {
          _count: {
            select: { projects: true, users: true }
          }
        }
      });
    }
    
    // CEO, MANAGER, MEMBER can see all clients
    return this.prisma.client.findMany({
      include: {
        _count: {
          select: { projects: true, users: true }
        }
      }
    });
  }

  async findOne(id: string, userRole: string, userClientId?: string) {
    if (userRole === 'CLIENT' && userClientId && userClientId !== id) {
      throw new ForbiddenException('You can only access your own client');
    }

    return this.prisma.client.findUnique({
      where: { id },
      include: {
        projects: true,
        users: true,
        _count: {
          select: { projects: true, users: true }
        }
      }
    });
  }

  async create(createClientDto: CreateClientDto, userRole: string) {
    if (userRole === 'CLIENT' || userRole === 'MEMBER') {
      throw new ForbiddenException('Only CEO and Manager can create clients');
    }

    return this.prisma.client.create({
      data: createClientDto,
      include: {
        _count: {
          select: { projects: true, users: true }
        }
      }
    });
  }

  async update(id: string, updateClientDto: UpdateClientDto, userRole: string, userClientId?: string) {
    if (userRole === 'CLIENT' && userClientId && userClientId !== id) {
      throw new ForbiddenException('You can only update your own client');
    }

    if (userRole === 'MEMBER') {
      throw new ForbiddenException('Members cannot update clients');
    }

    return this.prisma.client.update({
      where: { id },
      data: updateClientDto,
      include: {
        _count: {
          select: { projects: true, users: true }
        }
      }
    });
  }

  async remove(id: string, userRole: string, userClientId?: string) {
    if (userRole === 'CLIENT' || userRole === 'MEMBER') {
      throw new ForbiddenException('Only CEO and Manager can delete clients');
    }

    return this.prisma.client.delete({
      where: { id }
    });
  }
}