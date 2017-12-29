import React, { Component } from 'react';
import google from 'googleapis';
import flatten from 'lodash/flatten';

import { oauth2Client } from '../lib/googleClient';

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
      calendars: [],
    };

    this.setAccessToken = this.setAccessToken.bind(this);
    this.toggleCalendar = this.toggleCalendar.bind(this);
    this.fetchEvents = this.fetchEvents.bind(this);
    this.fetchEventsForCalendar = this.fetchEventsForCalendar.bind(this);
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
    console.log(this.getSelectedCalendarIds());
    this.getSelectedCalendarIds().forEach(calendarId =>
      this.fetchEventsForCalendar(calendarId, ''),
    );
  }

  fetchEventsForCalendar(calendarId, nextPageToken) {
    console.log(`fetching calendar ${calendarId}`);

    if (nextPageToken === undefined) return;

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
        console.log(err, response);
        this.receiveEvents(response.items, calendarId, response.nextPageToken);
      },
    );
  }

  receiveCalendars(calendars) {
    this.setState({ calendars }, this.fetchEvents);
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
    return calendars.filter(({ selected }) => selected).map(({ id }) => id);
  }

  getEvents() {
    const { events } = this.state;
    return flatten(Object.values(events));
  }

  toggleCalendar() {
    return null;
  }

  render() {
    window.state = this.state;
    const { calendars } = this.state;

    return (
      <div className="App">
        <h1>2017 in your calendar</h1>
        <Menu
          calendars={calendars}
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
