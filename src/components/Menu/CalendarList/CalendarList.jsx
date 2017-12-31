import React from 'react';
import PropTypes from 'prop-types';
import CalendarListItem from './CalendarListItem';
import './CalendarList.css';

const CalendarList = ({ calendars, onCalendarListItemClick }) => (
	<div className="CalendarList">
		<header>Calendars</header>
		{calendars.map(calendar => (
			<CalendarListItem
				{...calendar}
				key={calendar.id}
				onClick={onCalendarListItemClick}
			/>
		))}
	</div>
);

CalendarList.defaultProps = {
	calendars: [],
};

CalendarList.propTypes = {
	calendars: PropTypes.array,
	onCalendarListItemClick: PropTypes.func,
};

export default CalendarList;
