import { Component } from '@angular/core';
import { LlmService } from '../../service/llm.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { McpRouterService } from '../../service/mcp-router.service';

@Component({
  selector: 'app-ai-agent-component',
  imports: [FormsModule, CommonModule],
  templateUrl: './ai-agent-component.html',
  styleUrl: './ai-agent-component.css'
})
export class AiAgentComponent {

  userPrompt = '';
  response: any;
  textareaFocused = false;
  buttonActive = false;

  constructor(private llm: LlmService, private router: McpRouterService) { }
  async handlePrompt() {
    this.response = null; // Reset response before processing
    try {
      const result = await this.llm.classifyUserPrompt(this.userPrompt);
      this.response = await this.router.routeAction(result.action, result.parameters);
    } catch (err: any) {
      this.response = { error: err.message };
    }
  }
}
