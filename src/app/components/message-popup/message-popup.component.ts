import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message-popup',
  standalone: false,
  
  templateUrl: './message-popup.component.html',
  styleUrl: './message-popup.component.scss'
})
export class MessagePopupComponent {
  @Input() message: string = '';
  @Input() isVisible: boolean = false;
  @Input() messageType: 'success' | 'error' = 'success';
}
