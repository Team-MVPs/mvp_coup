import { firestore } from '../config/firebase';

//Default Room Name can change this later
//var roomName = "vip";
var roomName = 'Preet Testing'
var playerID = "";

export async function register(name, setPlayerID) {
    await firestore.collection(roomName).add({
        name: name,
        count: 0,
        id: 0
    })
    .then(function(docRef) {
        playerID = docRef.id;
        setPlayerID(playerID);
        console.log("Document written with ID: ", playerID);
    })
    firestore.collection(roomName).onSnapshot((snapshot)=>{
    	snapshot.docs.forEach((doc)=>{
    		let docId = doc.id;
    		firestore.collection(roomName).doc(docId).update({
    			id: docId
    		});
     	})
    })
}

