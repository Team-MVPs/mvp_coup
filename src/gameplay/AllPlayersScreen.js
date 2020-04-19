// @flow 

import React, {useContext, useEffect, useState} from 'react';
import MoveList from '../backend/MoveList.js';
import {firestore, root} from '../config/firebase';
import {registerMoveCallback} from "../backend/move_logic";
import {RoomContext} from '../contexts/RoomContext.js';

function PlayerScreen(props) {
	const [isTurn, setIsTurn] = useState(props.playerIndex === 0);
	const [currentTurn, setCurrentTurn] = useState(0);
	let totalPlayers = props.playerNames.length;
	
	const {roomName} = useContext(RoomContext);
	
	useEffect(() => {
		const subscribe = firestore.collection(root).doc(roomName).onSnapshot((doc) => {
			if (doc.data().turn % totalPlayers === props.playerIndex) {
				setIsTurn(true);
			} else {
				setIsTurn(false);
			}
			setCurrentTurn(doc.data().turn);
		});
		return () => subscribe();
	}, []);

	registerMoveCallback(roomName, currentTurn, props.playerID);
	
	if (isTurn) {
		return (
			<div>
				<h3>Make A Move!</h3>
				<MoveList currentTurn={currentTurn} roomName={roomName} playerID={props.playerID}
						  playerName={props.playerNames[currentTurn % totalPlayers]}/>
			</div>
		);
	} else {
		return (
			<div>
				<h3>{props.playerNames[currentTurn % totalPlayers]}'s Turn</h3>
			</div>
		);
	}
	
}

export default PlayerScreen;
