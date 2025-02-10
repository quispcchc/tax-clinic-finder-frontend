import { Component } from '@angular/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-export-client-data',
  standalone: false,
  
  templateUrl: './export-client-data.component.html',
  styleUrl: './export-client-data.component.scss'
})
export class ExportClientDataComponent {
  currentLanguage: string;

  constructor(private languageService: LanguageService) {
    this.currentLanguage = this.languageService.getLanguage();
  }
}
