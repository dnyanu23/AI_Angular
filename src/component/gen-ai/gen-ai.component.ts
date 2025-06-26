import { Component } from '@angular/core';
import { LlamaAiService } from '../../service/llama-ai.service'; // Adjust the path as necessary
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-gen-ai',
  imports: [FormsModule, CommonModule],
  templateUrl: './gen-ai.component.html',
  styleUrl: './gen-ai.component.css'
})
export class GenAIComponent {

  data: any; // Initialize data to store the response
  outputData: any;
  isLoading: boolean = false; // Initialize isLoading to false
  message: any[] = []; // Initialize message as an empty array  
  inputData: any;
  prompt: string = "";
  constructor(private llamaAIService: LlamaAiService) { }

  generate() {
    debugger;

    if (this.inputData === undefined || this.inputData === "") {
      alert('Input data is empty or undefined');
    }
    else {
      this.isLoading = true; // Set isLoading to true when starting the request
      this.prompt = this.inputData;
      this.llamaAIService.generate("deepseek-r1:1.5b", this.prompt).subscribe((response: any) => {
        console.log('Generated response:', response.response);
        this.isLoading = false;
        this.outputData = response.response;

      }, (error: any) => {
        console.error('Error generating response:', error);
      });
    }

  }

  clear() {
    this.inputData = "";
    this.outputData = "";

  }
  chat() {
    debugger;
    this.message = [{ role: 'user', content: 'Why is the sky blue? Give the shortest answer possible in under 20 words' }];
    this.llamaAIService.chat("llama3.2", this.message).subscribe((response: any) => {
      console.log('Generated response:', response);
      this.data = response.response; // Store the response in the data property
    }, (error: any) => {
      console.error('Error generating response:', error);
    });
  }
}
