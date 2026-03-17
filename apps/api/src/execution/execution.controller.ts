import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ExecutionService } from './execution.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('executions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('executions')
export class ExecutionController {
  constructor(private readonly executionService: ExecutionService) {}

  @Get()
  @ApiOperation({ summary: 'Get execution logs for tenant' })
  findAll(
    @Req() req: any,
    @Query('workflowId') workflowId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.executionService.findAll(req.user.tenantId, workflowId, limit ? parseInt(limit) : 50);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get execution stats & analytics' })
  stats(@Req() req: any) {
    return this.executionService.getStats(req.user.tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get execution details with step logs' })
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.executionService.findOne(id, req.user.tenantId);
  }
}
