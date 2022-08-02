import React from 'react';
import './App.css';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";

const position: [number, number] = [51.505, -0.09]

const App: React.FC = () => {
  return (
    <div style={{height: '100vh'}}>
      <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{height: '100%'}}>
         <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
         />
         <Marker position={position}>
            <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
         </Marker>
      </MapContainer>
    </div>
  );
}

export default App;
