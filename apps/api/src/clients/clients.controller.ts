import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ClientsService, CreateClientDto, UpdateClientDto } from './clients.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  create(@Body() createClientDto: CreateClientDto, @Request() req) {
    return this.clientsService.create(createClientDto, req.user.role);
  }

  @Get()
  findAll(@Request() req) {
    return this.clientsService.findAll(req.user.role, req.user.clientId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.clientsService.findOne(id, req.user.role, req.user.clientId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto, @Request() req) {
    return this.clientsService.update(id, updateClientDto, req.user.role, req.user.clientId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.clientsService.remove(id, req.user.role, req.user.clientId);
  }
}