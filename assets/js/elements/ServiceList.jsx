import React, {useEffect, useState} from 'react';
import Service from './Service';

export default ServiceList = (props) => {
	const [inUse, setInUse] = useState();
	const [services, setServices] = useState([]);
	useEffect(() => {
		fetch('/api/services').then (response => response.json())
		.then(json => setServices(json.data))
	},[])
	return (
		<div>
			<h3>Services</h3>
			<ol className="service-list">
			{services.map( (service, idx) => <Service key="idx" load={props.load} service={service} inUse={inUse == service.ip} setInUse={setInUse} />)}
			</ol>
		</div>)
}