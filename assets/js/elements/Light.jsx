import React, {Fragment, useState, useRef} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb as lightOn } from '@fortawesome/free-solid-svg-icons';
import { faLightbulb as lightOff } from '@fortawesome/free-regular-svg-icons';
import {FloatingArrow, arrow, useFloating, offset} from '@floating-ui/react';
import LightDetails from './LightDetails';

export default Light = ({ident, light, update, showDetails, setShowDetails, onOffMode}) => {
	const arrowRef = useRef(null);
	const {refs, floatingStyles, context} = useFloating({
	middleware: [
	  arrow({
	    element: arrowRef,
	  }),
	  offset(10)
	],
	});

	const handleClick = (event) => {
		if (onOffMode) {
			update(ident, 'isOn', !light.isOn)
		}
		else {
			setShowDetails(showDetails?undefined:ident)
		}
	}
	return <Fragment><button ref={refs.setReference} onClick={handleClick} className="light-button" style={{borderColor:light.color}}>
		<FontAwesomeIcon icon={light.isOn?lightOn:lightOff} style={{color:light.color}}/>
	</button>
	{showDetails?(<LightDetails
			ident={ident}
			light={light}
			floatingRefs={refs}
			floatingStyle={floatingStyles}
			arrowRef={arrowRef}
			floatingContext={context}
			update={update} />):''}
	</Fragment>
}