// @flow 

import React, {useContext, useEffect, useState} from 'react';
import {MoveList} from '../backend/MoveList.js';
import {firestore, root} from '../config/firebase';
import {RegisterMoveCallback} from "../backend/move_logic";
import {RoomContext} from '../contexts/RoomContext.js';
import {ResponseList} from "../backend/MoveList";
import OtherMoves from '../backend/OtherMoves.js';
import { Spinner } from 'react-bootstrap';

function PlayerScreen(props) {
	const [isTurn, setIsTurn] = useState(props.playerIndex === 0);
	const [currentTurn, setCurrentTurn] = useState(0);
	const [move, setMove] = useState("");
	const [currentMove, setCurrentMove] = useState("");
	const [confirmed, setConfirmed] = useState(false);
	const [waitingMessage, setWaitingMessage] = useState("Waiting for others");

	const {roomName, playerNames} = useContext(RoomContext);
	console.log(`Current Player Names ${playerNames}`);
	let totalPlayers = playerNames.length;	
	
	useEffect(() => {
		const subscribe = firestore.collection(root).doc(roomName).onSnapshot((doc) => {
			if (doc.data().turn !== currentTurn) {
				// reset move variable
				setMove("");
				setCurrentMove("");
			}
			setConfirmed(false);
			if (doc.data().turn % totalPlayers === props.playerIndex) {
				setIsTurn(true);
			} else {
				setIsTurn(false);
			}
			setCurrentTurn(doc.data().turn);
			RegisterMoveCallback(roomName, doc.data().turn, props.playerID, setMove, setCurrentMove, setConfirmed, setWaitingMessage);
		});
		return () => subscribe();
	}, []);

	
	if (isTurn) {
		if(confirmed){
			return (
				<div>
				  <div align="middle" style = {{paddingTop:"1em"}}>
					<Spinner animation="border" as="span"/>
				  </div>
				  <div className="col-xs-6" align="middle">
					Waiting for others to confirm
				  </div>
				</div>
			  );
		}
		if (currentMove !== ""){
			return(
				<div>
					<OtherMoves move = {currentMove} roomName = {roomName} playerID = {props.playerID}/>
				</div>)
		}else return (
			<div>
				<h3>Make A Move!</h3>
				<MoveList currentTurn={currentTurn} roomName={roomName} activePlayerID={props.playerID}
						  playerName={playerNames[currentTurn % totalPlayers]} setConfirmed={setConfirmed}/>
			</div>
		);
	}else if(confirmed){
		return (
			<div>
			  <div align="middle" style = {{paddingTop:"1em"}}>
				<Spinner animation="border" as="span"/>
			  </div>
			  <div className="col-xs-6" align="middle">
				{waitingMessage}
			  </div>
			</div>
		  );
	} else if (move !== "") {
		return (
			<div>
				<h3>{move}</h3>
				<ResponseList currentTurn={currentTurn} roomName={roomName} notActivePlayerID={props.playerID}
							  playerName={playerNames[props.playerIndex]} setConfirmed = {setConfirmed} setMove = {setMove}/>
			</div>
		);
	} else {
		return (
			<div>
				<h3>{playerNames[currentTurn % totalPlayers]}'s Turn</h3>
			</div>
		);
	}
 
}

export default PlayerScreen;
