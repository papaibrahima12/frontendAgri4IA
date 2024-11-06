import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatResponse } from './models/chat-response.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ModelService {

  private apiUrl = 'http://localhost:3000/api/chat';
  
  constructor(private http: HttpClient) {}
  
  chat(messages:  Array<{ role: string; content: string }>): Observable<ChatResponse> {
    const body = {
      model: 'meta-llama/Llama-3.2-1B',
      messages: messages,
      temperature: 0.5,
    };
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${environment.llamaApiKey}`
    };

    return this.http.post<ChatResponse>(this.apiUrl, body, { headers });
  }
}
