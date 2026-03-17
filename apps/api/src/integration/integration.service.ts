import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

const ENCRYPTION_KEY = process.env.JWT_SECRET?.slice(0, 32).padEnd(32, '0') || '0'.repeat(32);
const IV_LENGTH = 16;

function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text: string): string {
  const [ivHex, encryptedHex] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

export const AVAILABLE_INTEGRATIONS = [
  { provider: 'gmail', name: 'Gmail', icon: '📧', description: 'Send emails, read inbox, create drafts' },
  { provider: 'slack', name: 'Slack', icon: '💬', description: 'Post messages, create channels, manage users' },
  { provider: 'google_sheets', name: 'Google Sheets', icon: '📊', description: 'Read/write spreadsheet data' },
  { provider: 'stripe', name: 'Stripe', icon: '💳', description: 'Handle payments, subscriptions, webhooks' },
  { provider: 'twilio', name: 'Twilio', icon: '📞', description: 'SMS, voice calls, WhatsApp automation' },
  { provider: 'openai', name: 'OpenAI', icon: '🤖', description: 'AI text generation, analysis, embeddings' },
  { provider: 'notion', name: 'Notion', icon: '📝', description: 'Create pages, databases, and tasks' },
  { provider: 'airtable', name: 'Airtable', icon: '🗃️', description: 'Database automation and record management' },
];

@Injectable()
export class IntegrationService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string) {
    const connected = await (this.prisma as any).integration.findMany({
      where: { tenantId },
      select: { provider: true, name: true, isConnected: true, connectedAt: true },
    });
    const connectedMap = new Map(connected.map((c: any) => [c.provider, c]));

    return AVAILABLE_INTEGRATIONS.map((integration) => {
      const conn = connectedMap.get(integration.provider) as any;
      return {
        ...integration,
        connected: !!conn?.isConnected,
        connectedAt: conn?.connectedAt,
      };
    });
  }

  async connect(tenantId: string, provider: string, credentials: Record<string, string>) {
    const encrypted = encrypt(JSON.stringify(credentials));
    return (this.prisma as any).integration.upsert({
      where: { tenantId_provider: { tenantId, provider } },
      create: {
        tenantId,
        provider,
        name: AVAILABLE_INTEGRATIONS.find((i) => i.provider === provider)?.name || provider,
        credentials: encrypted as any,
        isConnected: true,
        connectedAt: new Date(),
      },
      update: {
        credentials: encrypted as any,
        isConnected: true,
        connectedAt: new Date(),
      },
    });
  }

  async disconnect(tenantId: string, provider: string) {
    return (this.prisma as any).integration.updateMany({
      where: { tenantId, provider },
      data: { isConnected: false },
    });
  }

  async getCredentials(tenantId: string, provider: string): Promise<Record<string, string> | null> {
    const integration = await (this.prisma as any).integration.findUnique({
      where: { tenantId_provider: { tenantId, provider } },
    });
    if (!integration || !integration.isConnected) return null;
    return JSON.parse(decrypt(integration.credentials as string));
  }
}
