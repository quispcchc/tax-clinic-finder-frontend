import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  selectedTab: string = 'access-filter';

  constructor(private router: Router, private route: ActivatedRoute) {}

  onTabChange(tab: string): void {
    this.selectedTab = tab;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { selectedTab: tab },
      queryParamsHandling: 'merge', // to retain existing query parameters
    });
  }
}
