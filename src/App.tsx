import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Map from './components/Map';
import MapList from './components/MapList';
import PageNotFound from './PageNotFound';

const App: React.FC = () => {
   return (
      <>
         <Routes>
            <Route path="/" element={<MapList />}></Route>
            <Route path="/map/:mapName" element={<Map />}></Route>
            <Route path="/404" element={<PageNotFound />}></Route>
            <Route path="*" element={<Navigate replace to="/404" />}></Route>
         </Routes>
      </>
   );
};

export default App;
