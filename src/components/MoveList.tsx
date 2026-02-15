import React, {useEffect, useState} from 'react';
import { Button } from 'react-bootstrap';
import {all_moves, responses, responsesForeignAid, responsesBlock, responsesAssassin, responsesDuke, responsesCaptain, responsesAmbassador} from '../backend/move_logic.js';
import {firestore, root} from "../config/firebase";


export function MoveList(props) {
	const [assassinDisabled, setAssassinDisabled] = useState(true);
	const [coupDisabled, setCoupDisabled] = useState(true);
	const [theRest, setTheRest] = useState(false);
	const [captainDisabled, setCaptainDisabled] = useState(false);
	useEffect( () => {
		const subscribe = firestore.collection(root).doc(props.roomName).collection("players").doc(props.activePlayerID).get().then(async (player)=>{
			let coins = player.data().coins;
			if (coins >= 3 && coins < 10){
				setAssassinDisabled(false);
			}
			if (coins >= 7){
				setCoupDisabled(false);
			}
			if (coins >= 10){
				setTheRest(true);
			}
			await firestore.collection(root).doc(props.roomName).collection("players").get().then((players)=>{
				let disableCaptain = true;
				for (let i = 0; i < players.docs.length; ++i) {
					let doc = players.docs[i];
					if (doc.id !== props.activePlayerID && doc.data().coins>=2 && doc.data().cards.length >= 1) {
						disableCaptain = false;
					}
				}
				setCaptainDisabled(disableCaptain);
			});
		return () => subscribe;
		}, []);
	});

	return (<div>
				<div style ={{paddingBottom: "1em", paddingTop: "1em"}}>
					<Button type="button" className="btn btn-lg btn-light" style = {{width:"20em"}} onClick={all_moves["Take General Income"](props.roomName, props.currentTurn, props.playerName, props.activePlayerID, null)}
					disabled={theRest}>Take General Income</Button>
				</div>

				<div style ={{paddingBottom: "1em", paddingTop: "1em"}}>
					<Button type="button" className="btn btn-lg btn-light" style = {{width:"20em"}} onClick={all_moves["Take Foreign Aid"](props.roomName, props.currentTurn, props.playerName, props.activePlayerID, props.setConfirmed)}
					disabled = {theRest}>Take Foreign Aid</Button>
				</div>

				<div style ={{paddingBottom: "1em", paddingTop: "1em"}}>
					<Button type="button" className="btn btn-lg btn-light" style = {{width:"20em"}} onClick={all_moves["Take 3 as Duke"](props.roomName, props.currentTurn, props.playerName, props.activePlayerID, props.setConfirmed)}
					disabled = {theRest}>Take 3 as Duke</Button>
				</div>

				<div style ={{paddingBottom: "1em", paddingTop: "1em"}}>
					<Button type="button" className="btn btn-lg btn-light" style = {{width:"20em"}} onClick={all_moves["Exchange your cards as Ambassador"](props.roomName, props.currentTurn, props.playerName, props.activePlayerID, props.setConfirmed)}
					disabled = {theRest}>Exchange your cards as Ambassador</Button>
				</div>

				<div style ={{paddingBottom: "1em", paddingTop: "1em"}}>
					<Button type="button" className="btn btn-lg btn-light" style = {{width:"20em"}} onClick={all_moves["Steal 2 from a player as Captain"](props.roomName, props.currentTurn, props.playerName, props.activePlayerID, null)}
					disabled = {theRest || captainDisabled}>Steal 2 from a player as Captain</Button>
				</div>

				<div style ={{paddingBottom: "1em", paddingTop: "1em"}}>
					<Button type="button" className="btn btn-lg btn-light" style = {{width:"20em"}} onClick={all_moves["Assassinate someone you dislike!"](props.roomName, props.currentTurn, props.playerName, props.activePlayerID, null)}
					disabled = {assassinDisabled}>Assassinate someone you dislike!</Button>
				</div>

				<div style ={{paddingBottom: "1em", paddingTop: "1em"}}>
					<Button type="button" className="btn btn-lg btn-light" style = {{width:"20em"}} onClick={all_moves["Coup a scrub"](props.roomName, props.currentTurn, props.playerName, props.activePlayerID, null)}
					disabled = {coupDisabled}>Coup a scrub</Button>
				</div>
	</div>);
}

