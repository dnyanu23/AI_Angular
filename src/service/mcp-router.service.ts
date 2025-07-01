import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MCP_CONFIG } from '../config/mcp-config';
import { firstValueFrom } from 'rxjs';

// Define a type for allowed actions based on MCP_CONFIG keys
type McpAction = keyof typeof MCP_CONFIG;

@Injectable({ providedIn: 'root' })
export class McpRouterService {
    constructor(private http: HttpClient) { }

    async routeAction(action: McpAction, parameters: any): Promise<any> {
        const entry = MCP_CONFIG[action];
        if (!entry) throw new Error(`No MCP mapping for action: ${action}`);
        return await firstValueFrom(this.http.post(entry.url, parameters));
    }
}
