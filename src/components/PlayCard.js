import React from 'react';
import ambassador from '../images/ambassador.JPG';
import assasin from '../images/assasin.JPG';
import back from '../images/back.JPG';
import captain from '../images/captain.JPG';
import contessa from '../images/contessa.JPG';
import duke from '../images/duke.JPG';

function PlayCard(props) {
    switch(props.cardName){
        case "Duke": {
            return (<div style={{
                width: "8em",
            }}> <img src={duke} alt={props.cardName} style={{maxWidth: "100%", borderRadius: "1em"}} /></div >);
        }
        case "Assassin": {
            return (<div style={{
                width: "8em",
            }}> <img src={assasin} alt={props.cardName} style={{maxWidth: "100%", borderRadius: "1em"}} /></div >);
        }
        case "Contessa": {
            return (<div style={{
                width: "8em",
            }}> <img src={contessa} alt={props.cardName} style={{maxWidth: "100%", borderRadius: "1em"}} /></div >);
        }
        case "Captain": {
            return (<div style={{
                width: "8em",
            }}> <img src={captain} alt={props.cardName} style={{maxWidth: "100%", borderRadius: "1em"}} /></div >);
        }
        case "Ambassador": {
            return (<div style={{
                width: "8em",
            }}> <img src={ambassador} alt={props.cardName} style={{maxWidth: "100%", borderRadius: "1em"}} /></div >);
        }
        case "undefined":{
            return (<div style={{
                width: "8em",
            }}> <img src={ambassador} alt={props.cardName} style={{maxWidth: "100%", borderRadius: "1em"}} /></div >);
        }
    }
    return (<div style={{
        width: "8em",
    }}> <img src={back} alt={props.cardName} style={{maxWidth: "100%", borderRadius: "1em"}} /></div >);
}

export default PlayCard;