import React, { useCallback, useState } from 'react';
import { Paper, Typography, IconButton } from '@mui/material';
import { useMapEvents } from 'react-leaflet';
import { Layer, Util } from 'leaflet';
import Accordion from '@mui/material/Accordion';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LayersIcon from '@mui/icons-material/Layers';
import lodashGroupBy from 'lodash.groupby';
import { LayersControlProvider } from './layerControlContext';

import createControlledLayer from './controlledLayer';
import { icons } from './icon';
import { get } from 'lodash';

const POSITION_CLASSES: { [key: string]: string } = {
   bottomleft: 'leaflet-bottom leaflet-left',
   bottomright: 'leaflet-bottom leaflet-right',
   topleft: 'leaflet-top leaflet-left',
   topright: 'leaflet-top leaflet-right',
};

interface IProps {
   children: React.ReactNode;
   position?: string;
}

interface ILayerObj {
   layer: Layer;
   group: string;
   name: string;
   checked: boolean;
   id: number;
}

const LayerControl = ({ position = 'topright', children }: IProps) => {
   const [collapsed, setCollapsed] = useState(true);
   const [layers, setLayers] = useState<ILayerObj[]>([]);
   const positionClass =
      (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright;

   const map = useMapEvents({
      layerremove: () => {
         //console.log('layer removed');
      },
      layeradd: () => {
         //console.log('layer add');
      },
      overlayadd: () => {
         //console.log(layers);
      },
   });

   const onLayerClick = (
      event: React.ChangeEvent<HTMLInputElement>,
      layerObj: ILayerObj
   ) => {
      event.stopPropagation();

      if (map?.hasLayer(layerObj.layer)) {
         map.removeLayer(layerObj.layer);
         setLayers(
            layers.map(layer => {
               if (layer.id === layerObj.id)
                  return {
                     ...layer,
                     checked: false,
                  };
               return layer;
            })
         );
      } else {
         map.addLayer(layerObj.layer);
         setLayers(
            layers.map(layer => {
               if (layer.id === layerObj.id)
                  return {
                     ...layer,
                     checked: true,
                  };
               return layer;
            })
         );
      }
   };

   const onGroupAdd = useCallback(
      (layer: Layer, name: string, group: string) => {
         const id = Util.stamp(layer);
         const isInLayer = layers.some(({ id: layerId }) => layerId === id);

         if (isInLayer) {
            return;
         }

         layers.push({
            layer,
            group,
            name,
            checked: map?.hasLayer(layer),
            id,
         });

         setLayers(layers);
      },
      [layers]
   );

   const groupedLayers = lodashGroupBy(layers, 'group');

   return (
      <LayersControlProvider
         value={{
            layers,
            addGroup: onGroupAdd,
         }}
      >
         <div className={positionClass}>
            <div className="leaflet-control leaflet-bar">
               {
                  <Paper
                     onMouseEnter={() => setCollapsed(false)}
                     onMouseLeave={() => setCollapsed(true)}
                  >
                     {collapsed && (
                        <IconButton>
                           <LayersIcon fontSize="medium" />
                        </IconButton>
                     )}
                     {!collapsed &&
                        Object.keys(groupedLayers).map((section, index) => (
                           <Accordion key={`${section} ${index}`}>
                              <AccordionSummary
                                 expandIcon={<ExpandMoreIcon />}
                                 aria-controls="panel1a-content"
                                 id="panel1a-header"
                              >
                                 <Typography>{section}</Typography>
                              </AccordionSummary>
                              {groupedLayers[section]?.map(
                                 (layerObj, index) => (
                                    <AccordionDetails
                                       key={`accDetails_${index}`}
                                    >
                                       <FormControlLabel
                                          control={
                                             <Checkbox
                                                checked={layerObj.checked}
                                                onChange={e =>
                                                   onLayerClick(e, layerObj)
                                                }
                                                name="checkedB"
                                                color="primary"
                                             />
                                          }
                                          label={(() => {
                                             const names =
                                                layerObj.name.split(':');

                                             if (names.length === 2) {
                                                const [iconName, name] = names;
                                                return (
                                                   <span className="flex flex-row items-center">
                                                      <span className="mr-2.5">
                                                         {get(icons, iconName)}
                                                      </span>
                                                      {name}
                                                   </span>
                                                );
                                             }

                                             return names[0];
                                          })()}
                                       />
                                    </AccordionDetails>
                                 )
                              )}
                           </Accordion>
                        ))}
                  </Paper>
               }
            </div>
            {children}
         </div>
      </LayersControlProvider>
   );
};

const GroupedLayer = createControlledLayer(
   (layersControl, layer, name, group) => {
      layersControl.addGroup(layer, name, group);
   }
);

export default LayerControl;
export { GroupedLayer };
