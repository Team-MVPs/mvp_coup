import React, {useContext, useEffect, useState} from 'react';
import { Button } from 'react-bootstrap';
import {all_moves, responses, updateTurnInDB} from './move_logic.js';
import {firestore, root} from "../config/firebase";
import firebase from 'firebase';


export function MoveList(props){
	const [assassinEnabled, setAssassin] = useState(true);
	const [coupEnabled, setCoup] = useState(true);
	const [theRest, setTheRest] = useState(false);
	const [coins, setCoins] = useState(0);

	useEffect( () => {
		firestore.collection(root).doc(props.roomName).collection("players").doc(props.activePlayerID).get().then((player)=>{
			console.log("HEEEEEEEEEEEEEEEEE");
			setCoins(player.data().coins);
			console.log("REEEEEEEEEEEEEEEEE")
		});
	}

	);
	return (<div>
				<div style ={{paddingBottom: "1em", paddingTop: "1em"}}>
					<Button type="button" className="btn btn-lg btn-light" style = {{width:"20em"}} onClick={all_moves["Take General Income"](props.roomName, props.currentTurn, props.playerName, props.activePlayerID)}
					disabled={false}>Take General Income</Button>
				</div>

				<div style ={{paddingBottom: "1em", paddingTop: "1em"}}>
					<Button type="button" className="btn btn-lg btn-light" style = {{width:"20em"}} onClick={all_moves["Take Foreign Aid"](props.roomName, props.currentTurn, props.playerName, props.activePlayerID)}
					disabled = {false}>Take Foreign Aid</Button>
				</div>

				<div style ={{paddingBottom: "1em", paddingTop: "1em"}}>
					<Button type="button" className="btn btn-lg btn-light" style = {{width:"20em"}} onClick={all_moves["Take 3 as Duke"](props.roomName, props.currentTurn, props.playerName, props.activePlayerID)}
					disabled = {false}>Take 3 as Duke</Button>
				</div>

				<div style ={{paddingBottom: "1em", paddingTop: "1em"}}>
					<Button type="button" className="btn btn-lg btn-light" style = {{width:"20em"}} onClick={all_moves["Exchange your cards as Ambassador"](props.roomName, props.currentTurn, props.playerName, props.activePlayerID)}
					disabled = {false}>Exchange your cards as Ambassador</Button>
				</div>

				<div style ={{paddingBottom: "1em", paddingTop: "1em"}}>
					<Button type="button" className="btn btn-lg btn-light" style = {{width:"20em"}} onClick={all_moves["Steal 2 from a player as Captain"](props.roomName, props.currentTurn, props.playerName, props.activePlayerID)}
					disabled = {false}>Steal 2 from a player as Captain</Button>
				</div>

				<div style ={{paddingBottom: "1em", paddingTop: "1em"}}>
					<Button type="button" className="btn btn-lg btn-light" style = {{width:"20em"}} onClick={all_moves["Assassinate someone you dislike!"](props.roomName, props.currentTurn, props.playerName, props.activePlayerID)}
					disabled = {false ? coins < 3 : true}>Assassinate someone you dislike!</Button>
				</div>

				<div style ={{paddingBottom: "1em", paddingTop: "1em"}}>
					<Button type="button" className="btn btn-lg btn-light" style = {{width:"20em"}} onClick={all_moves["Coup a scrub"](props.roomName, props.currentTurn, props.playerName, props.activePlayerID)}
					disabled = {false ? coins < 3 : true}>Coup a scrub</Button>
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
