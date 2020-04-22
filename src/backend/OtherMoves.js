import {firestore, root} from "../config/firebase";
import React, {useEffect, useState} from 'react';
import { Ambassador } from './PerformMoves';


export default function OtherMoves(props){
	let move = props.move;
	let roomName = props.roomName;
	let playerID = props.playerID;

	if (move === 'Ambassador'){
		return (
			<div>
				{Ambassador(roomName, playerID)}
			</div>)
	}		
}
