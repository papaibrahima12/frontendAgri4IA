import { Component, ElementRef, ViewChild } from '@angular/core';
import { ModelService } from './model.service';
import { catchError, take, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  userMessage = '';
  conversation: Array<{ role: string; content: string }> = [
    { role: 'system', content: "Pour des conseils sur les meilleures pratiques agricoles, n'hésitez pas à nous poser des questions !" }
  ];

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  constructor(private modelService: ModelService) {}

  sendMessage(event: Event, message: string): void {
    event.preventDefault();
    if (!message.trim()) return;

    this.conversation.push({ role: 'user', content: message });
    this.userMessage = '';

    const instruction = 'Donner une réponse basée sur les pratiques agricoles.';
    const inputData = message;

   this.modelService
      .chat(inputData)
      .pipe(
        take(1),
        tap(response => {
          this.conversation.push({ role: 'assistant', content: response.response });
          this.scrollToBottom();
          console.log('resp',response)
        }),
        catchError(error => this.handleError(error))
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

  private handleError(error: any): Observable<unknown> {
    const errorMessage = error?.error?.detail
      ? `Erreur : ${error.error.detail[0]?.msg ?? 'Détail non spécifié'}`
      : 'Une erreur inconnue est survenue.';
    this.conversation.push({ role: 'error', content: errorMessage });
    this.scrollToBottom();
    return of(null);
  }
}
