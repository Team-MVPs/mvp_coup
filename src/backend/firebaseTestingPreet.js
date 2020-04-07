import { firestore } from '../config/firebase';

var roomName = "Preet Testing";
var players = new Set();

export function playerRegistrationCallback(popupCallback){
	firestore.collection(roomName).get().then((snapshot) => {
		snapshot.docs.forEach(doc => {console.log(doc.data())})
	})
}

