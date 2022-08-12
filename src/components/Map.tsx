/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from 'react';
import {
   MapContainer,
   Marker,
   Popup,
   ImageOverlay,
   LayerGroup,
   useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import { LatLngBoundsLiteral, LatLngTuple, CRS } from 'leaflet';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { get } from 'lodash';
import { Helmet } from 'react-helmet-async';
import mapsDatas from '../maps.json';
import LayerControl, { GroupedLayer } from './LayerControl';
import { Markers, markerIcons } from './icon';

export interface MapData {
   locale: string;
   backgroundColor: string;
   bounds: LatLngBoundsLiteral;
}

export interface MarkerData {
   [group: string]: ReadonlyArray<{
      name: string;
      icon: 'Scroll' | 'ScenicSpot' | 'Butterfly';
      layers: ReadonlyArray<{
         layer: 'marker';
         position: LatLngTuple;
         popup?: string;
      }>;
   }>;
}

const testWebP = (callback: (support: boolean) => void) => {
   const webP = new Image();
   webP.onload = webP.onerror = () => {
      callback(webP.height === 2);
   };
   webP.src =
      'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
};

const isMobile = () => {
   return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
   );
};

const getPositionString = ([x, y]: LatLngTuple) =>
   `${Math.round(y)},${Math.round(x)}`;

const InitMapView: React.FC<{
   coords: LatLngTuple | null;
   minZoom: number;
}> = ({ coords, minZoom }) => {
   const map = useMap();

   useEffect(() => {
      // const zoom = isMobile() ? minZoom : minZoom + 1;
      const zoom = minZoom + 1;

      if (coords) {
         map.setView(coords, zoom, { animate: false });
      } else {
         map.setZoom(zoom, { animate: false });
      }
   }, []);

   return null;
};

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

   const [mapUrl, setMapUrl] = useState<string | null>(null);

   const markerData = useMemo<MarkerData | null>(() => {
      try {
         return require(`../marker/${mapName}.json`)?.group;
      } catch {
         return null;
      }
   }, [mapName]);

   const mapData = useMemo<MapData | undefined>(() => {
      if (!mapName) {
         return;
      }
      return get(mapsDatas, mapName);
   }, [mapName]);

   const { minZoom, maxZoom } = useMemo(() => {
      if (!mapData) {
         return { minZoom: -1, maxZoom: 4 };
      }
      const [[min], [max]] = mapData.bounds;
      const minZoom = Math.max(-2, 2 - Math.floor((max - min) / 300));
      const maxZoom = minZoom + 5;
      return {
         minZoom,
         maxZoom,
      };
   }, [mapData]);

   useEffect(() => {
      testWebP(support => {
         setMapUrl(`/maps/${mapName}.${support ? 'webp' : 'png'}`);
      });
   }, [mapName]);

   const posStr = selectedPosition && getPositionString(selectedPosition);

   if (!mapUrl) {
      return <></>;
   }

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
               minZoom={minZoom}
               maxZoom={maxZoom}
               crs={CRS.Simple}
               bounds={mapData.bounds}
               attributionControl={false}
               doubleClickZoom={false}
               scrollWheelZoom={true}
               style={{ backgroundColor: mapData.backgroundColor }}
            >
               <ImageOverlay url={mapUrl} bounds={mapData.bounds} />
               <Markers
                  mapData={mapData}
                  setSearchParams={setSearchParams}
                  setSelectedPosition={setSelectedPosition}
                  selectedPosition={selectedPosition}
                  posStr={posStr}
               />
               <InitMapView coords={selectedPosition} minZoom={minZoom} />
               {markerData && (
                  <LayerControl position="topright">
                     {Object.keys(markerData).map(group => {
                        const groupData = markerData[group];
                        const isPc = !isMobile();

                        return groupData.map(({ name, layers, icon }) => {
                           const Icon = markerIcons[icon];

                           return (
                              <GroupedLayer
                                 key={`${group}_${name}`}
                                 checked
                                 name={icon ? `${icon}:${name}` : name}
                                 group={group}
                              >
                                 <LayerGroup>
                                    {layers.map(
                                       ({ position, popup }, index) => (
                                          <Marker
                                             key={`${name}_${index}`}
                                             icon={Icon}
                                             position={position}
                                             interactive={true}
                                             eventHandlers={
                                                isPc
                                                   ? {
                                                        mouseover: event =>
                                                           event.target.openPopup(),
                                                        mouseout: event =>
                                                           event.target.closePopup(),
                                                     }
                                                   : {}
                                             }
                                          >
                                             <Popup closeButton={false}>
                                                <div className="font-bold">
                                                   {name}
                                                </div>
                                                {popup && (
                                                   <div className="font-bold">
                                                      {popup}
                                                   </div>
                                                )}
                                                <div>
                                                   {getPositionString(position)}
                                                </div>
                                             </Popup>
                                          </Marker>
                                       )
                                    )}
                                 </LayerGroup>
                              </GroupedLayer>
                           );
                        });
                     })}
                  </LayerControl>
               )}
               {/* <LayerControl position="topright">
                  <GroupedLayer
                     checked
                     name="Layer Group with Circles"
                     group="테스트"
                  >
                     <LayerGroup>
                        <Marker
                           icon={MarkerIcon}
                           key={posStr}
                           position={[200, 200]}
                           interactive={true}
                        >
                        </Marker>
                     </LayerGroup>
                  </GroupedLayer>
                  <GroupedLayer
                     name="Layer Group with Circles2"
                     group="테스트2"
                  >
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
               </LayerControl> */}
            </MapContainer>
         </div>
      </>
   );
};

export default Map;
