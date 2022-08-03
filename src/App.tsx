import React from 'react';
import './App.css';
import { MapContainer, Marker, Popup, ImageOverlay } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import { LatLngBoundsLiteral, LatLngTuple, CRS } from 'leaflet';

const position: LatLngTuple = [1024, 1024];
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
   return (
      <div style={{ height: '100vh' }}>
         <MapContainer
            maxZoom={2}
            maxBounds={bounds}
            // scrollWheelZoom={false}
            crs={CRS.Simple}
            bounds={bounds}
            style={{ height: '100%' }}
         >
            <ImageOverlay url="/maps/test_map.png" bounds={bounds} />
            <Marker position={position} icon={MarkerIcon}>
               <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
               </Popup>
            </Marker>
         </MapContainer>
      </div>
   );
};

export default App;
