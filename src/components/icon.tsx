/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useContext } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Marker, useMapEvents, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import L, { Icon } from 'leaflet';
import { LatLngBoundsLiteral, LatLngTuple } from 'leaflet';
import { URLSearchParamsInit } from 'react-router-dom';
import { inRange } from 'lodash';
import { MapData } from './Map';
import markerIcon from '../marker/image/marker.png';
import { ReactComponent as TiedScrollIcon } from '../marker/image/tied-scroll.svg';
import { ReactComponent as CameraIcon } from '../marker/image/camera.svg';
import { ReactComponent as ButterflyIcon } from '../marker/image/butterfly.svg';
import { MapEventContext } from '../context/mapEvent';

interface MarkersProps {
   mapData: MapData;
   setSearchParams: (
      nextInit: URLSearchParamsInit,
      navigateOptions?:
         | {
              replace?: boolean | undefined;
              state?: any;
           }
         | undefined
   ) => void;
   setSelectedPosition: React.Dispatch<
      React.SetStateAction<L.LatLngTuple | null>
   >;
   selectedPosition: LatLngTuple | null;
   posStr: string | null;
}

export const icons = {
   Scroll: (
      <TiedScrollIcon
         width={24}
         height={24}
         fill="yellow"
         stroke="black"
         strokeWidth={8}
      />
   ),
   ScenicSpot: (
      <CameraIcon
         width={24}
         height={24}
         fill="yellow"
         stroke="black"
         strokeWidth={12}
      />
   ),
   Butterfly: (
      <ButterflyIcon
         width={24}
         height={24}
         fill="yellow"
         stroke="black"
         strokeWidth={1}
      />
   ),
};

export const markerIcons = {
   Scroll: L.divIcon({
      className: '',
      html: ReactDOMServer.renderToString(icons.Scroll),
      iconSize: [24, 24],
      iconAnchor: [12, 12],
   }),
   ScenicSpot: L.divIcon({
      className: '',
      html: ReactDOMServer.renderToString(icons.ScenicSpot),
      iconSize: [24, 24],
      iconAnchor: [12, 12],
   }),
   Butterfly: L.divIcon({
      className: '',
      html: ReactDOMServer.renderToString(icons.Butterfly),
      iconSize: [24, 24],
      iconAnchor: [12, 12],
   }),
};

export const MarkerIcon = new Icon({
   iconUrl: markerIcon,
   iconSize: [20, 20],
   iconAnchor: [10, 10],
});

const EffectIcon = L.divIcon({
   className: '',
   html: ReactDOMServer.renderToString(<div className="map-marker-effect" />),
   iconSize: [0, 0],
   iconAnchor: [0, 0],
   popupAnchor: [0, 0],
});

export const Markers: FC<MarkersProps> = ({
   mapData,
   setSearchParams,
   setSelectedPosition,
   selectedPosition,
   posStr,
}) => {
   const { disabledMapEvent } = useContext(MapEventContext);

   useMapEvents({
      click(e) {
         if (disabledMapEvent) {
            return;
         }

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
      <>
         <Marker
            icon={EffectIcon}
            key={`${posStr}-effect`}
            position={selectedPosition}
            opacity={1}
            interactive={true}
         />
         <Marker
            icon={MarkerIcon}
            key={posStr}
            position={selectedPosition}
            interactive={true}
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
      </>
   ) : null;
};
