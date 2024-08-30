import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';

mapboxgl.accessToken = 'pk.eyJ1IjoiZGl2eWFzbSIsImEiOiJjbTAwenprMGwxa3hoMmtyMnh6ZncxZGRzIn0.b4rIdvAo-J3t3kEKV0dxWA';

const SimpleMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const userMarker = useRef(null);
  const [pitch, setPitch] = useState(45);
  const [bearing, setBearing] = useState(-17.6);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/divyasm/cm0e1cd45002o01pk6ekye42z',
      center: [80.013, 13.012],
      zoom: 14,
      pitch: pitch,
      bearing: bearing,
      antialias: true,
    });

    map.current.addControl(new mapboxgl.NavigationControl());

    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true,
    });

    map.current.addControl(geolocateControl);

    map.current.on('style.load', () => {
      map.current.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14,
      });
      map.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });

      map.current.addLayer({
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 15,
        paint: {
          'fill-extrusion-color': '#aaa',
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': ['get', 'min_height'],
          'fill-extrusion-opacity': 0.6,
        },
      });
    });

    map.current.on('load', () => {
      geolocateControl.trigger();
      
      // Initialize directions control
      const directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: 'metric',
        profile: 'mapbox/driving', // Or 'mapbox/cycling', 'mapbox/walking'
      });

      map.current.addControl(directions, 'top-left');

      // Example of adding a click event to show directions
      map.current.on('click', 'divyasm.cm0dgs7kbbq4d1nql4jo4fjlj-3i037', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        directions.setDestination(coordinates);
      });

      map.current.on('click', 'divyasm.cm0er2bfn0e5z1vs1uwwh2hvk-6ebdg', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        directions.setDestination(coordinates);
      });

      // Add event listener for directions updates
      directions.on('route', (e) => {
        const route = e.route[0];
        const steps = route.legs[0].steps.map(step => step.maneuver.instruction);
        readAloud(steps);
      });
    });

    geolocateControl.on('geolocate', (position) => {
      const { longitude, latitude } = position.coords;
      if (userMarker.current) {
        userMarker.current.setLngLat([longitude, latitude]);
      } else {
        userMarker.current = new mapboxgl.Marker({ color: 'red' })
          .setLngLat([longitude, latitude])
          .addTo(map.current);
      }
      map.current.setCenter([longitude, latitude]);
    });
  }, []);

  useEffect(() => {
    if (map.current) {
      map.current.setPitch(pitch);
      map.current.setBearing(bearing);
    }
  }, [pitch, bearing]);

  const readAloud = (instructions) => {
    const utterance = new SpeechSynthesisUtterance(instructions.join('. '));
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div>
      <div ref={mapContainer} style={{ width: '100%', height: '90vh' }} />
      <div style={{ padding: '10px' }}>
        <label>Pitch: {pitch}°</label>
        <input
          type="range"
          min="0"
          max="60"
          value={pitch}
          onChange={(e) => setPitch(Number(e.target.value))}
          style={{ width: '100%' }}
        />
        <label>Bearing: {bearing}°</label>
        <input
          type="range"
          min="-180"
          max="180"
          value={bearing}
          onChange={(e) => setBearing(Number(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
};

export default SimpleMap;
