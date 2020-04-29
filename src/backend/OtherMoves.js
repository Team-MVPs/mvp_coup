import {firestore, root} from "../config/firebase";
import React, {useEffect, useState} from 'react';
import { Ambassador, AttemptAssassin, Coup, Captain } from './PerformMoves';


export default function OtherMoves(props){
	let move = props.move;
	let roomName = props.roomName;
	let playerID = props.playerID;

	if (move === 'Ambassador'){
		return (
			<div>
				{Ambassador(roomName, playerID)}
			</div>)
	} else if(move === "AttemptAssassin"){
		return (
			<div>
				{AttemptAssassin(roomName, playerID, props.playerList, props.playerIndex, props.turn)}
			</div>
		)
	} else if (move === "Coup"){
		return (
			<div>
				{Coup(roomName, playerID, props.playerList, props.playerIndex, props.turn)}
			</div>)
	} else if (move === "Captain"){
		return (
			<div>
				{Captain(roomName, playerID, props.playerList, props.playerIndex, props.turn)}
			</div>)
	}


}
