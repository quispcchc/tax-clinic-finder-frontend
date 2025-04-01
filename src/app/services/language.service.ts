import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private currentLanguage: string;
  languageChanged = new Subject<string>();

  constructor(private translate: TranslateService) {
    this.currentLanguage = localStorage.getItem('language') || 'en';
    this.translate.use(this.currentLanguage);
  }

  setLanguage(language: string): void {
    this.currentLanguage = language;
    this.translate.use(language);
    localStorage.setItem('language', language);
    this.languageChanged.next(language);
  }

  getLanguage(): string {
    return this.currentLanguage;
  }
}
