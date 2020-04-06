import { firestore } from '../config/firebase';
import playerID from './startup';

var roomName = "vip";
var players = new Set();

export function playerRegistrationCallback(popupCallback) {
    firestore.collection(roomName)
        .onSnapshot((snapshot) => {
            console.log("in snapshot");
            var playersRegistered = [];
            snapshot.forEach((doc) => {
                let name = doc.data().name
                if (!players.has(name)) {
                    playersRegistered.push(doc.data().name);
                    players.add(name);
                }
            });
            console.log(playersRegistered);
            //Couldnt get popups to work for some reason
            if (playersRegistered.length > 0) {
                popupCallback("Players Registered", playersRegistered.join(","));
                // alert(playersRegistered.join(",") + " joined the game");
            }
        }, (error) => console.error(error));
}