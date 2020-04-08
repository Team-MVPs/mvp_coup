import React from 'react';
import {firestore} from '../config/firebase';
import { Modal, Button } from 'react-bootstrap';

var roomName = 'Preet Testing';
var totalCount = 0;

function CountTesting(props){
	if (props.countVal === 1){
		totalCount += 1;
	} 
	return (
		<div>
		{console.log('total count is ' + totalCount)}
		</div>)
}	

export default CountTesting;