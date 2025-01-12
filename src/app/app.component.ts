import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Tax Clinic Finder';
  selectedLanguage: string = 'en';

  clinics = [
    { name: 'Clinic A', pincode: '12345', years: 5, lat: 40.73061, lng: -73.935242 },
    { name: 'Clinic B', pincode: '67890', years: 3, lat: 40.650002, lng: -73.949997 }
  ];
  filteredClinics = this.clinics;

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang(this.selectedLanguage);
  }

  changeLanguage(language: string) {
    this.selectedLanguage = language;
    this.translate.use(language);
  }
}
