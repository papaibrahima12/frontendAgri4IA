import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModelService {
  private apiUrl = `${environment.apiUrl}/predict`;

  constructor(private http: HttpClient) {}

  chat(inputData: string): Observable<{ response: string }> {
    const body = {input_data: inputData };
    const headers = {
      'Content-Type': 'application/json',
    };

    return this.http.post<{ response: string }>(this.apiUrl, body, { headers });
  }
}
