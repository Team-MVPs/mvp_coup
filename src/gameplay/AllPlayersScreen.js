// @flow 

import React, {useContext, useEffect, useState} from 'react';
import {MoveList} from '../backend/MoveList.js';
import {firestore, root} from '../config/firebase';
import {RegisterMoveCallback} from "../backend/move_logic";
import {RoomContext} from '../contexts/RoomContext.js';
import {ResponseList} from "../backend/MoveList";
import { Spinner } from 'react-bootstrap';

function PlayerScreen(props) {
	const [isTurn, setIsTurn] = useState(props.playerIndex === 0);
	const [currentTurn, setCurrentTurn] = useState(0);
	const [move, setMove] = useState("");
	const [confirmed, setConfirmed] = useState(false);
	const [bluffPlayer, setBluffPlayer] = useState("");
	let totalPlayers = props.playerNames.length;
	
	const {roomName} = useContext(RoomContext);
	
	useEffect(() => {
		const subscribe = firestore.collection(root).doc(roomName).onSnapshot((doc) => {
			if (doc.data().turn !== currentTurn) {
				// reset move variable
				setMove("");
			}
			setConfirmed(false);
			if (doc.data().turn % totalPlayers === props.playerIndex) {
				setIsTurn(true);
			} else {
				setIsTurn(false);
			}
			setCurrentTurn(doc.data().turn);
			RegisterMoveCallback(roomName, doc.data().turn, props.playerID, setMove);
		});
		return () => subscribe();
	}, []);

	console.log(move);
	if (isTurn) {
		return (
			<div>
				<h3>Make A Move!</h3>
				<MoveList currentTurn={currentTurn} roomName={roomName} playerID={props.playerID}
						  playerName={props.playerNames[currentTurn % totalPlayers]}/>
			</div>
		);
	} else if (move !== "") {
		return (
			<div>
				<h3>{move}</h3>
				<ResponseList currentTurn={currentTurn} roomName={roomName} playerID={props.playerID}
							  playerName={props.playerNames[currentTurn % totalPlayers]} setConfirmed = {setConfirmed} setMove = {setMove}/>
			</div>
		);
	} else if(confirmed){
		return (
			<div>
			  <div align="middle" style = {{paddingTop:"1em"}}>
				<Spinner animation="border" as="span"/>
			  </div>
			  <div className="col-xs-6" align="middle">
				Waiting for others to confirm the turn
			  </div>
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
