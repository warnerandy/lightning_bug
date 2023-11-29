import React from 'react';
import {FloatingArrow, arrow, FloatingPortal} from '@floating-ui/react';
import {SketchPicker} from 'react-color';


export default ColorPopover = ({ident, color, floatingRefs, floatingStyle, floatingContext, arrowRef, update, colors}) => {
	const setColor = (color) => {
		console.log(color)
		update(ident, color.hex)
	}
	return <FloatingPortal root={document.body}>
		<div className="popover" ref={floatingRefs.setFloating} style={floatingStyle}>
			<FloatingArrow ref={arrowRef} context={floatingContext} className="arrow"/>
			<div className="form-group">
				<SketchPicker color={color} onChange={setColor} presetColors={colors} disableAlpha  />
			</div>
		</div>
	</FloatingPortal>
}