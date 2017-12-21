import React from 'react';

const Paddle = props => {
	let styles = {left: props.x, top: props.y};
	return(
		<div className="paddle" style={styles} >
		</div>
	);

}

export default Paddle;