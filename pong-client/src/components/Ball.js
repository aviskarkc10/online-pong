import React from 'react';

const Ball = props => {
	return(
		<div className="ball" style={{ left: props.x, top: props.y }}>
		</div>
	);
}

export default Ball;