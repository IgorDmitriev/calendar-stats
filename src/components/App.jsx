import React, { Component } from 'react';
import google from 'googleapis';

import { oauth2Client } from '../lib/googleClient';
import { arrayToObject } from '../lib/helpers';

import Dashboard from './Dashboard';
import Menu from './Menu';

import './App.css';

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accessToken: null,
      events: {},
      calendars: {},
    };

    this.setAccessToken = this.setAccessToken.bind(this);
    this.toggleCalendar = this.toggleCalendar.bind(this);
    this.fetchEvents = this.fetchEvents.bind(this);
    this.fetchEventsForCalendar = this.fetchEventsForCalendar.bind(this);
    this.setCalendarFetchError = this.setCalendarFetchError.bind(this);
  }

  setAccessToken(accessToken) {
    oauth2Client.credentials = {
      access_token: accessToken,
    };

    this.setState({
      accessToken: accessToken,
    });

    this.fetchCalendars();
  }

  fetchCalendars() {
    calendar.calendarList.list({}, (err, response) =>
      this.receiveCalendars(response.items),
    );
  }

  fetchEvents() {
    this.getSelectedCalendarIds().forEach(calendarId =>
      this.fetchEventsForCalendar(calendarId, ''),
    );
  }

  fetchEventsForCalendar(calendarId, nextPageToken) {
    if (nextPageToken === undefined) return;
    console.log(`fetching calendar ${calendarId}`);

    calendar.events.list(
      {
        calendarId,
        timeMin: new Date('2017-1-1').toISOString(),
        timeMax: new Date('2018-1-1').toISOString(),
        showDeleted: false,
        singleEvents: true,
        orderBy: 'startTime',
        pageToken: nextPageToken,
        maxResults: 2500,
      },
      (err, response) => {
        if (err) {
          this.setCalendarFetchError(calendarId);
        } else {
          this.receiveEvents(
            response.items,
            calendarId,
            response.nextPageToken,
          );
        }
      },
    );
  }

  setCalendarFetchError(calendarId) {
    const { calendars } = this.state;
    const calendar = calendars[calendarId];

    this.setState({
      calendars: {
        ...calendars,
        [calendarId]: {
          ...calendar,
          fetchError: true,
        },
      },
    });
  }

  receiveCalendars(calendars) {
    this.setState({ calendars: arrayToObject(calendars) }, this.fetchEvents);
  }

  receiveEvents(newEvents, calendarId, nextPageToken) {
    const { events } = this.state;
    let eventsForCalendar;

    if (events[calendarId] === undefined) {
      eventsForCalendar = newEvents;
    } else {
      eventsForCalendar = [...events[calendarId], ...newEvents];
    }

    this.setState(
      {
        events: {
          ...events,
          [calendarId]: eventsForCalendar,
        },
      },
      () => this.fetchEventsForCalendar(calendarId, nextPageToken),
    );
  }

  getSelectedCalendarIds() {
    const { calendars } = this.state;

    return Object.values(calendars)
      .filter(({ selected }) => selected)
      .map(({ id }) => id);
  }

  getEvents() {
    const { events } = this.state;
    const selectedCalendars = this.getSelectedCalendarIds();
    let selectedEvents = [];

    selectedCalendars.forEach(
      calendarId =>
        (selectedEvents = selectedEvents.concat(events[calendarId] || [])),
    );

    return selectedEvents;
  }

  toggleCalendar(calendarId) {
    console.log('toggle', calendarId);
    const { calendars, events } = this.state;

    this.setState(
      {
        calendars: {
          ...calendars,
          [calendarId]: {
            ...calendars[calendarId],
            selected: !Boolean(calendars[calendarId].selected),
          },
        },
      },
      () => {
        if (events[calendarId] !== undefined) return;

        this.fetchEventsForCalendar(calendarId, '');
      },
    );
  }

  render() {
    window.state = this.state;
    const { calendars } = this.state;

    return (
      <div className="App">
        <Menu
          calendars={Object.values(calendars)}
          selectedCalendars={this.getSelectedCalendarIds()}
          setAccessToken={this.setAccessToken}
          toggleCalendar={this.toggleCalendar}
        />
        <Dashboard events={this.getEvents()} />
      </div>
    );
  }
}

export default App;
