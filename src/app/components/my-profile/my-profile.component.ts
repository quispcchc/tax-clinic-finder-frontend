import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-profile',
  standalone: false,

  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss',
})
export class MyProfileComponent implements OnInit {
  userProfile: any = {};

  ngOnInit(): void {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      this.userProfile = JSON.parse(storedProfile);
    }
  }
}
