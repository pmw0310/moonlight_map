import React, { useEffect, useState } from 'react';
import './App.css';
import {
   MapContainer,
   Marker,
   Popup,
   ImageOverlay,
   useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import { LatLngBoundsLiteral, LatLngTuple, CRS } from 'leaflet';

const bounds: LatLngBoundsLiteral = [
   [1, 1],
   [1024, 1024],
];

const MarkerIcon = new Icon({
   iconUrl: markerIcon,
   iconSize: [25, 41],
   iconAnchor: [12, 41],
});

const App: React.FC = () => {
   const [selectedPosition, setSelectedPosition] = useState<LatLngTuple>([
      0, 0,
   ]);

   const Markers = () => {
      useMapEvents({
         click(e) {
            console.log('click', e.latlng.lat, e.latlng.lng);
            setSelectedPosition([e.latlng.lat, e.latlng.lng]);
         },
      });

      return selectedPosition ? (
         <Marker
            icon={MarkerIcon}
            key={selectedPosition[0]}
            position={selectedPosition}
            interactive={false}
         />
      ) : null;
   };

   return (
      <div className="h-screen">
         <MapContainer
            className="h-full"
            maxZoom={2}
            maxBounds={bounds}
            crs={CRS.Simple}
            bounds={bounds}
         >
            <ImageOverlay url="/maps/gangnam.png" bounds={bounds} />
            <Markers />
         </MapContainer>
      </div>
   );
};

export default App;
