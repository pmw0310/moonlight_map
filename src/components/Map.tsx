import React, { useEffect, useState, useMemo } from 'react';
import {
   MapContainer,
   Marker,
   Popup,
   ImageOverlay,
   useMapEvents,
   Tooltip,
   LayerGroup,
   Circle
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import { Icon } from 'leaflet';
import markerIcon from './marker.png';
import { LatLngBoundsLiteral, LatLngTuple, CRS } from 'leaflet';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { inRange, get } from 'lodash';
import { Helmet } from 'react-helmet-async';
import mapsData from '../maps.json';
import LayerControl, { GroupedLayer } from './LayerControl';

const MarkerIcon = new Icon({
   iconUrl: markerIcon,
   iconSize: [20, 20],
   iconAnchor: [10, 10],
});

const Map: React.FC = () => {
   const { mapName } = useParams();
   const [searchParams, setSearchParams] = useSearchParams();
   const [selectedPosition, setSelectedPosition] = useState<LatLngTuple | null>(
      (() => {
         const p = searchParams.get('p');

         if (!p) {
            return null;
         }

         return decodeURIComponent(p)
            .split(' ')
            .map(p => Number(p)) as LatLngTuple;
      })()
   );

   const mapData = useMemo(() => {
      if (!mapName) {
         return;
      }
      return get(mapsData, mapName);
   }, [mapName]);

   const mapUrl = useMemo(() => `/maps/${mapName}.png`, [mapName]);

   const posStr =
      selectedPosition &&
      `${Math.round(selectedPosition[1])},${Math.round(selectedPosition[0])}`;

   const Markers: React.FC = () => {
      useMapEvents({
         click(e) {
            const {
               latlng: { lat, lng },
            } = e;
            const pos: LatLngTuple = [lat, lng];
            const bounds: LatLngBoundsLiteral = mapData.bounds;

            const isInRange = pos.every((p, i) => {
               const [min, max] = bounds.map(b => b[i]);
               return inRange(p, min, max);
            });

            if (!isInRange) {
               return;
            }

            setSearchParams(
               {
                  p: encodeURIComponent(pos.join(' ')),
               },
               { replace: true }
            );
            setSelectedPosition(pos);
         },
      });

      return selectedPosition ? (
         <Marker
            icon={MarkerIcon}
            key={posStr}
            position={selectedPosition}
            interactive={false}
         >
            <Tooltip
               className="remove-bubble pos-tooltip"
               direction="top"
               offset={[0, -4]}
               opacity={1}
               permanent
            >
               {posStr}
            </Tooltip>
         </Marker>
      ) : null;
   };

   if (!mapData) {
      return <Navigate replace to="/404" />;
   }


   return (
      <>
         <Helmet>
            <title>{`${mapData.locale}${posStr ? ` (${posStr})` : ''}`}</title>
         </Helmet>
         <div className="w-screen h-screen">
            <MapContainer
               className="w-full h-full"
               minZoom={-1}
               maxZoom={4}
               crs={CRS.Simple}
               bounds={mapData.bounds}
               attributionControl={false}
               doubleClickZoom={false}
               style={{ backgroundColor: mapData.backgroundColor }}
            >
               <ImageOverlay url={mapUrl} bounds={mapData.bounds} />
               <Markers />
               <LayerControl position="topright">
                  <GroupedLayer checked name="Layer Group with Circles" group="테스트">
                     <LayerGroup>
                        <Circle
                           center={[10, 10]}
                           pathOptions={{ fillColor: 'blue' }}
                           radius={200}
                        />
                        <Circle
                           center={[20, 20]}
                           pathOptions={{ fillColor: 'red' }}
                           radius={100}
                           stroke={false}
                        />
                     </LayerGroup>
                  </GroupedLayer>
                  <GroupedLayer name="Layer Group with Circles2" group="테스트2">
                     <LayerGroup>
                        <Circle
                           center={[300, 300]}
                           pathOptions={{ fillColor: 'blue' }}
                           radius={200}
                        />
                        <Circle
                           center={[400, 400]}
                           pathOptions={{ fillColor: 'red' }}
                           radius={100}
                           stroke={false}
                        />
                     </LayerGroup>
                  </GroupedLayer>
               </LayerControl>
            </MapContainer>
         </div>
      </>
   );
};

export default Map;
