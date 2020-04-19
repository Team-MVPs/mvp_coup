import {firestore, root} from "../config/firebase";
import {handleDBException} from "./callbacks";
import firebase from 'firebase';
// import { confirmAlert } from 'react-confirm-alert';
// import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

function Move(type, player, to) {
	return {
		type: type,
		player: player,
		to: to
	}
}

let registeredTurn = -1;
export function registerMoveCallback(roomName, turn, playerID, setMove) {
	if (turn >= 0 && turn !== registeredTurn) {
		console.log(`turn: ${turn}`);
		firestore.collection(root).doc(roomName).collection("turns").doc(turn.toString()).onSnapshot(
			(doc) => {
				console.log("turns callback");
				console.log(turn);
				if (!doc.exists) {
					console.log("Turn hasn't been made yet");
				} else {
					console.log("doc exists");
					if (doc.data().playerID !== playerID) {
						console.log(doc.data());
						const playerName = doc.data().playerName;
						const move = doc.data().move.type;
						setMove(`${playerName} performed ${move}`);
						// confirmAlert({
						// 	message: `${playerName} performed ${move}`,
						// 	buttons: [
						// 		{
						// 			label: 'Confirm',
						// 			onClick: () => alert('Click Yes')
						// 		},
						// 		{
						// 			label: 'Block',
						// 			onClick: () => alert('Click No')
						// 		},
						// 		{
						// 			label: 'Bluff',
						// 			onClick: () => alert('Click No')
						// 		},
						// 	]
						// });
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
			// incrementTurn(roomName);
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

export const responses = {
	"Confirm": console.log("confirm"),
	"Call Bluff": console.log("bluff"),
	"Block": console.log("block"),
};

export async function incrementTurn(roomName) {
	await firestore.collection(root).doc(roomName).update({
		turn: firebase.firestore.FieldValue.increment(1)
	}).then(() => console.log("incremented turn"));
}
