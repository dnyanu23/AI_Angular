import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LlamaAiService } from '../../service/llama-ai.service';
import { RagAiService } from '../../service/rag-ai.service';

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
}

@Component({
  selector: 'app-chat-ai-component',
  imports: [FormsModule, CommonModule],
  templateUrl: './chat-ai-component.html',
  styleUrl: './chat-ai-component.css'
})
export class ChatAiComponent {
  messages: ChatMessage[] = [];
  //query = '';
  answer = '';

  contextEmbeddings: number[][] = [];
  inputText: string = '';
  minimized = false;
  passage = ["One sunny afternoon, Mia was playing in her backyard when she noticed something shiny near the old oak tree. Curious, she ran over and found a small, rusted key half-buried in the dirt." +
    "Excited, she showed it to her grandfather, who smiled and said it looked like the key to the attic trunk — a trunk no one had opened for many years." +
    "With her grandfather's help, Mia climbed up to the attic. Dust covered everything, and cobwebs hung in the corners." +
    "In the far corner sat a large wooden trunk. Mia nervously inserted the key, and with a little effort, it turned." +
    "The lid creaked open, revealing old photographs, letters, and a music box that still played a soft, sweet tune." +
    "Her grandfather gently picked up a photo and said, “These are memories from when your grandmother and I were young.” Mia realized she had unlocked more than just a trunk — she had discovered a piece of her family’s history."];


  constructor(private llamaService: LlamaAiService, private ragAiService: RagAiService) { // Replace with actual service if needed
    // Initialize with a welcome message
    this.preEmbedContext(); // Embed once at startup
    this.messages.push({ sender: 'assistant', text: 'Welcome to the chat! How can I assist you today?' });


  }
  async preEmbedContext() {
    alert('Precomputing context embeddings, please wait...');
    for (const chunk of this.passage) {
      const embedding = await this.ragAiService.getEmbedding('search_document: ' + chunk);
      this.contextEmbeddings.push(embedding);

    }
  }

  @ViewChild('chatBody') chatBody!: ElementRef;

  async sendMessage() {
    const text = this.inputText.trim();
    if (!text) return;
    else {
      this.messages.push({ sender: 'user', text });
      this.inputText = ''; // Clear input field after sending message
      let responseText = await this.ask(text);
      if (responseText) {
        this.messages.push({ sender: 'assistant', text: responseText });
      }
      else {
        this.messages.push({ sender: 'assistant', text: 'Sorry, I could not generate a response.' });
      }
      // this.llamaService.generate("deepseek-r1:1.5b", text).subscribe(
      //   response => {
      //     this.messages.push({ sender: 'assistant', text: this.removeThinkTags(response.response) });
      //   },
      //   error => {
      //     console.error('Error generating response:', error);
      //     this.messages.push({ sender: 'assistant', text: 'Sorry, I encountered an error while processing your request.' });
      //   }
      // );


      // setTimeout(() => {
      //   this.messages.push({ sender: 'assistant', text: 'This is an assistant response.' });
      // }, 500);
    }
  }

  async ask(query: string): Promise<string> {
    this.answer = 'Generating...';
    const queryEmbedding = await this.ragAiService.getEmbedding('search_query: ' + query);
    const SIMILARITY_THRESHOLD = 0.2;
    // Find most similar chunk
    let bestIndex = 0, bestScore = -Infinity;
    for (let i = 0; i < this.contextEmbeddings.length; i++) {
      const score = this.ragAiService.cosineSimilarity(queryEmbedding, this.contextEmbeddings[i]);
      if (score > bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }
    console.log('Best Index:', bestIndex, 'Score:', bestScore);
    if (bestScore < SIMILARITY_THRESHOLD) {
      this.answer = "The query is irrelevant to the context or topic.";
      return this.answer;
    } else {
      const selectedContext = this.passage[bestIndex];
      const prompt = `
Use the context below to answer the question:

Context:
${selectedContext}

Question:
${query}

Answers:`.trim();

      try {
        const response: any = await this.llamaService.generate("deepseek-r1:1.5b", prompt).toPromise();
        const cleaned = this.llamaService.removeThinkTags(response.response);
        this.answer = cleaned;
        return cleaned;
      } catch (error) {
        this.answer = "Error generating response:";
        return this.answer;
      }
    }
  }

  removeThinkTags(text: string): string {
    return text.replace(/<think>[\s\S]*?<\/think>/gi, '');
  }

  toggleMinimize() {
    this.minimized = !this.minimized;
  }

  ngAfterViewChecked() {
    if (this.chatBody && !this.minimized) {
      this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
    }
  }
}
