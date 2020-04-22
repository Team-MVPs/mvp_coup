import {firestore, root} from "../config/firebase";
import {handleDBException} from "./callbacks";
import firebase from 'firebase';
import React, {useContext, useEffect, useState} from 'react';
import { Modal, Button } from 'react-bootstrap';


function Popup(props){
	return (
		<div>
			{props.move}
		</div>)

}

export default Popup
