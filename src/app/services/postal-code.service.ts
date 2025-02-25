import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PostalCodeService {

  private postalCodeCache: Map<string, [number, number]> = new Map();

  constructor() {
    this.loadCacheFromLocalStorage();
  }

  private loadCacheFromLocalStorage(): void {
    const storedCache = localStorage.getItem('postalCodeCache');
    if (storedCache) {
      this.postalCodeCache = new Map(JSON.parse(storedCache));
    }
  }

  private saveCacheToLocalStorage(): void {
    localStorage.setItem('postalCodeCache', JSON.stringify(Array.from(this.postalCodeCache.entries())));
  }

  async getCoordinates(address: string): Promise<{ lat: number; lng: number }> {
    if (this.postalCodeCache.has(address)) {
      const [lat, lng] = this.postalCodeCache.get(address)!;
      return { lat, lng };
    }

    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${environment.googleMapsApiKey}`;

    try {
      const response = await axios.get(url);
      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const result = response.data.results[0].geometry.location;
        this.postalCodeCache.set(address, [result.lat, result.lng]);
        this.saveCacheToLocalStorage();
        return { lat: result.lat, lng: result.lng };
      } else {
        throw new Error(`Geocoding failed: ${response.data.status}`);
      }
    } catch (error) {
      console.error(`Error geocoding address: ${address}`, error);
      throw error;
    }
  }
}
