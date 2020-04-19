import React, {createContext, useState, useEffect} from "react";


export const RoomContext = createContext();

const RoomContextProvider = (props) => {

      const [roomName, setRoomName] = useState(() => {
        const roomName = sessionStorage.getItem("roomName");
        return roomName ? roomName : ""
      });

      useEffect(() => {
        sessionStorage.setItem("roomName", roomName);
        console.log("roomName changed to: ", roomName);
      }, [roomName]);


      return (
            <RoomContext.Provider value={{roomName, setRoomName}}>
                { props.children }
            </RoomContext.Provider>
        )
}

export default RoomContextProvider;