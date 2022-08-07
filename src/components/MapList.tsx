import React from 'react';
import { Helmet } from 'react-helmet-async';
import { keys, get } from 'lodash';
import { Link } from 'react-router-dom';
import mapsData from '../maps.json';
import Container from '@mui/material/Container';

const MapList: React.FC = () => {
   const mapKeys = keys(mapsData);

   return (
      <>
         <Helmet>
            <title>천애명월도m 지도 목록</title>
         </Helmet>
         <Container fixed>
            <div className="font-bold my-3">
               * 좌표 검증 못함
            </div>
            {mapKeys.map(key => (
               <div key={key}>
                  <Link to={`/map/${key}`}>
                     <div className="font-bold underline text-blue-500 hover:text-blue-900 my-3">
                        {get(mapsData, key).locale}
                     </div>
                  </Link>
               </div>
            ))}
         </Container>
      </>
   );
};

export default MapList;
