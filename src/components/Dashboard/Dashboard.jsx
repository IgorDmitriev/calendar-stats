import React, { Component } from 'react';
import PropTypes from 'prop-types';
import List from './List';
import Total from './Total';
import {
	topBySummary,
	topAttendees,
	countByDate,
	topByLocation,
	countByDuration,
	topBySummaryDuration,
	topByAttendeeDuration,
	totalDuration,
	countUniqAttendees,
} from '../../lib/eventsSelectors';
import './Dashboard.css';

class Dashboard extends Component {
	shouldComponentUpdate(nextProps) {
		if (nextProps.events.length === this.props.events.length) {
			return false;
		}

		return true;
	}

	render() {
		const { events } = this.props;

		return (
			<div className="Dashboard">
				<h1>2017 in your calendar</h1>
				<div className="totals">
					<Total label="events" value={events.length} />
					<Total label="minutes" value={totalDuration(events)} />
					<Total label="attendees" value={countUniqAttendees(events)} />
				</div>
				<div className="stats">
					<List title="Popular events" items={topBySummary(events)} />
					<List
						title="Total duration (minutes)"
						items={topBySummaryDuration(events)}
					/>
					<List title="Top by attendees" items={topAttendees(events)} />
					<List
						title="Top by attendees duration"
						items={topByAttendeeDuration(events)}
					/>
					<List
						title="Count By Month"
						items={countByDate(events, 'MMMM')}
					/>
					<List
						title="Count By WeekDay"
						items={countByDate(events, 'dddd')}
					/>
					<List title="Top By Location" items={topByLocation(events)} />
					<List
						title="Top By Duration (minutes)"
						items={countByDuration(events)}
					/>
				</div>
			</div>
		);
	}
}

List.defaultProps = {
	events: [],
};

List.propTypes = {
	events: PropTypes.array,
	email: PropTypes.string,
};

export default Dashboard;
