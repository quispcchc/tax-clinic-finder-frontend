import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class PostalCodeService {
  //private readonly GOOGLE_MAPS_API_KEY = 'AIzaSyBc3mEkYs8ZzYf5onUt4vi5jjsQ6cogV40';
  //private readonly GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';
  private postalCodeCache: Map<string, [number, number]> = new Map();
  private readonly OTTAWA_BOUNDS = {
    north: 45.6,
    south: 45.2,
    west: -76.0,
    east: -75.3,
  };

  constructor() {
    this.loadCacheFromLocalStorage();
  }

  private loadCacheFromLocalStorage(): void {
    const storedCache = localStorage.getItem('postalCodeCache');
    if (storedCache) {
      this.postalCodeCache = new Map(JSON.parse(storedCache));
    }
  }
}
