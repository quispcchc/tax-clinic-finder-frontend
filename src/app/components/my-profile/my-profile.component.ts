import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-my-profile',
  standalone: false,

  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss',
})
export class MyProfileComponent implements OnInit {
  userProfile: any = {};
  currentLanguage: string;

  constructor(private languageService: LanguageService) {
    this.currentLanguage = this.languageService.getLanguage();
  }

  ngOnInit(): void {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      this.userProfile = JSON.parse(storedProfile);
    }
  }
}
