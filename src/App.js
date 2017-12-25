import React, { Component } from 'react';
import 'normalize.css';
import './App.css';
import GoogleLogin from 'react-google-login';
import google from 'googleapis';
import _ from 'lodash';
import List from './List';
import {
  topBySummary,
  topAttendees,
  countByDate,
  topByLocation,
  countByDuration,
} from './eventsSelectors';

const CLIENT_ID =
  '1034471881815-lv7d5vaepq8a1eujbbfo831r6a8dgqbc.apps.googleusercontent.com';
const CLIENT_SECRET = 'SEUtiszUqO_3PI4XQVp6wKoc';
const REDIRECT_URL = 'http://localhost:3000';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      calendars: [],
      profile: {},
    };
  }

  onLoginSuccess({ accessToken, profileObj }) {
    oauth2Client.credentials = {
      access_token: accessToken,
    };

    this.setState({
      accessToken: accessToken,
      profile: profileObj,
    });

    // this.getCalendars();
    this.getCalendarEvents('primary');
  }

  getCalendars() {
    calendar.calendarList.list({}, (err, response) =>
      this.setState({ calendars: response.items }),
    );
  }

  getCalendarEvents(calendarId, nextPageToken) {
    console.log('fetching calendar');
    const { events } = this.state;

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
        this.setState({ events: [...events, ...response.items] }, () => {
          if (response.nextPageToken === undefined) return;
          this.getCalendarEvents(calendarId, response.nextPageToken);
        });
      },
    );
  }

  render() {
    window.state = this.state;
    const { events, profile: { email } } = this.state;
    console.log(topBySummary(events));

    return (
      <div className="App">
        <h1>2017 in your calendar</h1>
        {email === undefined && (
          <GoogleLogin
            clientId={CLIENT_ID}
            scope={SCOPES}
            buttonText="Connect google calendar"
            onSuccess={response => this.onLoginSuccess(response)}
            offline={false}
            approvalPrompt="force"
          />
        )}
        <h3>{email && `${email}: ${events.length} events`}</h3>
        <section className="stats">
          <List title="Popular events" items={topBySummary(events)} />
          <List
            title="Top meeting participants"
            items={topAttendees(events, email)}
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

export default App;
