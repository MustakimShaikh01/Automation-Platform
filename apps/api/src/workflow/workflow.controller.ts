import { Controller, Get, Post, Put, Delete, Patch, Param, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WorkflowService } from './workflow.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('workflows')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workflows')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Get()
  @ApiOperation({ summary: 'List all workflows for tenant' })
  findAll(@Req() req: any) {
    return this.workflowService.findAll(req.user.tenantId);
  }

  @Get('templates')
  @ApiOperation({ summary: 'Get public workflow templates' })
  getTemplates() {
    return this.workflowService.getTemplates();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single workflow with recent executions' })
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.workflowService.findOne(id, req.user.tenantId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new workflow' })
  create(@Body() dto: any, @Req() req: any) {
    return this.workflowService.create(dto, req.user.tenantId, req.user.sub);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update workflow (including saving graph)' })
  update(@Param('id') id: string, @Body() dto: any, @Req() req: any) {
    return this.workflowService.update(id, dto, req.user.tenantId);
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Toggle workflow active/inactive' })
  toggle(@Param('id') id: string, @Req() req: any) {
    return this.workflowService.toggle(id, req.user.tenantId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a workflow' })
  delete(@Param('id') id: string, @Req() req: any) {
    return this.workflowService.delete(id, req.user.tenantId);
  }
}
