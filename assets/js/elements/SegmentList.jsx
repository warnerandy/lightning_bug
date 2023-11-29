import React, {Fragment} from 'react';
import LightSegment from './LightSegment';

export default SegmentList = ({segments, update}) => {
	const segs = segments || [];
	return (
		<Fragment>
			<ol className="segment-list">
				{segs.map((segment, index) => <LightSegment key={index} idx={index} segment={segment} update={update} />)}
			</ol>
		</Fragment>)
}