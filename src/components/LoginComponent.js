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
			register(props.setPlayerID, value);
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
			<div className = "form=group">
				<label style = {{marginTop:50}}>
					<input className ="form-control" type="text" value={value} onChange={handleChange} placeholder = "Enter Name"/>
				</label>
			</div>
			<div>
				<button type="Submit" className="btn btn-primary mb-2" onClick = {handleSubmit}>Submit</button>
			</div>
		</form>
	)
}

export default LoginComponent;
