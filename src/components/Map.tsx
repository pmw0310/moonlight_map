import React, { useEffect, useState, useMemo } from 'react';
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
import { useParams, useSearchParams } from 'react-router-dom';
import { inRange } from 'lodash';

const bounds: LatLngBoundsLiteral = [
   [1, 1],
   [1024, 1024],
];

const maxBounds: LatLngBoundsLiteral = [
   [-511, -511],
   [1536, 1536],
];

const MarkerIcon = new Icon({
   iconUrl: markerIcon,
   iconSize: [25, 41],
   iconAnchor: [12, 41],
});

const App: React.FC = () => {
   const { mapName } = useParams();
   const [searchParams, setSearchParams] = useSearchParams();
   const [selectedPosition, setSelectedPosition] = useState<LatLngTuple | null>(
      (() => {
         const l = searchParams.get('l');

         if (!l) {
            return null;
         }

         return decodeURIComponent(l)
            .split(' ')
            .map(l => Number(l)) as LatLngTuple;
      })()
   );

   const mapUrl = useMemo(() => `/maps/${mapName}.png`, [mapName]);

   const Markers: React.FC = () => {
      useMapEvents({
         click(e) {
            const {
               latlng: { lat, lng },
            } = e;
            const pos: LatLngTuple = [lat, lng];

            const isInRange = pos.every((p, i) => {
               const [min, max] = bounds.map(b => b[i]);
               return inRange(p, min, max);
            });

            if (!isInRange) {
               return;
            }

            setSearchParams({
               l: encodeURIComponent(pos.join(' ')),
            });
            setSelectedPosition(pos);
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
            maxBounds={maxBounds}
            crs={CRS.Simple}
            bounds={bounds}
            attributionControl={false}
         >
            <ImageOverlay url={mapUrl} bounds={bounds} />
            <Markers />
         </MapContainer>
      </div>
   );
};

export default App;
