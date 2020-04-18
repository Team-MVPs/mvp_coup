import {firestore, root} from "../config/firebase";
import {handleDBException} from "./callbacks";

function Move(type, player, to) {
	return {
		type: type,
		player: player,
		to: to
	}
}

function registerMoveCallback(roomName, playerId) {

}

function updateTurnInDB(roomName, turn, playerName, move) {
	firestore.collection(root).doc(roomName).collection("turns").doc(turn.toString()).set({
		turn: turn,
		playerName: playerName,
		move: move,
		blocks: []
	}).then(() => {
		console.log("Added turn to db");
	}).catch(() => handleDBException());
}

function move(type) {
	return function(roomName, turn, playerName) {
		return () => {
			const move = Move(type, playerName, "");
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
			updateTurnInDB(roomName, turn, playerName, move);
			incrementTurn(roomName, turn);
		}
	}
}

export const all_moves = {"Take General Income": move("general_income"),
	"Take Foreign Aid": move("foreign_aid"),
	"Take 3 as Duke": move("duke"),
	"Exchange your cards as Ambassador": move("exchange_cards"),
	"Steal 2 from a player as Captain": move("steal"),
	"Assassinate someone you dislike!": move("assassinate"),
	"Coup a scrub": move("coup")
};

export async function incrementTurn(roomName, currentTurn){
	await firestore.collection(root).doc(roomName).update({
		turn: currentTurn+1
	});
}
