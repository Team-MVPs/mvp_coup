import { firestore } from '../config/firebase';

//Default Room Name can change this later
var roomName = "vip";
var playerID = "";

export async function register(name) {
    await firestore.collection(roomName).add({
        name: name,
    })
    .then(function(docRef) {
        playerID = docRef.id;
        console.log("Document written with ID: ", playerID);
    })
}

