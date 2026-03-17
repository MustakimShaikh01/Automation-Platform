import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('ai')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('summarize')
  @ApiOperation({ summary: 'Summarize text using AI' })
  summarize(@Body() body: { text: string; prompt?: string }) {
    return this.aiService.summarize(body.text, body.prompt);
  }

  @Post('classify')
  @ApiOperation({ summary: 'Classify input into categories' })
  classify(@Body() body: { text: string; categories: string[] }) {
    return this.aiService.classify(body.text, body.categories);
  }

  @Post('generate')
  @ApiOperation({ summary: 'Generate content from prompt' })
  generate(@Body() body: { prompt: string; context?: any }) {
    return this.aiService.generate(body.prompt, body.context);
  }

  @Post('extract')
  @ApiOperation({ summary: 'Extract structured fields from text' })
  extract(@Body() body: { text: string; fields: string[] }) {
    return this.aiService.extract(body.text, body.fields);
  }
}
