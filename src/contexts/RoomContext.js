import React, { createContext, useState, useEffect } from 'react';
import { firestore, root } from '../config/firebase';

export const RoomContext = createContext();

const RoomContextProvider = (props) => {
  const [roomName, setRoomName] = useState(() => {
    const storedRoomName = sessionStorage.getItem('roomName');
    return storedRoomName ? storedRoomName : '';
  });

  const [playerNames, setPlayerNames] = useState([]);
  const [playerNamesMapping, setPlayerNamesMapping] = useState({});

  useEffect(() => {
    sessionStorage.setItem('roomName', roomName);

    if (roomName !== '') {
      firestore
        .collection(root)
        .doc(roomName)
        .collection('players')
        .get()
        .then((snapshot) => {
          const names = snapshot.docs.map((doc) => doc.data().name);
          setPlayerNames(names);

          const namesMapping = {};
          snapshot.docs.forEach((doc) => {
            namesMapping[doc.id] = doc.data().name;
          });
          setPlayerNamesMapping(namesMapping);
        })
        .catch((error) => {
          console.error('Error fetching player names:', error);
        });
    }
  }, [roomName]);

  return (
    <RoomContext.Provider
      value={{
        roomName,
        setRoomName,
        playerNames,
        setPlayerNames,
        playerNamesMapping,
        setPlayerNamesMapping,
      }}
    >
      {props.children}
    </RoomContext.Provider>
  );
};

export default RoomContextProvider;