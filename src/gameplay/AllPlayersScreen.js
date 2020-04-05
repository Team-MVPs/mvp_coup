// @flow
import React from 'react';
import Character from '../characters/Character.js';

const all_chars = ["Duke", "Assassin", "Contessa", "Captain", "Ambassador"];

const chars = all_chars.map((name, inx) => (
    <Character name={name} key={inx} show_card={false}/>
));

function PlayerScreen(props) {
    return (
        <div align="center">
            Face Down Cards
            <br></br>
            {chars}
        </div>
    );
}

export default PlayerScreen;