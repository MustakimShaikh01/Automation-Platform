import { Controller, Get, Put, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TenantService } from './tenant.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('tenants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get('me')
  getMyTenant(@Req() req: any) {
    return this.tenantService.findById(req.user.tenantId);
  }

  @Get('me/usage')
  getUsage(@Req() req: any) {
    return this.tenantService.getUsage(req.user.tenantId);
  }

  @Put('me')
  updateBranding(@Req() req: any, @Body() dto: any) {
    return this.tenantService.update(req.user.tenantId, dto);
  }
}
