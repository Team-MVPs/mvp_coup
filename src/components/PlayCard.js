import React from 'react';
import ambassador from '../images/ambassador.JPG';
import assassin from '../images/assasin.JPG';
import back from '../images/back.JPG';
import captain from '../images/captain.JPG';
import contessa from '../images/contessa.JPG';
import duke from '../images/duke.JPG';

function PlayCard(props) {
    switch(props.cardName){
        case "Duke": {
            return (<div style={{
                width: "8em",
            }}> <img src={duke} alt={props.cardName} style={{maxWidth: "100%", borderRadius: "1em"}} />
            <div style={{
                textAlign: "center",
                paddingTop: "3%"
            }}>Duke</div>
            </div >);
        }
        case "Assassin": {
            return (<div style={{
                width: "8em",
            }}> <img src={assassin} alt={props.cardName} style={{maxWidth: "100%", borderRadius: "1em"}} />
            <div style={{
                textAlign: "center",
                paddingTop: "3%"
            }}>Assassin</div>
            </div >);
        }
        case "Contessa": {
            return (<div style={{
                width: "8em",
            }}> <img src={contessa} alt={props.cardName} style={{maxWidth: "100%", borderRadius: "1em"}} />
            <div style={{
                textAlign: "center",
                paddingTop: "3%"
            }}>Contessa</div>
            </div >);
        }
        case "Captain": {
            return (<div style={{
                width: "8em",
            }}> <img src={captain} alt={props.cardName} style={{maxWidth: "100%", borderRadius: "1em"}} />
            <div style={{
                textAlign: "center",
                paddingTop: "3%"
            }}>Captain</div>
            </div >);
        }
        case "Ambassador": {
            return (<div style={{
                width: "8em",
            }}> <img src={ambassador} alt={props.cardName} style={{maxWidth: "100%", borderRadius: "1em"}} />
            <div style={{
                textAlign: "center",
                paddingTop: "3%"
            }}>Ambassador</div>
            </div >);
        }
    }
    return (<div style={{
        width: "8em",
    }}> <img src={back} alt={props.cardName} style={{maxWidth: "100%", borderRadius: "1em"}} /></div >);
}

export default PlayCard;
