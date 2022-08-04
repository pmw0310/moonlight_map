import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Map from './components/Map';

const App: React.FC = () => {
   return (
      <div className="App">
         <BrowserRouter>
            <Routes>
               <Route path="/map/:mapName" element={<Map />}></Route>
               <Route path="*" element={<div>404</div>}></Route>
            </Routes>
         </BrowserRouter>
      </div>
   );
};

export default App;
