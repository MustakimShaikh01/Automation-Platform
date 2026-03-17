import { Controller, Post, Get, Param, Body, Req, UseGuards, Headers } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WebhookService } from './webhook.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  // Public endpoint — receives inbound webhook triggers
  @Post('trigger/:token')
  @ApiOperation({ summary: 'Receive inbound webhook trigger (public)' })
  async trigger(
    @Param('token') token: string,
    @Body() body: any,
    @Headers('x-autoify-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    return this.webhookService.handleIncoming(token, body, signature, req.rawBody);
  }

  // Authenticated: manually trigger a workflow
  @Post('manual/:workflowId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Manually trigger a workflow (test run)' })
  async manualTrigger(
    @Param('workflowId') workflowId: string,
    @Body() body: any,
    @Req() req: any,
  ) {
    return this.webhookService.triggerManual(workflowId, req.user.tenantId, req.user.sub, body);
  }
}
