import React, { Component } from 'react';
import socketIOClient from "socket.io-client";

import Paddle from './Paddle';
import Ball from './Ball';

class Container extends Component {
	constructor(){
		super();
		this.state = {
			playerId: '',
			playerX: '',
			playerY: '',
			enemyX: '',
			enemyY: '',
			ballX: '',
			ballY: '',
			lineY: [10, 50, 90, 130, 170],
			endpoint: "http://10.10.3.67:4001",
		}
	}

	game = () => {
		const { endpoint } = this.state;
		const socket = socketIOClient(endpoint);

		socket.on("GetData", data => {
			this.setState({
				playerId: data.userId,
				playerX: data.playerX,
				playerY: data.playerY,
				enemyX: data.enemyX,
				enemyY: data.enemyY,
				ballX: data.ballX,
				ballY: data.ballY,
			});
		});

		document.onkeydown = (e) => { 
			let btn = e.keyCode;
		 	socket.emit("BtnPress", btn);		
		}
	}

	componentDidMount() {;
		this.game();
 	}

	render(){
		
		return(
			<div className="container">
				<Paddle x={this.state.playerX} y={this.state.playerY} />
				<Paddle x={this.state.enemyX} y={this.state.enemyY} />
				{
					this.state.lineY.map((lineY, index) => {
						return(
							<div className="center-line" key={index} style={{ top: lineY }}>
							</div>
						);
					})
				}
				<Ball x={this.state.ballX} y={this.state.ballY} />
			</div>
		)
	}
}

export default Container;
