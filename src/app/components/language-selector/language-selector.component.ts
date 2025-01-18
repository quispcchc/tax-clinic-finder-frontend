import { Component, EventEmitter, Output } from '@angular/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-language-selector',
  standalone: false,
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
})
export class LanguageSelectorComponent {
  currentLanguage: string;
  @Output() languageChanged = new EventEmitter<string>();

  constructor(private languageService: LanguageService) {
    this.currentLanguage = this.languageService.getLanguage();
  }

  switchLanguage(language: string): void {
    this.languageService.setLanguage(language);
    this.currentLanguage = language;
  }
}
