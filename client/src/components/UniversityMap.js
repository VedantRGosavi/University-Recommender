import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Typography } from '@material-tailwind/react';
import axios from 'axios';

// Mapbox access token - you would normally store this in environment variables
mapboxgl.accessToken = 'pk.eyJ1IjoidmVkYW50Z29zYXZpIiwiYSI6ImNtOXdzZXA2MTAwb2gyam9yOTRjcndjb2QifQ.VBJDiSgXunACcOvDMUBibQ';

// Default coordinates for University of Toledo as fallback
const DEFAULT_COORDINATES = {
  lng: -83.606667,
  lat: 41.658889,
  name: 'University of Toledo'
};

export const UniversityMap = ({ university }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to get coordinates from university name and location
  const getCoordinates = async (universityName, location) => {
    try {
      const searchQuery = `${universityName}, ${location}`;
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchQuery
        )}.json?access_token=${mapboxgl.accessToken}&limit=1`
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        return { lng, lat, name: universityName };
      } else {
        console.warn('No coordinates found for:', searchQuery);
        return DEFAULT_COORDINATES;
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return DEFAULT_COORDINATES;
    }
  };

  useEffect(() => {
    const initializeMap = async () => {
      setLoading(true);
      
      try {
        // Get university ID
        const universityId = university?._id;
        let coordinates;
        
        // First check if coordinates are directly provided
        if (university?.coordinates?.latitude && university?.coordinates?.longitude) {
          coordinates = {
            lng: university.coordinates.longitude,
            lat: university.coordinates.latitude,
            name: university.name
          };
        } else if (universityId) {
          // Fetch map data from API
          try {
            const response = await axios.get(`http://localhost:5001/api/university/${universityId}/map`);
            const mapData = response.data;
            
            coordinates = await getCoordinates(mapData.name, mapData.location);
          } catch (error) {
            console.error('Error fetching map data:', error);
            
            // Fall back to using the university prop directly
            if (university && university.name && university.location) {
              coordinates = await getCoordinates(university.name, university.location);
            } else {
              coordinates = DEFAULT_COORDINATES;
            }
          }
        } else if (university && university.name && university.location) {
          coordinates = await getCoordinates(university.name, university.location);
        } else {
          coordinates = DEFAULT_COORDINATES;
        }
        
        setCoords(coordinates);
        
        // Initialize map only if it hasn't been initialized yet
        if (map.current) return;
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [coordinates.lng, coordinates.lat],
          zoom: 15,
          pitch: 45, // 3D pitch angle
          bearing: -17.6,
          antialias: true // Enable antialiasing for smoother lines
        });

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        // Wait for map to load before adjusting layers
        map.current.on('load', () => {
          // Add 3D building layer
          map.current.addLayer({
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
              'fill-extrusion-color': '#aaa',
              'fill-extrusion-height': [
                'interpolate', ['linear'], ['zoom'],
                15, 0,
                15.05, ['get', 'height']
              ],
              'fill-extrusion-base': [
                'interpolate', ['linear'], ['zoom'],
                15, 0,
                15.05, ['get', 'min_height']
              ],
              'fill-extrusion-opacity': 0.6
            }
          }, 'waterway-label');
          
          // Add a marker at the university location
          new mapboxgl.Marker({ color: '#3B82F6' })
            .setLngLat([coordinates.lng, coordinates.lat])
            .setPopup(new mapboxgl.Popup({ offset: 25 })
              .setHTML(`<h3>${coordinates.name}</h3>`))
            .addTo(map.current);
          
          setLoading(false);
        });
        
        // Handle errors
        map.current.on('error', (e) => {
          console.error('Map error:', e);
          setError('Error loading the map. Please try again later.');
          setLoading(false);
        });
        
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Error initializing the map. Please try again later.');
        setLoading(false);
      }
    };

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [university]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <Typography variant="h2" className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
        Campus Map
      </Typography>

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      <div 
        ref={mapContainer}
        className="w-full h-[400px] rounded-lg overflow-hidden relative"
      >
        {loading && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-gray-600">
        <Typography variant="paragraph">
          This 3D campus map displays the location of {coords?.name || university?.name || 'the university'}. 
          You can navigate around the campus using mouse controls:
        </Typography>
        <ul className="list-disc pl-5 mt-2 text-sm">
          <li>Drag to pan</li>
          <li>Scroll to zoom</li>
          <li>Hold right mouse button and drag to rotate</li>
          <li>Hold Ctrl + drag to tilt</li>
        </ul>
      </div>
    </div>
  );
}; 