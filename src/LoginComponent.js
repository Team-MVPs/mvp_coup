import React from 'react';
import firebase from 'firebase';

class LoginComponent extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {value: ''};
		
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	handleChange(event) {
		this.setState({value: event.target.value});
	}
	
	handleSubmit(event) {
		// console.log("WKEJRLJWLRJ");
		// // alert('A name was submitted: ' + this.state.value);
		// firebase.database().ref('/testing/').set({
		// 	"test_key": this.state.value
		// }).then(r => alert('wowoowow'));
		// event.preventDefault();
		
		event.preventDefault();
		
		const firebaseConfig = {
			apiKey: "AIzaSyAM_2cfUP2u2pv55y_WgfnXrzO16l4RtVQ",
			authDomain: "coup-c4862.firebaseapp.com",
			databaseURL: "https://coup-c4862.firebaseio.com",
			projectId: "coup-c4862",
			storageBucket: "coup-c4862.appspot.com",
			messagingSenderId: "1018352808422",
			appId: "1:1018352808422:web:e597c6b7985c0a39e52627",
			measurementId: "G-MDTYYPRVDF"
		};
		// Initialize Firebase
		firebase.initializeApp(firebaseConfig);
		firebase.analytics();
		
		const db = firebase.firestore();
		const userRef = db.collection("testing").add({
			key1: this.state.value,
			key2: "sample"
		});

		
		// let ref = Firebase.database().ref('/testing/');
		// ref.on('value', snapshot => {
		// 	const state = snapshot.val();
		// 	this.setState(state);
		// });
		console.log('DATA RETRIEVED');
	}
	
	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<label>
					Name:
					<input type="text" value={this.state.value} onChange={this.handleChange} />
				</label>
				<input type="submit" value="Submit" />
			</form>
		);
	}
}

export default LoginComponent;
