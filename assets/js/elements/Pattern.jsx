import React, {Fragment} from 'react';

import { faXmark as close, faBan, faUpload, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default PatternList = ({patterns, setActive, add, activeIdx}) => {
	return (<Fragment>
		<button onClick={e=> add()}>Add New</button>
		<ol className="pattern-list">
			{patterns.map((pattern, idx) => <li key={idx} className={activeIdx == idx? 'active removable-item':'removable-item'} onClick={e => setActive(idx)}><div>{pattern.name}</div><button><FontAwesomeIcon icon={close} /></button></li>)}
		</ol>
	</Fragment>);
}