// @flow 

import React from 'react';
import ShowMoveList from '../backend/MoveList.js';
import { firestore, root } from '../config/firebase';
import {handleDBException} from "../backend/callbacks";
import {registerMoveCallback} from "../backend/move_logic";

function PlayerScreen(props) {
    const[isTurn, setIsTurn] = React.useState(props.playerIndex === 0);
    const[currentTurn, setCurrentTurn] = React.useState(0);
    let totalPlayers = props.playerNames.length;

    React.useEffect(() => {
        const subscribe = firestore.collection(root).doc(props.roomName).onSnapshot((doc) => {
          if (doc.data().turn % totalPlayers === props.playerIndex) {
            console.log("Your Turn");
            setIsTurn(true);
          }else{
              setIsTurn(false);
          }
          setCurrentTurn(doc.data().turn % totalPlayers);
        });
        return () => subscribe();
      }, []);
    
    if (props.roomName === "") {
    	return handleDBException();
	}

	registerMoveCallback(props.roomName, currentTurn, props.playerID);
	
	if (isTurn) {
		return(
			<div>
				<h3>Make A Move!</h3>
				<ShowMoveList currentTurn={currentTurn} roomName={props.roomName} playerID={props.playerID} playerName={props.playerNames[currentTurn]}/>
			</div>
		);
	} else {
		return(
			<div>
				<h3>{props.playerNames[currentTurn]}'s Turn</h3>
			</div>
		);
	}

}

export default PlayerScreen;
