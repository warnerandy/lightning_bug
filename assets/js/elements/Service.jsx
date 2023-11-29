import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons';

export default Service = ({service, inUse, setInUse, load}) => {
	let setService = (ip) => {
		fetch('/api/services/set', {
			method: 'POST',
			body: JSON.stringify({ip: ip}),
			headers: {
		      "Content-Type": "application/json",
		    }
		}).then (resp => {
			setInUse(service.ip)
			load()
		}) 
	}
	return (<li onClick={e => setService(service.ip)}>
		<span>{service.ip}</span>
		<span className={inUse?'active':'inactive'}>
			<FontAwesomeIcon icon={faBolt} className={inUse?'active':'inactive'} />
		</span>
	</li>)
}