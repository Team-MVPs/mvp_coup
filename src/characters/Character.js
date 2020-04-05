import React from 'react';
import {Card} from 'react-bootstrap';

const CARD_TYPE = {
    "Ambassador": "warning",
    "Assassin": "dark",
    "Contessa": "danger",
    "Captain": "info",
    "Duke": "secondary",
    "face_down": "light",
};

function Character(props) {
    
    let name = "MVP COUP";
    let type = CARD_TYPE["face_down"];

    if (props.show_card){
        name = props.name;
        type = CARD_TYPE[name];
    }

    return (
        <Card bg={type} style={{ width: '15rem' }}> 
        <Card.Body>
            <Card.Header>{name}</Card.Header> 
        </Card.Body>
        </Card>
    );

}

export default Character;
