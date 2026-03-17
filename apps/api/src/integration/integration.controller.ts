import { Controller, Get, Post, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IntegrationService } from './integration.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('integrations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('integrations')
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Get()
  @ApiOperation({ summary: 'List all available integrations with connection status' })
  findAll(@Req() req: any) {
    return this.integrationService.findAll(req.user.tenantId);
  }

  @Post(':provider/connect')
  @ApiOperation({ summary: 'Connect an integration (stores encrypted credentials)' })
  connect(
    @Param('provider') provider: string,
    @Body() body: { credentials: Record<string, string> },
    @Req() req: any,
  ) {
    return this.integrationService.connect(req.user.tenantId, provider, body.credentials);
  }

  @Delete(':provider/disconnect')
  @ApiOperation({ summary: 'Disconnect an integration' })
  disconnect(@Param('provider') provider: string, @Req() req: any) {
    return this.integrationService.disconnect(req.user.tenantId, provider);
  }
}
