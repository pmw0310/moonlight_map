import React, { createContext, useState } from 'react';

const MapEventContext = createContext({
   disabledMapEvent: false,
   setDisabledMapEvent: (disabled: boolean) => {},
});

interface Props {
   children: React.ReactNode;
}

const MapEventProvider: React.FC<Props> = ({ children }) => {
   const [disabledMapEvent, setDisabledMapEvent] = useState(false);

   return (
      <MapEventContext.Provider
         value={{
            disabledMapEvent,
            setDisabledMapEvent,
         }}
      >
         {children}
      </MapEventContext.Provider>
   );
};

export { MapEventContext, MapEventProvider };
