import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { LlamaAiService } from '../../service/llama-ai.service';
import { RagAiService } from '../../service/rag-ai.service';



@Component({
  selector: 'app-rag-ai-component',
  imports: [FormsModule, CommonModule],
  templateUrl: './rag-ai-component.html',
  styleUrl: './rag-ai-component.css'
})
export class RagAiComponent {

  query = '';
  answer = '';
  contextChunks = [
    "One sunny afternoon, Mia was playing in her backyard when she noticed something shiny near the old oak tree. Curious, she ran over and found a small, rusted key half-buried in the dirt." +
    "Excited, she showed it to her grandfather, who smiled and said it looked like the key to the attic trunk — a trunk no one had opened for many years." +
    "With her grandfather's help, Mia climbed up to the attic. Dust covered everything, and cobwebs hung in the corners." +
    "In the far corner sat a large wooden trunk. Mia nervously inserted the key, and with a little effort, it turned." +
    "The lid creaked open, revealing old photographs, letters, and a music box that still played a soft, sweet tune." +
    "Her grandfather gently picked up a photo and said, “These are memories from when your grandmother and I were young.” Mia realized she had unlocked more than just a trunk — she had discovered a piece of her family’s history."
  ];
  contextEmbeddings: number[][] = [];

  constructor(private http: HttpClient, private llamaAIService: LlamaAiService,
    private ragAiService: RagAiService) {
    this.preEmbedContext(); // Embed once at startup
    console.log(this.contextEmbeddings);
  }

  async preEmbedContext() {
    for (const chunk of this.contextChunks) {
      const embedding = await this.ragAiService.getEmbedding('search_document: ' + chunk);
      this.contextEmbeddings.push(embedding);
    }
  }



  async ask() {
    this.answer = 'Generating...';
    const queryEmbedding = await this.ragAiService.getEmbedding('search_query: ' + this.query);
    const SIMILARITY_THRESHOLD = 0.5;
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
      return;
    }
    else {

      const selectedContext = this.contextChunks[bestIndex];
      const prompt = `
Use the context below to answer the question:

Context:
${selectedContext}

Question:
${this.query}

Answers:`.trim();

      // console.log('Final OUtput:' + this.llamaAIService.generate('deepseek-r1:1.5b', prompt,));
      this.llamaAIService.generate("deepseek-r1:1.5b", prompt).subscribe((response: any) => {
        console.log('Generated response:', response.response);

        this.answer = this.llamaAIService.removeThinkTags(response.response);

      }, (error: any) => {
        console.error('Error generating response:', error);
      });
    }
    // const res: any = await this.http.post('http://localhost:11434/api/generate', {
    //   model: 'llama3:latest',
    //   prompt
    // }).toPromise();

    // this.answer = res.response || '(No response)';
  }
}

