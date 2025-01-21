import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() selectedTab: string = 'access-filter'; 
  @Output() languageChanged = new EventEmitter<string>();
  @Output() tabChanged = new EventEmitter<string>();
  currentLanguage: string;
  menuOpen: boolean = false;

  constructor(private languageService: LanguageService,     private authService: AuthService, private router: Router) {
    this.currentLanguage = this.languageService.getLanguage();
  }

  switchTab(tab: string) {
    this.selectedTab = tab;
    this.tabChanged.emit(tab);
  }

  switchLanguage(language: string): void {
    this.languageService.setLanguage(language);
    this.currentLanguage = language;
    this.languageChanged.emit(language);
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const menuElement = document.querySelector('.menu-dropdown');
    const menuButtonElement = document.querySelector('.menu-button');

    if (
      menuElement && !menuElement.contains(event.target as Node) &&
      menuButtonElement && !menuButtonElement.contains(event.target as Node)
    ) {
      this.menuOpen = false;
    }
  }

  navigateTo(route: string): void {
    this.menuOpen = false;
    this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logout();
  }
}
