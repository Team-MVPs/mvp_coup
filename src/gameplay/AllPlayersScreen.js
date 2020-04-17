// @flow 

import React from 'react';
import {all_chars} from '../backend/game_logic.js';
import ShowMoveList from '../backend/MoveList.js';
import { firestore, root } from '../config/firebase';

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

	if (isTurn){
		return(
			<div>
				<h3>Make A Move!</h3>
				<ShowMoveList currentTurn = {currentTurn} roomName = {props.roomName}/>
			</div>
			)
	} else{
		return(
		<div>
			<h3>{props.playerNames[currentTurn]}'s Turn</h3> 
		</div>)
	}

}

export default PlayerScreen;
