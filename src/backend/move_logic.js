import {firestore, root} from "../config/firebase";
import {handleDBException} from "./callbacks";
import firebase from 'firebase';
import React, {useContext, useEffect, useState} from 'react';

function Move(type, player, to) {
	return {
		type: type,
		player: player,
		to: to
	}
}

let registeredTurn = -1;
// TODO: get actual number of players


export function RegisterMoveCallback(roomName, turn, playerID, setMove) {
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
						} else if (doc.data().confirmations+1 === numPlayers) {
							move(move);
							incrementTurn(roomName).then(() => console.log("turn incremented"));
						}
					}
				});
			registeredTurn = turn;
		}
	})
}

export function updateTurnInDB(roomName, turn, playerName, playerID, move) {
	firestore.collection(root).doc(roomName).collection("turns").doc(turn.toString()).set({
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
	return function (roomName, turn, playerName, playerID) {
		return () => {
			const move = Move(type, playerName, playerID, "");
			switch (type) {
				case "general_income":
					firestore.collection(root).doc(roomName).collection("players").doc(playerID).update({
						coins: firebase.firestore.FieldValue.increment(1)
					})
					break;
				case "foreign_aid":
					// get aid
					break;
				case "duke":
					// duke
					break;
				case "exchange_cards":
					// get income
					break;
				case "steal":
					// somehow figure out how to get the `to`
					move.to = "Vandit";
					break;
				case "assassinate":
					move.to = "Vandit";
					break;
				case "coup":
					move.to = "Vandit";
					break;
				default:
					alert("Invalid move type");
					break;
			}
			//updateTurnInDB(roomName, turn, playerName, playerID, move);
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
	return function (roomName, turn, playerName, playerID) {
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
