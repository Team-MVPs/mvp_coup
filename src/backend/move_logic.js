import {firestore, root} from "../config/firebase";
import {handleDBException} from "./callbacks";
import firebase from 'firebase';

function Move(type, player, to) {
	return {
		type: type,
		player: player,
		to: to
	}
}

let registeredTurn = -1;
// TODO: get actual number of players
let numPlayers = 2;
export function registerMoveCallback(roomName, turn, playerID, setMove) {
	if (turn >= 0 && turn !== registeredTurn) {
		firestore.collection(root).doc(roomName).collection("turns").doc(turn.toString()).onSnapshot(
			(doc) => {
				if (doc.exists) {
					if (doc.data().playerID !== playerID) {
						const playerName = doc.data().playerName;
						const move = doc.data().move.type;
						setMove(`${playerName} performed ${move}`);
					} else if (doc.data().confirmations+1 === numPlayers) {
						incrementTurn(roomName).then(() => console.log("turn incremented"));
					}
				}
			});
		registeredTurn = turn;
	}
}

function updateTurnInDB(roomName, turn, playerName, playerID, move) {
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
					// get income
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
			updateTurnInDB(roomName, turn, playerName, playerID, move);
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
	"Call Bluff": respond("bluff"),
	"Block": respond("block"),
};

export async function incrementTurn(roomName) {
	await firestore.collection(root).doc(roomName).update({
		turn: firebase.firestore.FieldValue.increment(1)
	}).then(() => console.log("incremented turn"));
}