export function ResponseList(props){
	return (<div>
		{Object.keys(responses).map(move => (
			<div style ={{paddingBottom: "1em", paddingTop: "1em"}}>
				<Button type="button" className="btn btn-lg btn-light" style = {{width:"20em"}} onClick={responses[move](props.roomName, props.currentTurn, props.playerName, props.notActivePlayerID, props.setConfirmed, props.setMove)}>{move}</Button>
			</div>
		))}
	</div>);
}

export function ResponseListBlock(props){
	return (<div>
		{Object.keys(responsesBlock).map(move => (
			<div style ={{paddingBottom: "1em", paddingTop: "1em"}}>
				<Button type="button" className="btn btn-lg btn-light" style = {{width:"20em"}} onClick={responsesBlock[move](props.roomName, props.currentTurn, props.playerName, props.activePlayerID, props.setConfirmed)}>{move}</Button>
			</div>
		))}
	</div>);
}

export function ResponseListForeignAid(props){
	return (<div>
		{Object.keys(responsesForeignAid).map(move => (
			<div style ={{paddingBottom: "1em", paddingTop: "1em"}}>
				<Button type="button" className="btn btn-lg btn-light" style = {{width:"20em"}} onClick={responsesForeignAid[move](props.roomName, props.currentTurn, props.playerName, props.notActivePlayerID, props.setConfirmed, props.setMove)}>{move}</Button>
			</div>
		))}
	</div>);
}

export function ResponseListAssassin(props){
	return (<div>
		{Object.keys(responsesAssassin).map(move => (
			<div style ={{paddingBottom: "1em", paddingTop: "1em"}}>
				<Button type="button" className="btn btn-lg btn-light" style = {{width:"20em"}} onClick={responsesAssassin[move](props.roomName, props.currentTurn, props.playerName, props.notActivePlayerID, props.setConfirmed, props.setMove)}>{move}</Button>
			</div>
		))}
	</div>);
}

export function ResponseListDuke(props){
	return (<div>
		{Object.keys(responsesDuke).map(move => (
			<div style ={{paddingBottom: "1em", paddingTop: "1em"}}>
				<Button type="button" className="btn btn-lg btn-light" style = {{width:"20em"}} onClick={responsesDuke[move](props.roomName, props.currentTurn, props.playerName, props.notActivePlayerID, props.setConfirmed, props.setMove)}>{move}</Button>
			</div>
		))}
	</div>);
}

export function ResponseListCaptain(props){
	return (<div>
		{Object.keys(responsesCaptain).map(move => (
			<div style ={{paddingBottom: "1em", paddingTop: "1em"}}>
				<Button type="button" className="btn btn-lg btn-light" style = {{width:"20em"}} onClick={responsesCaptain[move](props.roomName, props.currentTurn, props.playerName, props.notActivePlayerID, props.setConfirmed, props.setMove)}>{move}</Button>
			</div>
		))}
	</div>);
}

export function ResponseListAmbassador(props){
	return (<div>
		{Object.keys(responsesAmbassador).map(move => (
			<div style ={{paddingBottom: "1em", paddingTop: "1em"}}>
				<Button type="button" className="btn btn-lg btn-light" style = {{width:"20em"}} onClick={responsesAmbassador[move](props.roomName, props.currentTurn, props.playerName, props.notActivePlayerID, props.setConfirmed, props.setMove)}>{move}</Button>
			</div>
		))}
	</div>);
}
