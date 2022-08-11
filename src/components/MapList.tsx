import React from 'react';
import { Helmet } from 'react-helmet-async';
import { keys, get } from 'lodash';
import { Link } from 'react-router-dom';
import mapsData from '../maps.json';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';

const MapList: React.FC = () => {
   const mapKeys = keys(mapsData);

   return (
      <>
         <Helmet>
            <title>천애명월도m 지도 목록</title>
         </Helmet>
         <Container fixed>
            <div className="font-bold my-3">* 좌표 검증 못함</div>
            <div>
               {mapKeys.map(key => (
                  <React.Fragment key={key}>
                     <Link to={`/map/${key}`}>
                        <Card
                           sx={{ maxWidth: 345 }}
                           className="float-left m-2 inline-block hover:bg-blue-300 border-4 border-white hover:border-blue-600"
                        >
                           <CardMedia
                              component="img"
                              height="194"
                              image="/listView/view.jpg"
                              alt="Paella dish"
                           />
                           <CardContent className="!p-2">
                              {get(mapsData, key).locale}
                           </CardContent>
                        </Card>
                     </Link>
                  </React.Fragment>
               ))}
            </div>
         </Container>
      </>
   );
};

export default MapList;
