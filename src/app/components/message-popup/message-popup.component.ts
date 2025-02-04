import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-message-popup',
  standalone: false,
  
  templateUrl: './message-popup.component.html',
  styleUrl: './message-popup.component.scss'
})
export class MessagePopupComponent implements OnChanges {
  @Input() message: string = '';
  @Input() isVisible: boolean = false;
  @Input() messageType: 'success' | 'error' = 'success';
  @Input() duration: number = 3000;
  @Output() closed = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isVisible'] && this.isVisible) {
      setTimeout(() => {
        this.closePopup();
      }, this.duration);
    }
  }

  closePopup() {
    this.isVisible = false;
    this.closed.emit();
  }
}
