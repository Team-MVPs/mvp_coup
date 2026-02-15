import {firestore, root} from '../config/firebase';
import React from "react";
import { Redirect } from 'react-router-dom';

/**
 * Sets up cleanup handler for when user closes the browser/tab
 * param roomName - The name of the room to cleanup
 */
export function cleanupRoom(roomName: string): void {
    window.addEventListener("beforeunload", (ev: BeforeUnloadEvent) => {
        ev.preventDefault();
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

/**
 * Handles database exceptions by redirecting to home
 * returns JSX redirect element
 */
export function handleDBException(): JSX.Element {
    return (<Redirect to="/" />);
}
