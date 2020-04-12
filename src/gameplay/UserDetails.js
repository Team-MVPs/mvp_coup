// @flow
import React from 'react';
import Character from '../characters/Character.js';


const all_chars = ["Duke", "Assassin", "Contessa", "Captain", "Ambassador"];

const chars = all_chars.map((name, inx) => (
    <Character name={name} key={inx} show_card={true}/>
));

function UserDetails(props) {
/*    return (
        <div align="center">
            Face Up Cards
            <br></br>
            {chars}
        </div>
    );*/
    return(
    	<div>
    		<h3>Player Information</h3>
    		
    	</div>)
}

export default UserDetails;