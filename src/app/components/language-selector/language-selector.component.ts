import { Component, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-selector',
  standalone: false,
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent {

  currentLanguage: string = 'en';
  @Output() languageChanged = new EventEmitter<string>();

  constructor(private translate: TranslateService) {
   this.translate.setDefaultLang('en');
  }

  switchLanguage(language: string): void {
    this.currentLanguage = language;
    this.translate.use(this.currentLanguage);
    this.languageChanged.emit(this.currentLanguage);
  }
}
