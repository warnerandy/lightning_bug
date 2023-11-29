import React, {StrictMode, useState, useRef, useEffect} from 'react';
import SegmentList from './SegmentList';
import ServiceList from './ServiceList';
import Light from "./Light";
import {SketchPicker} from 'react-color';
import ColorItem from './ColorItem';
import PatternList from './Pattern';

import { ToastContainer, toast } from 'react-toastify';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark as close, faBan, faUpload, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

export default App = (props) => {
	const [segments, setSegments] = useState([]);
	const [max, setMax] = useState(100);
	const [tMax, setTMax] = useState(max);
	const [pixels, setPixels] = useState([]);
	const [method, setMethod] = useState('static');
	const [delay, setDelay] = useState(1);
	const [speed, setSpeed] = useState(0);
	const [brightness, setBrightness] = useState(20);
	const [onOffMode, setOnOffMode] = useState(true);
	const [colors, setColors] = useState([]);
	const [patterns, setPatterns] = useState([]);
	const [showDetails, setShowDetails] = useState();
	const [activePattern, setActivePattern] = useState();
	var now = new Date();
	now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
	now = now.toISOString().slice(0,16);
	const [time, updateTime] = useState(now);

	const currentPattern = Array.isArray(patterns) && activePattern !== undefined? patterns[activePattern] : {name:'', colors:[], size:2};
	
	useEffect(() => {
		loadColors();
		loadPatterns();
	},[])
	let tFormatted = time
	if (time) {
		tFormatted = new Date(time).toISOString()
	}

	useEffect(() => {
		let lightObj = {
			brightness:brightness/100, 
			total: max, 
			method:method, 
			speed: speed, 
			colors:currentPattern.colors, 
			size: parseInt(currentPattern.size),
			runTime: tFormatted
		}
		let url = '/api/set'
		if (method == "spotlight" || method == 'static') {
			lightObj.lights = pixels
			url = '/api/set/spotlight'
		}
		fetch(url, {
			method: 'POST',
			headers: {
		      "Content-Type": "application/json",

		    },
		    body: JSON.stringify(lightObj)
		}).then (response => {
			toast.success("Lights updated")
		})
	},[pixels, method])

	const sendSpots = (event) => {
		setMethod('spotlight')
		send()
	}

	const send = (event) => {
		
	}
	const load = () => {
		fetch('api/load').then(response => response.json())
		.then (json => {
			let total = json.data.total || json.data.pixels.length
			setMax(total)
			setTMax(total)

			setPixels(json.data.pixels.map(pixel => {
				return {color: rgbToHex(pixel.r, pixel.g, pixel.b), isOn: true}
			}))
			updateLightCount(true)
			toast.success("Connected to a Lightning Bug!")
		})
	}

	const updateLightCount = (skipPixelSet) => {
		setMax(parseInt(tMax));
		if (!skipPixelSet) {
			newLights = Array(parseInt(tMax)).fill({color:'#FDF4DC', isOn:true})
			pixels.forEach( (px, idx) => idx < newLights.length ? newLights[idx] = px : '' )
			setPixels(newLights)
		}
	}

	const updateLight = (idx, name, value) => {
		let currentPx = pixels[idx];
		let update = {};
		update[name] = value;
		pixels[idx] = Object.assign({}, currentPx, update);
		setPixels(pixels.concat());
	}

	const setPattern = () => {
		setMethod("rotate")
		const currentPattern = patterns[activePattern]
		let idx = 0
		let sizeIdx = 0
		let colorIdx = 0
		let currentColor = currentPattern.colors[colorIdx]
		let newPixels = []
		 while (idx < max) {
		 	if (sizeIdx == currentPattern.size) {
		 		sizeIdx = 0;
		 		++colorIdx;
		 		if (colorIdx == currentPattern.colors.length) {
		 			colorIdx = 0
		 		}
		 		currentColor = currentPattern.colors[colorIdx];
		 	}
		 	newPixels.push({color: currentColor, isOn:true})
		 	sizeIdx++;
		 	idx++
		 }
		 setPixels(newPixels)
		 send()
	}

	const addColor = (event) => {
		setColors(colors.concat(["#ffffff"]))
	}
	const updateColor = (idx, color) => {
		const id = idx.split(':')[1]
		setColors(colors.toSpliced(id, 1, color))
	}
	const removeColor = (idx) => {
		const id = idx.split(':')[1]
		setColors(colors.toSpliced(id, 1))
	}

	function rgbToHex(r, g, b) {
	  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	}


	const saveColors = () => {
		localStorage.setItem("colors", JSON.stringify(colors));
		toast.success("Colors Saved")
	}

	const loadColors = () => {
		const colors = JSON.parse(localStorage.getItem("colors")) || [];
		toast.success("Colors Loaded")
		setColors(colors)
	}	

	const savePatterns = () => {
		localStorage.setItem("patterns", JSON.stringify(patterns));
		toast.success("Patterns Saved")
	}

	const loadPatterns = () => {
		const loadedPatterns = JSON.parse(localStorage.getItem("patterns")) || [];
		setPatterns(loadedPatterns)
		toast.success("Patterns Loaded")
	}


	const updateCurrentPattern = (name, value) => {
		let newPattern = Object.assign({}, currentPattern)
		newPattern[name] = value;
		setPatterns(patterns.toSpliced(activePattern,1,newPattern));
	}

	
	const addPattern = () => {
		setPatterns(patterns.concat({name:'', colors:[], size:2}))
	}
	const addPatternColor = (event) => {
		updateCurrentPattern('colors', currentPattern.colors.concat(["#ffffff"]))
	}
	const updatePatternColor = (idx, color) => {
		const id = idx.split(':')[1]
		updateCurrentPattern('colors', currentPattern.colors.toSpliced(id, 1, color))
	}
	const removePatternColor = (idx) => {
		const id = idx.split(':')[1]
		updateCurrentPattern('colors', currentPattern.colors.toSpliced(id, 1))
	}

	const toggleAll = (isOn) => {
		setPixels(pixels.map(px => Object.assign({},px,{isOn:isOn})))
	}

	const quickOff = () => {
		setMethod("clear")
		send()
	}

	const allWhite = () => {
		setPixels(pixels.map(px => Object.assign({},px,{color:"#FDF4DC"})))
	}

	const stop = () => setSpeed(0)

	return <StrictMode>
		<h1>Lightning Bug!</h1>
		<ServiceList load={load}/>
		<fieldset>
		<legend>Strand Settings</legend>
		<div className="form-group">
		  <label htmlFor="volume">Speed</label>
		  <div className="connected-input">
		  	<input value={speed} type="number" id="speed" name="speed" min="-100" max="100" step="1" onChange={e => setSpeed(parseInt(e.target.value))} />
		  	<button onClick={e => stop()}><FontAwesomeIcon icon={faBan} /></button>
		  </div>
		</div>
		<div className="form-group">
		  <label htmlFor="brightness">Brightness</label>
		  <input type="range" id="brightnes" name="brightness" min="0" max="20" step="1" onChange={e => setBrightness(parseInt(e.target.value))} />
		</div>
		<div className="form-group">
			<label htmlFor="max-lights">Light Count</label>
			<input id="max-lights" type="number" value={tMax} onChange={e => setTMax(e.target.value)}/>
		</div>
		<div className="form-group">
			<label>Schedule Action</label>
			<input type="datetime-local" value={time} onChange={e => updateTime(e.target.value)} /> <br />
		</div>
		<div className="actions">
			<button onClick={e => updateLightCount()}>Set Total Ligts</button>
		</div>
		</fieldset>
		<fieldset>
			<legend>Colors</legend>
			<div className="actions">
				<button onClick={saveColors}><FontAwesomeIcon icon={faFloppyDisk} /></button>
				{/*<button onClick={loadColors}><FontAwesomeIcon icon={faUpload} /></button>*/}
			</div>
			<button onClick={addColor}>Add Color</button>
			<ol className="color-list">
				{colors.map((color,idx) => {
					return 	(<li>
						<ColorItem ident={`color:${idx}`} color={color} update={updateColor} remove={removeColor} showDetails={showDetails == `color:${idx}`} setShowDetails={setShowDetails} />
					</li>)
				})
			}
			</ol>
		</fieldset>
		<fieldset>
			<legend>Pattern</legend>
			<div className="actions">
				<button onClick={savePatterns}><FontAwesomeIcon icon={faFloppyDisk} /></button>
				{/*<button onClick={loadPatterns}><FontAwesomeIcon icon={faUpload} /></button>*/}
			</div>
			<PatternList patterns={patterns} setActive={setActivePattern} add={addPattern} activeIdx={activePattern} />
			<div className="form-group">
				<label>Name</label>
				<input type="text" placeholder="Pattern Name" value={currentPattern.name} onChange={e => updateCurrentPattern('name', e.target.value)} />
			</div>
			<div className="form-group">
				<label>Lights per group</label>
				<input type="number" placeholder="lights per color" min="0" value={currentPattern.size} onChange={e => updateCurrentPattern('size', e.target.value)} />
			</div>
			<button onClick={addPatternColor}>Add Color</button>
			<ol className="color-list">
				{currentPattern.colors.map((color,idx) => {
					return 	(<li key={idx}>
						<ColorItem ident={`pattern:${idx}`} color={color} update={updatePatternColor} remove={removePatternColor} showDetails={showDetails == `pattern:${idx}`} setShowDetails={setShowDetails} colors={colors}/>
					</li>)
				})
			}
			</ol>
			<div className="actions">
				<button onClick={setPattern}>Set Pattern</button>
			</div>
		</fieldset>
		<h3><span>Lights!</span></h3>
		<div className="actions">
			<button className={onOffMode?'active':''} onClick={e => quickOff()}>Clear</button>
			<button className={onOffMode?'active':''} onClick={e => allWhite()}>Spotlight</button>
			<button className={onOffMode?'active':''} onClick={e => toggleAll(false)}>All Off</button>
			<button className={onOffMode?'active':''} onClick={e => toggleAll(true)}>All On</button>
			<button className={onOffMode?'active':''} onClick={e => setOnOffMode(!onOffMode)}>Quick On Off Mode</button>
		</div>
		<ol className="light-list">
		{pixels.map((light, lightIdx) => <li><Light key={lightIdx} ident={lightIdx} light={light} update={updateLight} showDetails={showDetails == lightIdx} setShowDetails={setShowDetails} onOffMode={onOffMode} /></li>)}
		</ol>
		<button onClick={sendSpots} >Send</button>
		<ToastContainer />
	</StrictMode>;
}