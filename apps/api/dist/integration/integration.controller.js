"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const integration_service_1 = require("./integration.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let IntegrationController = class IntegrationController {
    integrationService;
    constructor(integrationService) {
        this.integrationService = integrationService;
    }
    findAll(req) {
        return this.integrationService.findAll(req.user.tenantId);
    }
    connect(provider, body, req) {
        return this.integrationService.connect(req.user.tenantId, provider, body.credentials);
    }
    disconnect(provider, req) {
        return this.integrationService.disconnect(req.user.tenantId, provider);
    }
};
exports.IntegrationController = IntegrationController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all available integrations with connection status' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], IntegrationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(':provider/connect'),
    (0, swagger_1.ApiOperation)({ summary: 'Connect an integration (stores encrypted credentials)' }),
    __param(0, (0, common_1.Param)('provider')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], IntegrationController.prototype, "connect", null);
__decorate([
    (0, common_1.Delete)(':provider/disconnect'),
    (0, swagger_1.ApiOperation)({ summary: 'Disconnect an integration' }),
    __param(0, (0, common_1.Param)('provider')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], IntegrationController.prototype, "disconnect", null);
exports.IntegrationController = IntegrationController = __decorate([
    (0, swagger_1.ApiTags)('integrations'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('integrations'),
    __metadata("design:paramtypes", [integration_service_1.IntegrationService])
], IntegrationController);
//# sourceMappingURL=integration.controller.js.map