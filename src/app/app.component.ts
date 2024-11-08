import { Component, ElementRef, ViewChild } from '@angular/core';
import { catchError, take, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Message } from './models/message.model';
import { ErrorResponse } from './models/chat-response.model';
import { ModelService } from './model.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  userMessage = '';
  conversation: Message[] = [
    { role: 'system', content: "Bonjour et Bienvenue dans votre platform AGRI 4 IA. \n Pour des conseils sur les meilleures pratiques agricoles, n'hésitez pas à nous poser des questions sur l'agriculture .  " }
  ];

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  constructor(private modelService: ModelService) {}

  sendMessage(event: Event, message: string): void {
    event.preventDefault();
    if (!message.trim()) return;

    this.conversation.push({ role: 'user', content: message });
    this.userMessage = '';

    this.modelService
      .chat(this.conversation)
      .pipe(
        take(1),
        tap(response => {
          const assistantMessage = response.choices[0].message.content;
          this.conversation.push({ role: 'assistant', content: assistantMessage });
          this.scrollToBottom();
        }),
        catchError((error) => this.handleError(error))
      )
      .subscribe();
  }

  handleEnterKey(event: Event): void {
    event.preventDefault();
    this.sendMessage(event, this.userMessage);
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    setTimeout(() => {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    }, 0);
  }

  private handleError(error: ErrorResponse): Observable<unknown> {
    if (error.error && error.error.message) {
      let errorMessage = `Error: ${error.error.message}`;
      if (error.error.type) {
        errorMessage += ` (Type: ${error.error.type})`;
      }
      this.conversation.push({ role: 'error', content: errorMessage });
    } else {
      this.conversation.push({ role: 'error', content: 'An unknown error occurred.' });
    }
    this.scrollToBottom();
    return of(null);
  }
}
