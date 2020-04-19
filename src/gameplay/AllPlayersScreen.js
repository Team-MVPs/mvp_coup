// @flow 

import React, { useContext } from 'react';
import ShowMoveList from '../backend/MoveList.js';
import { firestore, root } from '../config/firebase';
import {handleDBException} from "../backend/callbacks";
import {registerMoveCallback} from "../backend/move_logic";
import { RoomContext } from '../contexts/RoomContext.js';

function PlayerScreen(props) {
    const[isTurn, setIsTurn] = React.useState(props.playerIndex === 0);
    const[currentTurn, setCurrentTurn] = React.useState(0);
	let totalPlayers = props.playerNames.length;
	
	const { roomName } = useContext(RoomContext);

    React.useEffect(() => {
        const subscribe = firestore.collection(root).doc(roomName).onSnapshot((doc) => {
          if (doc.data().turn % totalPlayers === props.playerIndex) {
            console.log("Your Turn");
            setIsTurn(true);
          }else{
              setIsTurn(false);
          }
          setCurrentTurn(doc.data().turn);
        });
        return () => subscribe();
      }, []);
    
    if (roomName === "") {
    	return handleDBException();
	}

	registerMoveCallback(roomName, currentTurn, props.playerID);
	
	if (isTurn) {
		return(
			<div>
				<h3>Make A Move!</h3>
				<ShowMoveList currentTurn = {currentTurn} roomName = {roomName} playerID={props.playerID} playerName = {props.playerNames[currentTurn % totalPlayers]}/>
			</div>
		);
	} else {
		return(
			<div>
				<h3>{props.playerNames[currentTurn % totalPlayers]}'s Turn</h3>
			</div>
		);
	}

}

export default PlayerScreen;
