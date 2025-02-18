import { Injectable } from '@angular/core';
import axios from 'axios';
import boundaryData from '../../assets/data/catchment-boundaries.json';

@Injectable({
  providedIn: 'root',
})
export class PostalCodeService {
  private readonly GOOGLE_MAPS_API_KEY = 'AIzaSyBc3mEkYs8ZzYf5onUt4vi5jjsQ6cogV40';
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

  async geocodeRegionNames(regionNames: string[]): Promise<[number, number][]> {
    const coordinates: [number, number][] = [];
  
    for (const region of regionNames) {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            region + ', Ottawa, Canada'
          )}&key=${this.GOOGLE_MAPS_API_KEY}`
        );
  
        if (response.data.status === 'OK' && response.data.results.length > 0) {
          const { lat, lng } = response.data.results[0].geometry.location;
  
          // Check if the location is inside Ottawa's boundaries
          if (
            lat >= this.OTTAWA_BOUNDS.south &&
            lat <= this.OTTAWA_BOUNDS.north &&
            lng >= this.OTTAWA_BOUNDS.west &&
            lng <= this.OTTAWA_BOUNDS.east
          ) {
            coordinates.push([lat, lng]);
          } else {
            console.warn(`Filtered out ${region} as it's outside Ottawa.`);
          }
        }
      } catch (error) {
        console.error(`Error geocoding region ${region}:`, error);
      }
    }
  
    return coordinates;
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

  async getCatchmentBoundary(area: string): Promise<[number, number][]> {
    const feature = boundaryData.features.find((f: any) => f.properties.name.toLowerCase() === area.toLowerCase());
  
    if (feature) {
      // Flattening the coordinates array and ensuring the return type is [number, number][]
      return feature.geometry.coordinates[0].map((coord: number[]) => [coord[0], coord[1]]);
    } else {
      console.warn(`Boundary for ${area} not found.`);
      return [];
    }
  }  
}
