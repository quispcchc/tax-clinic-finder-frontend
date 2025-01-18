import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() selectedTab!: string;
  @Output() languageChanged = new EventEmitter<string>();
  @Output() tabChanged = new EventEmitter<string>();
  currentLanguage: string;

  constructor(private languageService: LanguageService) {
    this.currentLanguage = this.languageService.getLanguage();
  }

  switchTab(tab: string) {
    this.selectedTab = tab;
    this.tabChanged.emit(tab); // Emit the selected tab to the parent
  }

  switchLanguage(language: string): void {
    this.languageService.setLanguage(language);
    this.currentLanguage = language;
    this.languageChanged.emit(language);
  }
}
