import { firestore } from '../config/firebase';

//Default Room Name can change this later
//var roomName = "vip";
var roomName = "Preet Testing"
var playerID = "";
var root = "root";

export async function register(setPlayerID, name, roomName) {
    await firestore.collection(root).doc(roomName).collection("players").add({
        name: name,
        count: 0,
        id: 0
    })
        .then(function (docRef) {
            playerID = docRef.id;
            setPlayerID(playerID);
            console.log("Document written with ID: ", playerID);
        })
    firestore.collection(roomName).onSnapshot((snapshot) => {
        snapshot.docs.forEach((doc) => {
            let docId = doc.id;
            firestore.collection(roomName).doc(docId).update({
                id: docId
            });
        })
    })
}

export async function checkRoomNameExists(roomName) {
    console.log("Checking");
    const snapshot = await firestore.collection(root).get();
    for(let i = 0; i < snapshot.docs.length; i++){
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

export async function startGame(roomName){
    await firestore.collection(root).doc(roomName).set({
        startGame: true
    });
}

