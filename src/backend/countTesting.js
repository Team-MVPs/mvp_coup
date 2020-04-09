import React from 'react';
import {firestore} from '../config/firebase';
import { Modal, Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

var roomName = 'Preet Testing';
var roomSize = -1;

function CountTesting(props){
	const [totalCount, setTotalCount] = React.useState(0)
	if (props.accepted){
		firestore.collection(roomName).doc(props.id).update({
			count: 1
		});
	} 

	firestore.collection(roomName).onSnapshot((snapshot)=>{
		let playerCount = 0;
		snapshot.docs.forEach((doc)=>{
			let eachCount = doc.data().count;
			playerCount += eachCount;
		});
		setTotalCount(playerCount);
	})
	firestore.collection(roomName).get().then((docs)=>{
		roomSize = docs.size;
	})
	if (roomSize >=2 && totalCount == roomSize){
		console.log('Redirect')
		return (
			<Redirect to="/start" />)
	}
	return (
		<div>
			<h4>{totalCount}/{roomSize} have accepted!</h4>
		</div>)
}	

export default CountTesting;