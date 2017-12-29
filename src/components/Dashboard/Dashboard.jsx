import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import List from './List';
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

class Dashboard extends PureComponent {
  render() {
    const { email, events } = this.props;

    return (
      <div className="Dashboard">
        <h3>
          {email &&
            `${email}: ${events.length} events, ${totalDuration(
              events,
            )} total duration, ${countUniqAttendees(events)} uniq attendees`}
        </h3>
        <section className="stats">
          <List title="Popular events" items={topBySummary(events)} />
          <List title="Total duration" items={topBySummaryDuration(events)} />
          <List title="Top by attendees" items={topAttendees(events, email)} />
          <List
            title="Top by attendees duration"
            items={topByAttendeeDuration(events, email)}
          />
          <List title="Count By Month" items={countByDate(events, 'MMMM')} />
          <List title="Count By WeekDay" items={countByDate(events, 'dddd')} />
          <List title="Top By Location" items={topByLocation(events)} />
          <List title="Top By Duration" items={countByDuration(events)} />
        </section>
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
