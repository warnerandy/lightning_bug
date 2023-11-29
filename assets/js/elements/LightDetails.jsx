import React from 'react';
import {FloatingArrow, arrow, FloatingPortal} from '@floating-ui/react';
import {SketchPicker} from 'react-color';


export default LightDetails = ({ident, light, floatingRefs, floatingStyle, floatingContext, arrowRef, update, colors}) => {
	const setColor = (color) => update(ident, 'color', color.hex)
	return <FloatingPortal root={document.body}>
		<div className="popover" ref={floatingRefs.setFloating} style={floatingStyle}>
			<FloatingArrow ref={arrowRef} context={floatingContext} className="arrow"/>
			<div className="form-group">
				<label>Bulb ON: <input type="checkbox" checked={light.isOn} onChange={e => update(ident, 'isOn', e.target.checked)}/></label>
			</div>
			<div className="form-group">
				<label>Color:</label>
				<SketchPicker color={light.color} onChange={setColor} presetColors={colors} hideAlpha  />
			</div>
		<div className="quick-colors">
			<h5>Quick Colors</h5>
			<button onClick={e => update(ident, 'color', "#FDF4DC")}>Warm</button>
			<button onClick={e => update(ident, 'color', "#FFFFFF")}>White</button>
			<button onClick={e => update(ident, 'color', "#ED1C24")}>Red</button>
			<button onClick={e => update(ident, 'color', "#57F287")}>Green</button>
			<button onClick={e => update(ident, 'color', "#005aff")}>Blue</button>
		</div>
		</div>
	</FloatingPortal>
}