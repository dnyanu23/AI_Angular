import { Component } from '@angular/core';
import { GenAIComponent } from '../component/gen-ai/gen-ai.component';
import { RagAiComponent } from '../component/rag-ai-component/rag-ai-component';
import { ChatAiComponent } from '../component/chat-ai-component/chat-ai-component';
//import { RagAi } from '../component/rag-ai/rag-ai';

@Component({
  selector: 'app-root',
  imports: [GenAIComponent, RagAiComponent, ChatAiComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'AiFree';
}
