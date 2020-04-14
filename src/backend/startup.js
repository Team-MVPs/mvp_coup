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
    console.log("Checking");
    const snapshot = await firestore.collection(root).get();
    for (let i = 0; i < snapshot.docs.length; i++){
        console.log(snapshot.docs[i].id);
        if (snapshot.docs[i].id === roomName) {
            console.log("Returning True");
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
            startGame: true
        });
    })
}

