import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-filter',
  standalone: false,
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
  @Output() searchEvent = new EventEmitter<{ pincode: string; years: number }>();
  pincode: string = '';
  years: number = 0;

  constructor( private authService: AuthService, private router: Router) { }

  search() {
    this.searchEvent.emit({ pincode: this.pincode, years: this.years });
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
