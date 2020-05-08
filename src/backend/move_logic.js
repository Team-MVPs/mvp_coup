import {firestore, root} from "../config/firebase";
import {handleDBException} from "./callbacks";
import firebase from 'firebase';
import React from 'react';
import { generalIncome, Coup, foreignAid, Duke, HasCard, exchangeOneCard, loseTwoCoins } from "./PerformMoves";

export function Move(type, player, to) {
	return {
		type: type,
		player: player,
		to: to
	}
}

let registeredTurn = -1;

export function RegisterMoveCallback(roomName, turn, playerID, realPlayerName, setMove, setCurrentMove, setConfirmed, 
									 setWaitingMessage, setPlayerChosen, setLoseACard, setAmbassadorBluff, totalPlayers) {
	firestore.collection(root).doc(roomName).collection("players").get().then((snap)=>{
		let numPlayers = 0;
		snap.forEach((player) => {
			if(player.data().cards.length > 0){
				numPlayers+=1;
			}
		 });
		console.log(numPlayers);
		var alreadyInvoked = false;
		var bluffDecided = false;
		var blockDecided = false;
		var takeCoins = false;
		let exchangeCard = false;
		let blocked = false;
		let makeMove = false;
		let incrementTurnFromPlayer = true;	
		if (turn >= 0 && turn !== registeredTurn) {
			firestore.collection(root).doc(roomName).collection("turns").doc(turn.toString()).onSnapshot(
				async (doc) => {									
					if (doc.exists) {
						let move = doc.data().move.type;
						const playerName = doc.data().playerName;
						var targetPlayer = doc.data().move.to;
						var ambassadorBluffDoc = doc.data().ambassadorBluff;
						if (doc.data().playerID !== playerID) {
							if(!alreadyInvoked && move !== "general_income" && move !== 'coup'){
								setMove(`${playerName} performed ${move}`);
								alreadyInvoked = true;
								if (move === 'assassinate'){
									setCurrentMove("AttemptAssassin");
									setWaitingMessage("Waiting for assassin to strike! Quick, try and hide!");																		
								} else if (move === "steal"){
									setCurrentMove("Captain");
									setWaitingMessage("Player is waiting to choose from whom to steal");
								} else if (move === "foreign_aid"){
									setCurrentMove("ForeignAid")
									setConfirmed(false);
								} else if (move === "duke"){
									setCurrentMove("Duke");
									setConfirmed(false);
								} else if (move === "exchange_cards"){
									setCurrentMove("Ambassador");
								}

							} else {
								if (move === 'coup'){
									setMove(`${playerName} performed ${move}`);
									setCurrentMove("Coup");
									setWaitingMessage("A Coup has been launched! Start Praying!");
									if (targetPlayer !== null){
										setPlayerChosen(targetPlayer);
										setLoseACard(true);
									}								
								} else if (move === 'assassinate'){
									if (targetPlayer !== null){
										setPlayerChosen(targetPlayer);
									}
									if (doc.data().confirmations === 1){
										setLoseACard(true);
										if (targetPlayer === realPlayerName){
											setWaitingMessage("You have been Assassinated! Choose one card to lose!")
										} else {
											setWaitingMessage("The Assassin has struck! " + targetPlayer + " will lose a card!");
										}
									}
								} else if (move === 'steal'){
									if (targetPlayer != null){
										setPlayerChosen(targetPlayer);

									}
									if (doc.data().confirmations === 1 && targetPlayer === realPlayerName){
										if(!takeCoins){
											firestore.collection(root).doc(roomName).collection("players").doc(playerID).update({
												coins: firebase.firestore.FieldValue.increment(-2)
												});
											takeCoins = true;
										};
									}
								}						

								if(doc.data().bluffLoser !== undefined && !bluffDecided){
									bluffDecided = true;
									if(doc.data().bluffLoser.playerID === playerID){
										if (move === "steal"){
											loseTwoCoins(roomName, playerID);
										}
										if (move === "assassinate"){											
											let noCards = []
											firestore.collection(root).doc(roomName).collection("players").doc(playerID).update({
												cards: noCards
											})
											incrementTurn(roomName, totalPlayers, playerName).then(() => console.log("turn incremented"));
										} else {
											if (move === "exchange_cards"){
												doc.ref.update({
													ambassadorBluff:true
												})
											}
											setWaitingMessage("Unsuccessful Bluff. Pick 1 card to lose");
											setMove("bluff");
										}
										
									}else{
										const bluffer = doc.data().bluffs[0].playerName;
										const loser = doc.data().bluffLoser.playerName;
										if(doc.data().bluffs[0].playerID === playerID){
											setWaitingMessage("Successful Bluff!" + loser + " is losing a card.")
										}else{
											setWaitingMessage(bluffer + " bluffed " + playerName + " 's move." + loser + " is losing a card");
										}
										setConfirmed(true);
										setMove("");
									}
								} else if (doc.data().blocks.length !== 0){
									if (doc.data().bluffs.length !== 0 && !blockDecided && doc.data().blocks[0].playerID === playerID){
										let originalMove = move;
										blockDecided = true;
										let blockedCardMove = "";
										switch (originalMove) {
												case "foreign_aid":
													blockedCardMove = "duke";
													break;
												case "assassinate":
													blockedCardMove = "Contessa";
													break;	
												case "steal":
													if (doc.data().blocks[0].card === "Ambassador"){
														blockedCardMove = "exchange_cards";
													} else{
														blockedCardMove = "steal";
													}

											}
										await HasCard(roomName, playerID, blockedCardMove).then((result)=>{
											console.log("Bluff result from block bluff " + result);
											if (result){
												setWaitingMessage("You were bluffed but they were wrong")
												setConfirmed(true);
												exchangeCard = true;
												firestore.collection(root).doc(roomName).collection("turns").doc(turn.toString()).update({
													bluffLoser : doc.data().bluffs[0]
												});
											} else {
												console.log(playerID, playerName);
												console.log('wrong bluff, this is loser');
												firestore.collection(root).doc(roomName).collection("turns").doc(turn.toString()).update({
													bluffLoser : {playerID: playerID, playerName: playerName}
												});
											}
										})
									}
								}
							}
						} else {
							if(doc.data().bluffs.length != 0 && !bluffDecided){
								if (doc.data().blocks.length === 0){
									await HasCard(roomName, playerID, move).then((result) => {
										bluffDecided = true;
										console.log("Bluff Result " + result);
										if(result){
											const bluffer = doc.data().bluffs[0].playerName;
											setWaitingMessage(bluffer + " bluffed " + "your move." + bluffer + " is losing a card");
											firestore.collection(root).doc(roomName).collection("turns").doc(turn.toString()).update({
												bluffLoser : doc.data().bluffs[0]
											});
											makeMove = true;
											incrementTurnFromPlayer = false;
											setConfirmed(true);
											exchangeCard = true;
										}else{
											move="";
											firestore.collection(root).doc(roomName).collection("turns").doc(turn.toString()).update({
												bluffLoser : {playerID: playerID, playerName: playerName}
											}).then(() => {
												setConfirmed(false);
												setMove("bluff");
												setWaitingMessage(doc.data().bluffs[0].playerName + " called Bluff. Pick 1 card to lose");
											})
										}
									})
								} else {
									if (doc.data().bluffLoser !== undefined){
										bluffDecided = true;
										if (doc.data().bluffLoser.playerID === playerID){
											setWaitingMessage("Unsuccessful Bluff. Pick 1 card to lose");
											setConfirmed(false);
											setMove("bluff");
											incrementTurnFromPlayer = false;										
										} else {
											setWaitingMessage("Gottem");
											incrementTurnFromPlayer = false;
											makeMove = true;
										}
									}

								}
							} else if (doc.data().blocks.length !== 0){
								setLoseACard(true);
								setConfirmed(false);
								setCurrentMove("blocked");
								blocked = true;
								if (doc.data().blocks.letGo){
									setConfirmed(false);
									incrementTurnFromPlayer = true;

								} else {
									incrementTurnFromPlayer = false;
								}
							}
							
							if (move === "general_income"){
								setConfirmed(false);
								generalIncome(roomName,playerID);
								incrementTurn(roomName, totalPlayers, playerName).then(() => console.log("turn incremented"));
							} else if (move === 'coup'){
								setConfirmed(false);
								if (!takeCoins){
									firestore.collection(root).doc(roomName).collection("players").doc(playerID).update({
										coins: firebase.firestore.FieldValue.increment(-7)
									});
									takeCoins = true;
								}	
								setCurrentMove('Coup')
								if (targetPlayer !== null){
									setLoseACard(true);
									setWaitingMessage('You have launched a Coup! '+ targetPlayer + ' will now lose a card!')
								}								
							} else if (move === 'exchange_cards'){
								if (doc.data().confirmations+1 === numPlayers || makeMove){
									if (exchangeCard){
										setAmbassadorBluff(true);
										await exchangeOneCard(roomName, playerID, move).then(()=>{
											console.log("move changed");
											exchangeCard = false;
											setConfirmed(false);
											setCurrentMove("Ambassador");
										});
										
									} else{
										setConfirmed(false);
										if (!ambassadorBluffDoc){
											setCurrentMove("Ambassador");
										}										
									}
									
								}
							} else if (move === 'assassinate'){
								if (!takeCoins){
									firestore.collection(root).doc(roomName).collection("players").doc(playerID).update({
										coins: firebase.firestore.FieldValue.increment(-3)
									});
									takeCoins = true;
								}
								if (!blocked){								
									setCurrentMove("AttemptAssassin");
								}
								if(doc.data().confirmations === 1){
									setLoseACard(true);
									setWaitingMessage("Your Assassin has struck! " + targetPlayer + ' will lose a card!')
								}
								if (incrementTurnFromPlayer && blocked){
									incrementTurn(roomName, totalPlayers, playerName).then(() => console.log("turn incremented"));
								}
							} else if (move === 'steal'){
								if (!blocked){
									setCurrentMove("Captain");
								}
								if (targetPlayer != null){
									setPlayerChosen(targetPlayer);
								}
								if (doc.data().confirmations === 1 || makeMove){
									if(!takeCoins){
										firestore.collection(root).doc(roomName).collection("players").doc(playerID).update({
											coins: firebase.firestore.FieldValue.increment(2)
										});
										takeCoins = true;
									}
									if (incrementTurnFromPlayer){
										incrementTurn(roomName, totalPlayers, playerName).then(() => console.log("turn incremented"));
									}
								} else if (incrementTurnFromPlayer && blocked){
									incrementTurn(roomName, totalPlayers, playerName).then(() => console.log("turn incremented"));
								}
							} else if (move === "foreign_aid"){
								if (doc.data().confirmations +1 === numPlayers && !blocked || makeMove){
									await foreignAid(roomName, playerID);
									if (incrementTurnFromPlayer){
										incrementTurn(roomName, totalPlayers, playerName).then(() => console.log("turn incremented"));
									};
								}
								if (incrementTurnFromPlayer && blocked){
									incrementTurn(roomName, totalPlayers, playerName).then(() => console.log("turn incremented"));
								}

							} else if(move === "duke"){
								if (doc.data().confirmations+1 === numPlayers || makeMove){
									Duke(roomName, playerID);
									makeMove = false;
									if (incrementTurnFromPlayer){
										incrementTurn(roomName, totalPlayers, playerName).then(() => console.log("turn incremented"));
									}
								}

							}						
						}
					if(exchangeCard && move !== ""){
						if (doc.data().blocks.length !== 0 && move === "assassinate"){
							move = "Contessa";
						}
						exchangeOneCard(roomName, playerID, move);
						exchangeCard = false;
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
		blocks: [],
		bluffs: [],
		ambassadorBluff: false
	}).then(() => {
		console.log("Added turn to db");
	}).catch(() => handleDBException());
}

function move(type) {
	return (roomName, turn, playerName, activePlayerID, setConfirmed) => {
		return () => {
			const move = Move(type, playerName, null, "");
			updateTurnInDB(roomName, turn, playerName, activePlayerID, move).then(() =>{
				if(setConfirmed !== null) setConfirmed(true);
			});	
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
	return function (roomName, turn, playerName, playerID, setConfirmed, setMove) {
		return () => {
			switch (type) {
				case "confirm":
					firestore.collection(root).doc(roomName).collection("turns").doc(turn.toString()).update({
						confirmations: firebase.firestore.FieldValue.increment(1)
					}).then(() => {
						console.log("incremented confirmations");
						setConfirmed(true);
						//setMove("");
						});
					break;
				case "call_bluff":
					firestore.collection(root).doc(roomName).collection("turns").doc(turn.toString()).update({
						bluffs: firebase.firestore.FieldValue.arrayUnion({playerID: playerID, playerName: playerName}),
					}).then(() => {
						setConfirmed(true);
						//setMove("");
						console.log("incremented confirmations");
					});
					break;
				case "block":
					console.log(playerID, playerName);
					console.log('blocked by');
					firestore.collection(root).doc(roomName).collection("turns").doc(turn.toString()).update({
						blocks: firebase.firestore.FieldValue.arrayUnion({playerID: playerID, playerName: playerName, letGo: false}),
					}).then(() => {
						setConfirmed(true);
						//setMove("");
						//console.log("incremented confirmations");
					});
					break;
				case "blockAsCAP":
					console.log(playerID, playerName);
					console.log('blocked by');
					firestore.collection(root).doc(roomName).collection("turns").doc(turn.toString()).update({
						blocks: firebase.firestore.FieldValue.arrayUnion({playerID: playerID, playerName: playerName, letGo: false, card: "Captain"}),
					}).then(() => {
						setConfirmed(true);
						//setMove("");
						//console.log("incremented confirmations");
					});
					break;
				case "blockAsAM":
					console.log(playerID, playerName);
					console.log('blocked by');
					firestore.collection(root).doc(roomName).collection("turns").doc(turn.toString()).update({
						blocks: firebase.firestore.FieldValue.arrayUnion({playerID: playerID, playerName: playerName, letGo: false, card: "Ambassador"}),
					}).then(() => {
						setConfirmed(true);
						//setMove("");
						//console.log("incremented confirmations");
					});
					break;
				default:
					alert("Invalid response");
					break;
			}
		}
	}
}

function respondBlock(type) {
	return function (roomName, turn, playerName, playerID, setConfirmed) {
		return () => {
			switch (type) {
				case "letGo":
					let playerInfo = {
							playerID: playerID,
							playerName: playerName,
							letGo: true
						};
					console.log(playerName, playerID);
					console.log('let it go');
					firestore.collection(root).doc(roomName).collection("turns").doc(turn.toString()).update({
						blocks: playerInfo
					}).then(() => {});
					break;
				case "bluff":
					console.log(playerID, playerName);
					console.log('called bluff');
					firestore.collection(root).doc(roomName).collection("turns").doc(turn.toString()).update({
						bluffs: firebase.firestore.FieldValue.arrayUnion({playerID: playerID, playerName: playerName}),
					}).then(() => setConfirmed(true));
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

export const responsesForeignAid = {
	"Confirm": respond("confirm"),
	"Block as Duke": respond("block")
};

export const responsesBlock = {
	"Let Go": respondBlock("letGo"),
	"Call Bluff": respondBlock("bluff")
};

export const responsesAssassin = {
	"Confirm": respond("confirm"),
	"Call Bluff": respond("call_bluff"),
	"Block as Contessa": respond("block")
};

export const responsesCaptain = {
	"Confirm": respond("confirm"),
	"Call Bluff": respond("call_bluff"),
	"Block as Captain": respond("blockAsCAP"),
	"Block as Ambassador": respond("blockAsAM"),
};

export const responsesDuke = {
	"Confirm": respond("confirm"),
	"Call Bluff": respond("call_bluff"),
};

export const responsesAmbassador = {
	"Confirm": respond("confirm"),
	"Call Bluff": respond("call_bluff"),
};

export async function incrementTurn(roomName, totalPlayers, playerName) {
	await firestore.collection(root).doc(roomName).get().then(async (room) => {
		let nextTurn  = room.data().turn + 1;
		console.log(nextTurn);
		while(!await nextTurnHasCards(room, nextTurn % totalPlayers)){
			nextTurn += 1;
			console.log(nextTurn);
			console.log(room.data().turn);
			if (nextTurn % totalPlayers === room.data().turn % totalPlayers) {
				await firestore.collection(root).doc(roomName).update({
					winner: playerName
				}).then(() => console.log(`Winner: ${playerName}`));
				break;
			}
		}
		await firestore.collection(root).doc(roomName).update({
			turn: nextTurn
		}).then(() => console.log("incremented turn"));
	})
}

async function nextTurnHasCards(room, index){
	return await room.ref.collection("players").get().then((docs) => {
		let i = 0;
		let result = false;
		docs.forEach((player) => {
			if(i == index){
				console.log("IN BOOL FUNCTION " + player.data().name);
				console.log("Cards " + player.data().cards.length);
				result = player.data().cards.length > 0;
			}
			i++;
		 });
		 console.log("RETURNING " + result);
		 return result;

	})
}

export async function confirmTurn(roomName, turn, setConfirmed, setWaitingMessage, setMove){
	console.log("Incrementing Confiramtions");
	if(setConfirmed !== null) setConfirmed(true);
	if(setWaitingMessage !== null) setWaitingMessage("Waiting for others");
	if(setMove !== null) setMove("");
	await firestore.collection(root).doc(roomName).collection("turns").doc(turn.toString()).update({
		confirmations: firebase.firestore.FieldValue.increment(1)
	});
}
