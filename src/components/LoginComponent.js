import React from 'react';
import { register } from '../backend/startup';
import { Redirect } from 'react-router-dom'


// Why is this a class :(
// I'm BIG MAD

class LoginComponent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			value: '',
			redirect: false
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		this.setState({ value: event.target.value });
	}

	handleSubmit(event) {
		event.preventDefault();
	    register(this.state.value);
		this.setState({ redirect: true });
	}

	render() {
		if (this.state.redirect) {
			return (<Redirect to="/start" />)
		} else {

			return (
				<form onSubmit={this.handleSubmit.bind(this)}>
					<label>
						Name:
						<input type="text" value={this.state.value} onChange={this.handleChange} />
					</label>
					<input type="submit" value="Submit" />
				</form>
			);
		}
	}
}

export default LoginComponent;
