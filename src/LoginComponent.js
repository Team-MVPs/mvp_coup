import React from 'react';
import {firestore} from './config/firebase';


// Why is this a class :(
// I'm BIG MAD

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
		
		const userRef = firestore.collection("testing").doc("Aravind").set({
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
