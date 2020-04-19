import React, {createContext, useState, useEffect} from "react";


export const PlayerContext = createContext();


const PlayerContextProvider = (props) => {
    const [playerID, setPlayerID] = useState(() => {
        const localID = sessionStorage.getItem("playerID");
        return localID ? localID : ""
      });

      const [playerIndex, setPlayerIndex] = React.useState(-1);

      useEffect(( )=> {
          sessionStorage.setItem("playerID", playerID);
      }, [playerID]);

      return (
          <PlayerContext.Provider value={{playerID, setPlayerID, playerIndex, setPlayerIndex}}>
              {props.children}
          </PlayerContext.Provider>
      )
}

export default PlayerContextProvider;