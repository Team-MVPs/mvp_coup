import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { PlayerContextType } from '../types';

export const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

interface PlayerContextProviderProps {
  children: ReactNode;
}

const PlayerContextProvider: React.FC<PlayerContextProviderProps> = ({ children }) => {
  const [playerID, setPlayerID] = useState<string>(() => {
    const localID = sessionStorage.getItem('playerID');
    return localID ? localID : '';
  });

  const [playerIndex, setPlayerIndex] = useState<number>(-1);

  useEffect(() => {
    sessionStorage.setItem('playerID', playerID);
  }, [playerID]);

  return (
    <PlayerContext.Provider value={{ playerID, setPlayerID, playerIndex, setPlayerIndex }}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;