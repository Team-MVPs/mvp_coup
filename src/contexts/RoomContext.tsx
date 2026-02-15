import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { firestore, root } from '../config/firebase';
import { RoomContextType } from '../types';

export const RoomContext = createContext<RoomContextType | undefined>(undefined);

interface RoomContextProviderProps {
  children: ReactNode;
}

const RoomContextProvider: React.FC<RoomContextProviderProps> = ({ children }) => {
  const [roomName, setRoomName] = useState<string>(() => {
    const storedRoomName = sessionStorage.getItem('roomName');
    return storedRoomName ? storedRoomName : '';
  });

  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [playerNamesMapping, setPlayerNamesMapping] = useState<Record<string, string>>({});

  useEffect(() => {
    sessionStorage.setItem('roomName', roomName);

    if (roomName !== '') {
      firestore
        .collection(root)
        .doc(roomName)
        .collection('players')
        .get()
        .then((snapshot) => {
          const names = snapshot.docs.map((doc) => doc.data().name as string);
          setPlayerNames(names);

          const namesMapping: Record<string, string> = {};
          snapshot.docs.forEach((doc) => {
            namesMapping[doc.id] = doc.data().name as string;
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
      {children}
    </RoomContext.Provider>
  );
};

export default RoomContextProvider;