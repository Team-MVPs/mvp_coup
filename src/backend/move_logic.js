import {firestore, root} from "../config/firebase";
import {handleDBException} from "./callbacks";
import firebase from 'firebase';
import React, {useContext, useEffect, useState} from 'react';
import { generalIncome, Coup, foreignAid, Duke, Ambassador } from "./PerformMoves";

function Move(type, player, to) {
	return {
		type: type,
		player: player,
		to: to
	}
}

let registeredTurn = -1;
// TODO: get actual number of players

export function RegisterMoveCallback(roomName, turn, playerID, setMove, setCurrentMove) {
	firestore.collection(root).doc(roomName).collection("players").get().then((snap)=>{
		const numPlayers = snap.docs.length;
		if (turn >= 0 && turn !== registeredTurn) {
			firestore.collection(root).doc(roomName).collection("turns").doc(turn.toString()).onSnapshot(
				(doc) => {
					if (doc.exists) {
						const move = doc.data().move.type;
						const playerName = doc.data().playerName;
						if (doc.data().playerID !== playerID) {
							setMove(`${playerName} performed ${move}`);

						} else {
							if (move === "general_income"){
								generalIncome(roomName,playerID);
								incrementTurn(roomName).then(() => console.log("turn incremented"));
							
							} else if (move === 'coup'){
								Coup(roomName, playerID);								
								incrementTurn(roomName).then(() => console.log("turn incremented"));
							} else if (move === 'exchange_cards'){
								if (doc.data().confirmations+1 === numPlayers){
									setCurrentMove("Ambassador");
								}
							} 
							else {
								if (doc.data().confirmations+1 === numPlayers) {
										switch (move) {
											case "foreign_aid":
												foreignAid(roomName, playerID);
												break;
											case "duke":
												// duke
												Duke(roomName, playerID);
												break;
											//case "exchange_cards":
												// exchange cards
												//Ambassador(roomName,playerID)
											//	setAmbassador(true);
											//	break;
											case "assassinate":
												//assassinate someone
												move.to = "Vandit";
											case "steal":
												// somehow figure out how to get the `to`
												move.to = "Vandit";
												break;
											default:
												alert("Invalid move type");
												break;
										}
										incrementTurn(roomName).then(() => console.log("turn incremented"));
								}	
							}
						}	
				};
			registeredTurn = turn;
		})
	}})
}

export async function updateTurnInDB(roomName, turn, playerName, playerID, move) {
	await firestore.collection(root).doc(roomName).collection("turns").doc(turn.toString()).set({
		turn: turn,
		playerName: playerName,
		playerID: playerID,
		move: move,
		confirmations: 0,
		blocks: []
	}).then(() => {
		console.log("Added turn to db");
	}).catch(() => handleDBException());
}

function move(type) {
	return (roomName, turn, playerName, activePlayerID) => {
		return () => {
			const move = Move(type, playerName, activePlayerID, "");
			updateTurnInDB(roomName, turn, playerName, activePlayerID, move);	
		}
	}
}

export const all_moves = {
	"Take General Income": move("general_income"),
	"Take Foreign Aid": move("foreign_aid"),
	"Take 3 as Duke": move("duke"),
	"Exchange your cards as Ambassador": move("exchange_cards"),
	"Steal 2 from a player as Captain": move("steal"),
	"Assassinate someone you dislike!": move("assassinate"),
	"Coup a scrub": move("coup")
};

function respond(type) {
	return function (roomName, turn, playerName, notActivePlayerID) {
		return () => {
			switch (type) {
				case "confirm":
					firestore.collection(root).doc(roomName).collection("turns").doc(turn.toString()).update({
						confirmations: firebase.firestore.FieldValue.increment(1)
					}).then(() => console.log("incremented confirmations"));
					break;
				case "call_bluff":
					// get aid
					break;
				case "block":
					// duke
					break;
				default:
					alert("Invalid response");
					break;
			}
		}
	}
}

export const responses = {
	"Confirm": respond("confirm"),
	"Call Bluff": respond("call_bluff"),
	"Block": respond("block"),
};

export async function incrementTurn(roomName) {
	await firestore.collection(root).doc(roomName).update({
		turn: firebase.firestore.FieldValue.increment(1)
	}).then(() => console.log("incremented turn"));
}
