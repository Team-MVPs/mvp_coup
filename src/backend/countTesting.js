import React from 'react';
import {firestore} from '../config/firebase';
import { Modal, Button } from 'react-bootstrap';

var roomName = 'Preet Testing';
var totalCount = 0;

function CountTesting(props){
	if (props.countVal === 1){
		firestore.collection(roomName).doc(props.id)
	} 
	return (
		<div>
		<h1>{props.id}</h1>
		</div>)
}	

export default CountTesting;