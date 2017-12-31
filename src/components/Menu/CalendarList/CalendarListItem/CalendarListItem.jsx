import React from 'react';
import './CalendarListItem.css';
import ErrorOutlineIcon from 'react-icons/lib/md/error-outline';

const CalendarListItem = ({
  summary,
  id,
  selected,
  backgroundColor,
  onClick,
  fetchError,
}) => (
  <div
    className="CalendarListItem"
    onClick={() => onClick(id)}
    title={fetchError ? 'Error on fetching events for this calendar' : ''}
  >
    {fetchError ? (
      <ErrorOutlineIcon size="17" color="darkgrey" />
    ) : (
      <div
        className="select-box"
        style={{
          backgroundColor: selected ? backgroundColor : 'transparent',
          border: `1px solid ${backgroundColor}`,
        }}
      />
    )}
    <span
      style={{
        color: selected ? '#eee' : '#bfbfbf',
        textDecoration: fetchError ? 'line-through' : 'none',
      }}
    >
      {summary}
    </span>
  </div>
);

export default CalendarListItem;
