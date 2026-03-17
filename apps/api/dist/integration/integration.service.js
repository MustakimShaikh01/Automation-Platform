"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationService = exports.AVAILABLE_INTEGRATIONS = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto = __importStar(require("crypto"));
const ENCRYPTION_KEY = process.env.JWT_SECRET?.slice(0, 32).padEnd(32, '0') || '0'.repeat(32);
const IV_LENGTH = 16;
function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}
function decrypt(text) {
    const [ivHex, encryptedHex] = text.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
exports.AVAILABLE_INTEGRATIONS = [
    { provider: 'gmail', name: 'Gmail', icon: '📧', description: 'Send emails, read inbox, create drafts' },
    { provider: 'slack', name: 'Slack', icon: '💬', description: 'Post messages, create channels, manage users' },
    { provider: 'google_sheets', name: 'Google Sheets', icon: '📊', description: 'Read/write spreadsheet data' },
    { provider: 'stripe', name: 'Stripe', icon: '💳', description: 'Handle payments, subscriptions, webhooks' },
    { provider: 'twilio', name: 'Twilio', icon: '📞', description: 'SMS, voice calls, WhatsApp automation' },
    { provider: 'openai', name: 'OpenAI', icon: '🤖', description: 'AI text generation, analysis, embeddings' },
    { provider: 'notion', name: 'Notion', icon: '📝', description: 'Create pages, databases, and tasks' },
    { provider: 'airtable', name: 'Airtable', icon: '🗃️', description: 'Database automation and record management' },
];
let IntegrationService = class IntegrationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(tenantId) {
        const connected = await this.prisma.integration.findMany({
            where: { tenantId },
            select: { provider: true, name: true, isConnected: true, connectedAt: true },
        });
        const connectedMap = new Map(connected.map((c) => [c.provider, c]));
        return exports.AVAILABLE_INTEGRATIONS.map((integration) => {
            const conn = connectedMap.get(integration.provider);
            return {
                ...integration,
                connected: !!conn?.isConnected,
                connectedAt: conn?.connectedAt,
            };
        });
    }
    async connect(tenantId, provider, credentials) {
        const encrypted = encrypt(JSON.stringify(credentials));
        return this.prisma.integration.upsert({
            where: { tenantId_provider: { tenantId, provider } },
            create: {
                tenantId,
                provider,
                name: exports.AVAILABLE_INTEGRATIONS.find((i) => i.provider === provider)?.name || provider,
                credentials: encrypted,
                isConnected: true,
                connectedAt: new Date(),
            },
            update: {
                credentials: encrypted,
                isConnected: true,
                connectedAt: new Date(),
            },
        });
    }
    async disconnect(tenantId, provider) {
        return this.prisma.integration.updateMany({
            where: { tenantId, provider },
            data: { isConnected: false },
        });
    }
    async getCredentials(tenantId, provider) {
        const integration = await this.prisma.integration.findUnique({
            where: { tenantId_provider: { tenantId, provider } },
        });
        if (!integration || !integration.isConnected)
            return null;
        return JSON.parse(decrypt(integration.credentials));
    }
};
exports.IntegrationService = IntegrationService;
exports.IntegrationService = IntegrationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], IntegrationService);
//# sourceMappingURL=integration.service.js.map