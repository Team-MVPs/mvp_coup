import { firestore, root } from '../config/firebase';
import { distributeCards } from "../backend/game_logic.js"

//Default Room Name can change this later
let playerID = "";

export async function register(setPlayerID, name, roomName) {
    await firestore.collection(root).doc(roomName).collection("players").add({
        name: name
    }).then((docRef) => {
        playerID = docRef.id;
        setPlayerID(playerID);
        console.log("Document written with ID: ", playerID);
    })
}

export async function checkRoomNameExists(roomName) {
    const snapshot = await firestore.collection(root).get();
    for (let i = 0; i < snapshot.docs.length; i++){
        if (snapshot.docs[i].id === roomName) {
            return true;
        }
    }
    return false;
}

export async function checkPlayerNameExists(roomName, playerName) {
    const currentPlayers = await firestore.collection(root).doc(roomName).collection("players").get();
    for (let i=0; i<currentPlayers.docs.length; i++){
        console.log(currentPlayers.docs[i].data().name);
        if (currentPlayers.docs[i].data().name === playerName) {
            return true;
        }
    }
    return false;
}

export async function createRoomName(roomName) {
    await firestore.collection(root).doc(roomName).set({
        startGame: false
    });
}

export async function startGame(roomName) {
    await distributeCards(roomName).then(() => {
        firestore.collection(root).doc(roomName).update({
            startGame: true,
            turnCount: 0
        });
    })
}

