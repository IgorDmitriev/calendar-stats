import React, { Component } from 'react';
import './App.css';
import GoogleLogin from 'react-google-login';
import google from 'googleapis';

const CLIENT_ID =
  '1034471881815-lv7d5vaepq8a1eujbbfo831r6a8dgqbc.apps.googleusercontent.com';
const CLIENT_SECRET = 'SEUtiszUqO_3PI4XQVp6wKoc';
const REDIRECT_URL = 'http://localhost:3000';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

const stateIsChanged = (prevState, state, key, value) => {
  const isChanged = prevState[key] !== state[key];
  if (value === undefined) return isChanged;

  return state[key] === value;
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      calendars: [],
    };
  }

  onLoginSuccess({ accessToken, profileObj }) {
    console.log(oauth2Client);
    oauth2Client.credentials = {
      access_token: accessToken,
    };
    console.log(oauth2Client);

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
    console.log(this.state);
    window.state = this.state;
    return (
      <div className="App">
        <GoogleLogin
          clientId={CLIENT_ID}
          scope={SCOPES}
          buttonText="Login"
          onSuccess={response => this.onLoginSuccess(response)}
          offline={false}
          approvalPrompt="force"
        />
        <h3>{this.state.events.length}</h3>
      </div>
    );
  }
}

export default App;
