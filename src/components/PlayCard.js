import React from 'react';
import ambassador from '../images/ambassador.JPG';
import assassin from '../images/assasin.JPG';
import back from '../images/back.JPG';
import captain from '../images/captain.JPG';
import contessa from '../images/contessa.JPG';
import duke from '../images/duke.JPG';
import styles from './PlayCard.module.scss';

function PlayCard(props) {
    switch(props.cardName){
        case "Duke": {
            return (<div className={styles.cardWrapper}>
                <img src={duke} alt={props.cardName} className={styles.cardImage} />
                <div className={styles.cardLabel}>Duke</div>
            </div>);
        }
        case "Assassin": {
            return (<div className={styles.cardWrapper}>
                <img src={assassin} alt={props.cardName} className={styles.cardImage} />
                <div className={styles.cardLabel}>Assassin</div>
            </div>);
        }
        case "Contessa": {
            return (<div className={styles.cardWrapper}>
                <img src={contessa} alt={props.cardName} className={styles.cardImage} />
                <div className={styles.cardLabel}>Contessa</div>
            </div>);
        }
        case "Captain": {
            return (<div className={styles.cardWrapper}>
                <img src={captain} alt={props.cardName} className={styles.cardImage} />
                <div className={styles.cardLabel}>Captain</div>
            </div>);
        }
        case "Ambassador": {
            return (<div className={styles.cardWrapper}>
                <img src={ambassador} alt={props.cardName} className={styles.cardImage} />
                <div className={styles.cardLabel}>Ambassador</div>
            </div>);
        }
    }
    return (<div className={styles.cardWrapper}>
        <img src={back} alt={props.cardName} className={styles.cardImage} />
    </div>);
}

export default PlayCard;
