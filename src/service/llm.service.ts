import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MCP_CONFIG } from '../config/mcp-config';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LlmService {
    private ollamaUrl = 'http://localhost:11434/api/generate';

    constructor(private http: HttpClient) { }

    async classifyUserPrompt(userPrompt: string): Promise<any> {
        const toolConfig = Object.entries(MCP_CONFIG)
            .map(([action, data]) => `${action} → ${data.tool}`)
            .join('\n');

        console.log('Tool Config:', toolConfig);

        const prompt = `
You are an intelligent AI agent routing prompts to MCP tools.

Return a JSON like this:

{
  "action": "<action>",
  "tool": "<tool>",
  "parameters": { ... }
}

Available tools:
${toolConfig}

User request: ${userPrompt}
Only return valid JSON.
    `;

        console.log('Generated Prompt:', prompt);

        const response = await firstValueFrom(this.http.post<any>(this.ollamaUrl, {
            model: 'llama3.2:latest',
            prompt,
            stream: false
        }));
        console.log('LLM Response:', response);
        return JSON.parse(response.response);
    }
}
