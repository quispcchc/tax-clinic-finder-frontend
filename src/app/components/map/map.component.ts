import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Clinic } from '../../models/clinic.model';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: false,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges {
  @Input() clinics: Clinic[] = []; // Input to receive filtered clinics
  map!: L.Map; // Map instance
  markers: L.LayerGroup = L.layerGroup(); // Layer group for markers and catchment areas

  ngOnInit(): void {
    this.initializeMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clinics'] && this.clinics.length > 0) {
      this.updateMap();
    }
  }

  private initializeMap(): void {
    const defaultLat = 45.424721; // Default latitude
    const defaultLng = -75.695000; // Default longitude
    const defaultZoom = 12; // Default zoom level

    // Initialize the map
    this.map = L.map('map', {
      center: [defaultLat, defaultLng],
      zoom: defaultZoom
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Add the marker layer group
    this.markers.addTo(this.map);
  }

  private updateMap(): void {
    // Clear existing markers and layers
    this.markers.clearLayers();

    // Define bounds for all clinics
    const bounds: L.LatLngBounds = L.latLngBounds([]);

    this.clinics.forEach((clinic) => {
      const clinicLatLng = L.latLng(clinic.lat, clinic.lng);

      // Add marker for the clinic
      const marker = L.marker(clinicLatLng).bindPopup(`
        <strong>${clinic.name}</strong><br>
        ${clinic.address.street}, ${clinic.address.city}, ${clinic.address.state}<br>
        Postal Code: ${clinic.address.postalCode}<br>
        Contact: ${clinic.contact}<br>
        Type: ${clinic.type}<br>
        Language: ${clinic.language.toUpperCase()}
      `);

      // Add catchment area as a circle (5 km radius)
      const catchmentArea = L.circle(clinicLatLng, {
        radius: 5000, // 5 km radius
        color: 'blue',
        fillColor: '#a3caff',
        fillOpacity: 0.5
      });

      // Add marker and catchment area to the layer group
      this.markers.addLayer(marker);
      this.markers.addLayer(catchmentArea);

      // Extend map bounds to include this clinic
      bounds.extend(clinicLatLng);
    });

    // Adjust map view to fit all clinics and catchment areas
    if (this.clinics.length > 0) {
      this.map.fitBounds(bounds, { padding: [20, 20] }); // Add padding for better view
    } else {
      this.map.setView([51.505, -0.09], 12); // Reset to default view if no clinics are present
    }
  }
}
