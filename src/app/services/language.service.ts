// language.service.ts
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private currentLanguage: string;

  constructor(private translate: TranslateService) {
    this.currentLanguage = localStorage.getItem('language') || 'en';
    this.translate.use(this.currentLanguage);
  }

  setLanguage(language: string): void {
    this.currentLanguage = language;
    this.translate.use(language);
    localStorage.setItem('language', language);
  }

  getLanguage(): string {
    return this.currentLanguage;
  }
}
