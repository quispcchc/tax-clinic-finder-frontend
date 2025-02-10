import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  selectedTab: string = 'access-filter';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['selectedTab']) {
        this.selectedTab = params['selectedTab'];
      }
    });

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;

        const menuPaths = [
          '/dashboard/my-profile',
          '/dashboard/user-management',
          '/dashboard/tax-clinic-management',
          '/dashboard/export-client-data'
        ];

        if (menuPaths.some((path) => url.startsWith(path))) {
          return;
        }

        if (url === '/dashboard' || url.startsWith('/dashboard?')) {
          const queryParams = this.route.snapshot.queryParams;
          this.selectedTab = queryParams['selectedTab'] || 'access-filter';

          this.router.navigate(['/dashboard'], {
            queryParams: { selectedTab: this.selectedTab },
            replaceUrl: true,
          });
        }
      }
    });
  }

  onTabChange(tab: string): void {
    this.selectedTab = tab;

    this.router.navigate(['/dashboard'], {
      queryParams: { selectedTab: tab },
    });
  }
}
