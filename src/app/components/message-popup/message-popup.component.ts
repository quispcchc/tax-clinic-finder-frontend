import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-message-popup',
  standalone: false,
  
  templateUrl: './message-popup.component.html',
  styleUrl: './message-popup.component.scss'
})
export class MessagePopupComponent implements OnInit{
  @Input() message: string = '';
  @Input() isVisible: boolean = false;
  @Input() messageType: 'success' | 'error' = 'success';
  @Input() duration: number = 3000;
  @Output() closed = new EventEmitter<void>();

  ngOnInit() {
    if (this.isVisible && this.duration > 0) {
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
