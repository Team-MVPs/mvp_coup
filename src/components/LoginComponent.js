import React from 'react';
import { register } from '../backend/startup';
import { Redirect } from 'react-router-dom';

function LoginComponent(props) {
	const [value, setValue] = React.useState("");
	const [redirect, setRedirect] = React.useState(false);

	const handleChange = (event) => { setValue(event.target.value) }
	const handleSubmit = (event) => {
		event.preventDefault();
		if (value.length === 0){
			alert('Please input a Name');
			return (<Redirect to = "/" />);
		} else{
			register(value);

			setRedirect(true);
		}		
	}

	if (redirect) {
		//return (<Redirect to="/start" />)
		return (
			<Redirect to="/GameStart" />)
	}

	return (
		<form onSubmit={handleSubmit}>
			<label>
				Name:
				<input type="text" value={value} onChange={handleChange} />
			</label>
			<input type="submit" value="Submit" />
		</form>
	)
}

export default LoginComponent;
