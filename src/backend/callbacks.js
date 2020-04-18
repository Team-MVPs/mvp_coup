import {firestore, root} from '../config/firebase';
import React from "react";
import { Redirect } from 'react-router-dom';


export function cleanupRoom(roomName) {
    window.addEventListener("beforeunload", () => {
        firestore.collection(root).doc(roomName).collection("players").delete().then(
            firestore.collection(root).doc(roomName).delete().then(
                () => {
                    console.log("Game room has been removed from firebase");
                    return (<Redirect to="/" />);
                }
            ).catch(() => handleDBException())
        ).catch(() => handleDBException());
    });
}

export function handleDBException() {
    return (<Redirect to="/" />);
}
