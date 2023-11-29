import React, {Fragment, useState, useRef} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark as close } from '@fortawesome/free-solid-svg-icons';
import {FloatingArrow, arrow, useFloating, offset} from '@floating-ui/react';
import ColorPopover from './ColorPopover';

export default ColorItem = ({ident, color, update, showDetails, setShowDetails, remove, colors}) => {
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
		setShowDetails(showDetails?undefined:ident)
	}
	return <Fragment>
		<div ref={refs.setReference} className="color-div" onClick={handleClick} style={{backgroundColor:color}}></div>
		<button onClick={evt => remove(ident)}><FontAwesomeIcon icon={close} /></button>
	{showDetails?(<ColorPopover
			ident={ident}
			color={color}
			floatingRefs={refs}
			floatingStyle={floatingStyles}
			arrowRef={arrowRef}
			floatingContext={context}
			update={update}
			colors={colors} />):''}
	</Fragment>
}