import React, {createContext, useState, useEffect} from "react";
import { firestore, root } from '../config/firebase';


export const RoomContext = createContext();

const RoomContextProvider = (props) => {

      const [roomName, setRoomName] = useState(() => {
        const roomName = sessionStorage.getItem("roomName");
        return roomName ? roomName : ""
      });

      const [playerNames, setPlayerNames] = useState( async () => {
        if (roomName != "") {
          const snapshot = await firestore.collection(root).doc(roomName).collection("players").get();
          const names = snapshot.docs.map(doc => doc.data().name);
          console.log(`Player names are ${names}`)
          return setPlayerNames(names);
        } else {
          console.log("Waiting for room name...");
          return "";
        }
      });

      const [playerNamesMapping, setPlayerNamesMapping] = useState( async () => {
        if (roomName != "") {
          const snapshot = await firestore.collection(root).doc(roomName).collection("players").get();
          var names = {};
          snapshot.docs.map(doc => names[doc.id] = doc.data().name);
          console.log(`Player names are ${names}`)
          return setPlayerNamesMapping(names);
        } else {
          console.log("Waiting for room name...");
          return "";
        }
      });

      const [playerIndex, setPlayerIndex] = useState( async () => {
        if (roomName != "") {
          const snapshot = await firestore.collection(root).doc(roomName).collection("players").get()
          return  snapshot.docs.map(doc => doc.data().name);
        } else {
          console.log("Waiting for room name...");
          return "";
        }
      });
      
      useEffect(() => {
        sessionStorage.setItem("roomName", roomName);
        if (roomName != "") {
          firestore.collection(root).doc(roomName).collection("players").get().then((snapshot) => {
            let names = snapshot.docs.map(doc => doc.data().name);
            console.log(`Player names are ${names}`)
            setPlayerNames(names);
          })
        }
        if (roomName != "") {
          firestore.collection(root).doc(roomName).collection("players").get().then((snapshot) => {
            var names = {};
            snapshot.docs.map(doc => names[doc.id] = doc.data().name);
            console.log(`Player names are ${names}`)
            setPlayerNamesMapping(names);
          })
        }
        console.log("roomName changed to: ", roomName);
      }, [roomName]);

      return (
            <RoomContext.Provider value={{
                                      roomName, setRoomName,
                                      playerNames, setPlayerNames,
                                      playerNamesMapping, setPlayerNamesMapping
            
            }}>
                { props.children }
            </RoomContext.Provider>
        )
}

export default RoomContextProvider;