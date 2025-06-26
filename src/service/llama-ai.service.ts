import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LlamaAiService {
    private apiUrl = 'http://localhost:11434/api'; // Replace with the actual API endpoint
    // private baseUrl = 'http://localhost:11434/api';
    private apiKey = 'your-api-key-here'; // Replace with your API key

    constructor(private http: HttpClient) { }

    chatWithLlama(prompt: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
        });

        const body = {
            prompt: prompt,
            max_tokens: 100 // Adjust as needed
        };

        return this.http.post<any>(this.apiUrl, body, { headers });
    }

    generate(model: string, prompt: string): Observable<any> {

        // console.log(prompt); // Log the prompt for debugging

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        const body = { model, prompt, stream: false };
        debugger;
        return this.http.post(`${this.apiUrl}/generate`, body, { headers });
    }

    chat(model: string, message: any): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        const body = { model, message, stream: false };
        console.log('Chat request body:', body); // Log the request body for debugging
        debugger;
        return this.http.post(`${this.apiUrl}/chat`, body, { headers });
    }

    removeThinkTags(text: string): string {
        return text.replace(/<think>[\s\S]*?<\/think>/gi, '');
    }

}