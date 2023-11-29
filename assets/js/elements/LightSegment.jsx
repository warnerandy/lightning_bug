import React, {useState} from 'react';
import Light from './Light';

export default LightSegment = ({segment, update, idx}) => {
	const [showDetails, setShowDetails] = useState();
	const setLights = (lightIdx, name, value) => {
		let change = Object.assign({}, segment.lights[lightIdx])
		change[name] = value

		update(idx, 'lights', segment.lights.toSpliced(lightIdx,1,change))
	}
	return <li>
		<div>
			<label>Segment Length</label>
			<input type="number" value={segment.length} onChange={e => update(idx, 'length', e.target.value)}/>
		</div>
		<ol className="light-list">
			{segment.lights.map((light, lightIdx) => <li><Light key={lightIdx} ident={lightIdx} light={light} update={setLights} showDetails={showDetails == lightIdx} setShowDetails={setShowDetails} /></li>)}
		</ol>
	</li>
}