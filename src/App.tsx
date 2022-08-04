import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Map from './components/Map';

const App: React.FC = () => {
   return (
      <>
         <Routes>
            <Route path="/map/:mapName" element={<Map />}></Route>
            <Route path="*" element={<div>404</div>}></Route>
         </Routes>
      </>
   );
};

export default App;
