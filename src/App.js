import React from 'react';
import logo from './team.png';
import './App.css';
import LoginComponent from './LoginComponent'

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p className="bottom-text">
					Welcome to Online Coup
					<br/>
					Brought to you by MVPs
				</p>
			</header>
			<body className="App-body">
				<LoginComponent/>
			</body>
		</div>
		
	);
}

export default App;
