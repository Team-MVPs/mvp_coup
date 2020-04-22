// @flow 

import React, {useContext, useEffect, useState} from 'react';
import {MoveList} from '../backend/MoveList.js';
import {firestore, root} from '../config/firebase';
import {RegisterMoveCallback} from "../backend/move_logic";
import {RoomContext} from '../contexts/RoomContext.js';
import {ResponseList} from "../backend/MoveList";
import OtherMoves from '../backend/OtherMoves.js';

function PlayerScreen(props) {
	const [isTurn, setIsTurn] = useState(props.playerIndex === 0);
	const [currentTurn, setCurrentTurn] = useState(0);
	const [move, setMove] = useState("");
	const [currentMove, setCurrentMove] = useState("");
	let totalPlayers = props.playerNames.length;
	
	const {roomName} = useContext(RoomContext);
	
	useEffect(() => {
		const subscribe = firestore.collection(root).doc(roomName).onSnapshot((doc) => {
			if (doc.data().turn !== currentTurn) {
				// reset move variable
				setMove("");
				setCurrentMove("");
			}
			if (doc.data().turn % totalPlayers === props.playerIndex) {
				setIsTurn(true);
			} else {
				setIsTurn(false);
			}
			setCurrentTurn(doc.data().turn);
			RegisterMoveCallback(roomName, doc.data().turn, props.playerID, setMove, setCurrentMove);
		});
		return () => subscribe();
	}, []);

	
	if (isTurn) {
		if (currentMove !== ""){
			return(
				<div>
					<OtherMoves move = {currentMove} roomName = {roomName} playerID = {props.playerID}/>
				</div>)
		}else return (
			<div>
				<h3>Make A Move!</h3>
				<MoveList currentTurn={currentTurn} roomName={roomName} activePlayerID={props.playerID}
						  playerName={props.playerNames[currentTurn % totalPlayers]}/>
			</div>
		);
	} else if (move !== "") {
		return (
			<div>
				<h3>{move}</h3>
				<ResponseList currentTurn={currentTurn} roomName={roomName} notActivePlayerID={props.playerID}
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
