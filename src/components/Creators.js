import React from 'react';
import {Container, Row, Col, Card} from 'react-bootstrap';
import shehan_img from "../images/creators/shehan.jpg";
import preet_img from "../images/creators/preet.jpg";
import aravind_img from "../images/creators/aravind.jpeg";
import vandit_img from "../images/creators/vandit.jpeg";
import shivam_img from "../images/creators/shivam.jpg";

import { FaGithub, FaLinkedin } from 'react-icons/fa';
import {Link} from "react-router-dom";
import styles from './Creators.module.scss';


function Creator(creator) {
	const name = creator["name"];
	const image = creator["image"];
	const linkedin = creator["linkedin"];
	const github = creator["github"];
	
	return (
		<Col className={styles.creatorColumn}>
			<Card className={styles.creatorCard}>
				<Card.Header>
					<img src={image} alt={name} className={styles.creatorImage}/>
				</Card.Header>
				<Card.Body>
					<h4>{name}</h4>
					<a href={github} target="_blank" className={styles.socialLink}><FaGithub /></a>
					<a href={linkedin} target="_blank" className={styles.socialLink}><FaLinkedin /></a>
				</Card.Body>
			</Card>
		</Col>
	)
}

function CreatorComponent(props) {
	const creators = [
		{
			"name": "Shehan Suresh",
			"image": shehan_img,
			"linkedin": "https://www.linkedin.com/in/shehansuresh/",
			"github": "https://github.com/Shehan29",
		},
		{
			"name": "Preet Shah",
			"image": preet_img,
			"linkedin": "https://www.linkedin.com/in/preet-shah/",
			"github": "https://github.com/preetshah123",
		},
		{
			"name": "Aravind Segu",
			"image": aravind_img,
			"linkedin": "https://www.linkedin.com/in/aravind-segu/",
			"github": "https://github.com/aravind-segu",
		},
		{
			"name": "Vandit Patel",
			"image": vandit_img,
			"linkedin": "https://www.linkedin.com/in/vandit-patel1/",
			"github": "https://github.com/VanditPatel1",
		},
		{
			"name": "Shivam Dharme",
			"image": shivam_img,
			"linkedin": "https://www.linkedin.com/in/sdharme/",
			"github": "https://github.com/ShivamDh",
		},
	];
	
	return (
		<Container className={styles.creatorsContainer}>
			<h1 className={styles.creatorsTitle}>Creators of MVP Coup</h1>
			<Row>
				{creators.map(creator => Creator(creator))}
			</Row>
			<div className={`fixed-bottom ${styles.footerLink}`}>
				<Link to='/'>Back to the Game</Link>
			</div>
		</Container>
	)
}

export default CreatorComponent;
