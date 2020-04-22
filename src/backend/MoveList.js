import React, {useContext, useEffect, useState} from 'react';
import { Button } from 'react-bootstrap';
import {all_moves, responses, updateTurnInDB} from './move_logic.js';
import {firestore, root} from "../config/firebase";
import firebase from 'firebase';


export function MoveList(props){
	const [assassinEnabled, setAssassin] = useState(true);
	const [coupEnabled, setCoup] = useState(true);
	const [theRest, setTheRest] = useState(false);

	useEffect( () => {
		const subscribe = firestore.collection(root).doc(props.roomName).collection("players").doc(props.activePlayerID).get().then((player)=>{
			let coins = player.data().coins;
			if (coins >= 3 && coins < 10){
				setAssassin(false);
			} 
			if (coins >= 7){
				setCoup(false);
			}
			if (coins >= 10){
				setTheRest(true);
			}
			});
		return () => subscribe; 
		}, []);

	return (<div>
				<div style ={{paddingBottom: "1em", paddingTop: "1em"}}>
					<Button type="button" className="btn btn-lg btn-light" style = {{width:"20em"}} onClick={all_moves["Take General Income"](props.roomName, props.currentTurn, props.playerName, props.activePlayerID)}
					disabled={theRest}>Take General Income</Button>
				</div>

				<div style ={{paddingBottom: "1em", paddingTop: "1em"}}>
					<Button type="button" className="btn btn-lg btn-light" style = {{width:"20em"}} onClick={all_moves["Take Foreign Aid"](props.roomName, props.currentTurn, props.playerName, props.activePlayerID)}
					disabled = {theRest}>Take Foreign Aid</Button>
				</div>

				<div style ={{paddingBottom: "1em", paddingTop: "1em"}}>
					<Button type="button" className="btn btn-lg btn-light" style = {{width:"20em"}} onClick={all_moves["Take 3 as Duke"](props.roomName, props.currentTurn, props.playerName, props.activePlayerID)}
					disabled = {theRest}>Take 3 as Duke</Button>
				</div>

				<div style ={{paddingBottom: "1em", paddingTop: "1em"}}>
					<Button type="button" className="btn btn-lg btn-light" style = {{width:"20em"}} onClick={all_moves["Exchange your cards as Ambassador"](props.roomName, props.currentTurn, props.playerName, props.activePlayerID)}
					disabled = {theRest}>Exchange your cards as Ambassador</Button>
				</div>

				<div style ={{paddingBottom: "1em", paddingTop: "1em"}}>
					<Button type="button" className="btn btn-lg btn-light" style = {{width:"20em"}} onClick={all_moves["Steal 2 from a player as Captain"](props.roomName, props.currentTurn, props.playerName, props.activePlayerID)}
					disabled = {theRest}>Steal 2 from a player as Captain</Button>
				</div>

				<div style ={{paddingBottom: "1em", paddingTop: "1em"}}>
					<Button type="button" className="btn btn-lg btn-light" style = {{width:"20em"}} onClick={all_moves["Assassinate someone you dislike!"](props.roomName, props.currentTurn, props.playerName, props.activePlayerID)}
					disabled = {assassinEnabled}>Assassinate someone you dislike!</Button>
				</div>

				<div style ={{paddingBottom: "1em", paddingTop: "1em"}}>
					<Button type="button" className="btn btn-lg btn-light" style = {{width:"20em"}} onClick={all_moves["Coup a scrub"](props.roomName, props.currentTurn, props.playerName, props.activePlayerID)}
					disabled = {coupEnabled}>Coup a scrub</Button>
				</div>
	</div>);
}

export function ResponseList(props){
	return (<div>
		{Object.keys(responses).map(move => (
			<div style ={{paddingBottom: "1em", paddingTop: "1em"}}>
				<Button type="button" className="btn btn-lg btn-light" style = {{width:"20em"}} onClick={responses[move](props.roomName, props.currentTurn, props.playerName, props.notActivePlayerID)}>{move}</Button>
			</div>
		))}
	</div>);
}
