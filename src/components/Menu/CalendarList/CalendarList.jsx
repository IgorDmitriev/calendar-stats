import React from 'react';
import PropTypes from 'prop-types';
import CalendarListItem from './CalendarListItem';

const CalendarList = ({ calendars }) => (
  <div className="CalendarList">
    {calendars.map(calendar => <CalendarListItem {...calendar} />)}
  </div>
);

CalendarList.defaultProps = {
  calendars: [],
};

CalendarList.propTypes = {
  calendars: PropTypes.array,
};

export default CalendarList;
