import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OpenAIService {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly defaultModel: string;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.baseUrl = this.configService.get<string>('OPENAI_BASE_URL') || 'https://openrouter.ai/api/v1/chat/completions';
    this.defaultModel = this.configService.get<string>('OPENAI_DEFAULT_MODEL') || 'openai/gpt-oss-20b:free';
    this.apiKey = this.configService.get<string>('OPEN_API_KEY') || '';
  }

  async sendMessage(message: string, model?: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          this.baseUrl,
          {
            model: this.defaultModel,
            messages: [
              {
                role: 'user',
                content: message,
              },
            ],
          },
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
            timeout: 60000, // 60 seconds timeout
          },
        ),
      );

      return response.data;
    } catch (error: any) {
      console.error('OpenAI API Error:', error.response?.data || error.message);
      throw new HttpException(
        {
          message: 'Failed to get response from OpenAI',
          error: error.response?.data || error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sendConversation(messages: Array<{ role: string; content: string }>, model?: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          this.baseUrl,
          {
            model: this.defaultModel,
            messages: messages,
          },
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
            timeout: 60000,
          },
        ),
      );

      return response.data;
    } catch (error: any) {
      console.error('OpenAI API Error:', error.response?.data || error.message);
      throw new HttpException(
        {
          message: 'Failed to get response from OpenAI',
          error: error.response?.data || error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}