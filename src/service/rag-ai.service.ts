import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RagAiService {
    private apiUrl = 'http://localhost:11434/api'; // Replace with the actual API endpoint

    constructor(private http: HttpClient) { }

    async getEmbedding(prompt: string): Promise<number[]> {
        const res: any = await this.http.post(`${this.apiUrl}/embeddings`, {
            model: 'nomic-embed-text:v1.5',
            prompt
        }).toPromise();
        return res.embedding;
    }

    cosineSimilarity(a: number[], b: number[]): number {
        const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
        const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
        const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
        return dot / (normA * normB);
    }

}