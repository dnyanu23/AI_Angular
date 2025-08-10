import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GenAIComponent } from '../component/gen-ai/gen-ai.component';
import { RagAiComponent } from '../component/rag-ai-component/rag-ai-component';
import { ChatAiComponent } from '../component/chat-ai-component/chat-ai-component';
import { LlmService } from '../service/llm.service';
import { McpRouterService } from '../service/mcp-router.service';
import { AiAgentComponent } from '../component/ai-agent-component/ai-agent-component';
//import { RagAi } from '../component/rag-ai/rag-ai';

@Component({
  selector: 'app-root',
  //imports: [FormsModule, CommonModule],
  imports: [AiAgentComponent, GenAIComponent, RagAiComponent, ChatAiComponent],

  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'AiFree';

  userPrompt = '';
  response: any;

  constructor(private llm: LlmService, private router: McpRouterService) { }
  async handlePrompt() {
    try {
      const result = await this.llm.classifyUserPrompt(this.userPrompt);
      this.response = await this.router.routeAction(result.action, result.parameters);
    } catch (err: any) {
      this.response = { error: err.message };
    }
  }

}
