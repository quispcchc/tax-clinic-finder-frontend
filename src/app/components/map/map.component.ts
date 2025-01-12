import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Clinic } from '../../models/clinic.model';
import * as L from 'leaflet';
import axios from 'axios';

@Component({
  selector: 'app-map',
  standalone: false,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges {
  @Input() clinics: Clinic[] = []; // Input to receive filtered clinics
  private map!: L.Map; // Map instance
  private markers: L.LayerGroup = L.layerGroup(); // Layer group for markers and catchment areas

  ngOnInit(): void {
    this.initializeMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clinics']) {
      this.updateMap();
    }
  }

  private initializeMap(): void {
    const defaultLat = 45.424721; // Default latitude (Ottawa, Canada)
    const defaultLng = -75.695000; // Default longitude
    const defaultZoom = 12; // Default zoom level

    // Initialize the map
    this.map = L.map('map', {
      center: [defaultLat, defaultLng],
      zoom: defaultZoom,
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    // Add the marker layer group to the map
    this.markers.addTo(this.map);
  }

  private async updateMap(): Promise<void> {
    if (!this.map) return;

    // Clear existing markers and layers
    this.markers.clearLayers();

    // Define bounds for all clinics
    const bounds: L.LatLngBounds = L.latLngBounds([]);

    for (const clinic of this.clinics) {
      try {
        // Geocode the clinic address to get latitude and longitude
        const { lat, lng } = await this.geocodeAddress(clinic.address);

        const clinicLatLng = L.latLng(lat, lng);

        // Add marker for the clinic
        const marker = L.marker(clinicLatLng).bindPopup(`
          <strong>${clinic.name}</strong><br>
          ${clinic.address}<br>
          Type: ${clinic.appointmentType || 'N/A'}<br>
          Language: ${clinic.languageRequirements || 'N/A'}
        `);

        // Add catchment area as a circle (5 km radius)
        const catchmentArea = L.circle(clinicLatLng, {
          radius: 5000, // 5 km radius
          color: 'blue',
          fillColor: '#a3caff',
          fillOpacity: 0.5,
        });

        // Add marker and catchment area to the layer group
        this.markers.addLayer(marker);
        this.markers.addLayer(catchmentArea);

        // Extend map bounds to include this clinic
        bounds.extend(clinicLatLng);
      } catch (error) {
        console.error(`Failed to geocode address for clinic "${clinic.name}":`, error);
      }
    }

    // Adjust map view to fit all clinics or reset to default if no clinics
    if (bounds.isValid()) {
      this.map.fitBounds(bounds, { padding: [20, 20] });
    } else {
      this.map.setView([45.424721, -75.695000], 12); // Default view if no valid clinics
    }
  }

  private async geocodeAddress(address: string): Promise<{ lat: number; lng: number }> {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&addressdetails=1&limit=1`;

    const response = await axios.get(url);
    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
      };
    } else {
      throw new Error('Geocoding failed: No results found');
    }
  }
}
