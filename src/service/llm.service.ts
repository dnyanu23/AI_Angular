import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MCP_CONFIG } from '../config/mcp-config';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LlmService {
    private ollamaUrl = 'http://localhost:11434/api/generate';

    constructor(private http: HttpClient) { }

    /**
     * Extracts and parses only the JSON part from a string response.
     */
    private extractJson(response: string): any {
        const start = response.indexOf('{');
        const end = response.lastIndexOf('}');
        if (start === -1 || end === -1 || end < start) {
            throw new Error('No valid JSON found in response');
        }
        const jsonStr = response.substring(start, end + 1);
        return JSON.parse(jsonStr);
    }

    async classifyUserPrompt(userPrompt: string): Promise<any> {
        debugger;
        const toolConfig = Object.entries(MCP_CONFIG)
            .map(([action, data]) => `${action} → ${data.tool} → ${JSON.stringify(data.parameters)} `)
            .join('\n');

        console.log('Tool Config:', toolConfig);

        const prompt = `
        You are an intelligent AI agent responsible for routing user commands to specific MCP tools.

        Use only the tools and parameters exactly as defined below. Do not create new tools, parameters, or structures.
        Return a JSON like this:

        {
         "actions": [
            {
            "action": "<action>",
            "tool": "<tool>",
            "parameters": { ... }
            }, ...
            ]
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
        const json = this.extractJson(response.response);
        console.log(json);
        return json;
    }
}
