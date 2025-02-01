import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class PostalCodeService {
  //private readonly GOOGLE_MAPS_API_KEY = 'AIzaSyBc3mEkYs8ZzYf5onUt4vi5jjsQ6cogV40';
  private readonly GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';
  private postalCodeCache: Map<string, [number, number]> = new Map();

  constructor() {
    this.loadCacheFromLocalStorage();
  }

  // Load cache from localStorage when service initializes
  private loadCacheFromLocalStorage(): void {
    const storedCache = localStorage.getItem('postalCodeCache');
    if (storedCache) {
      this.postalCodeCache = new Map(JSON.parse(storedCache));
    }
  }

  // Save cache to localStorage
  private saveCacheToLocalStorage(): void {
    localStorage.setItem(
      'postalCodeCache',
      JSON.stringify(Array.from(this.postalCodeCache.entries()))
    );
  }

  // Fetch coordinates for multiple postal codes with caching
  async geocodePostalCodes(postalCodes: string[]): Promise<[number, number][]> {
    const coordinates: [number, number][] = [];

    for (const postalCode of postalCodes) {
      if (this.postalCodeCache.has(postalCode)) {
        coordinates.push(this.postalCodeCache.get(postalCode)!);
        continue;
      }

      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            postalCode + ', Canada'
          )}&key=${this.GOOGLE_MAPS_API_KEY}`
        );

        if (response.data.status === 'OK' && response.data.results.length > 0) {
          const { lat, lng } = response.data.results[0].geometry.location;
          this.postalCodeCache.set(postalCode, [lat, lng]);
          coordinates.push([lat, lng]);
        }
      } catch (error) {
        console.error(`Error geocoding postal code ${postalCode}:`, error);
      }
    }

    this.saveCacheToLocalStorage();
    return coordinates;
  }
}
