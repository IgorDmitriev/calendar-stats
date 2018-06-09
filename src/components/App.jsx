import React, { Component } from 'react';
import { arrayToObject } from '../lib/helpers';

import Dashboard from './Dashboard';
import Menu from './Menu';

import './App.css';

class App extends Component {
	state = {
		accessToken: null,
		events: {},
		calendars: {},
	};

	setAccessToken = accessToken => {
		this.setState({
			accessToken: accessToken,
		});

		this.fetchCalendars();
	};

	fetchCalendars = () => {
		window.gapi.client
			.request({
				path:
					'https://www.googleapis.com/calendar/v3/users/me/calendarList',
			})
			.then(response => this.receiveCalendars(response.result.items));
	};

	fetchEvents = () => {
		this.getSelectedCalendarIds().forEach(calendarId =>
			this.fetchEventsForCalendar(calendarId, ''),
		);
	};

	fetchEventsForCalendar = (calendarId, nextPageToken) => {
		if (nextPageToken === undefined) return;

		window.gapi.client
			.request({
				path: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
				params: {
					calendarId,
					timeMin: new Date('2017-1-1').toISOString(),
					timeMax: new Date('2018-1-1').toISOString(),
					showDeleted: false,
					singleEvents: true,
					orderBy: 'startTime',
					pageToken: nextPageToken,
					maxResults: 2500,
				},
			})
			.then(({ result: { items, nextPageToken } }) => {
				this.receiveEvents(items, calendarId, nextPageToken);
			})
			.catch(response => {
				console.error(`${calendarId}:`, response);
				this.setCalendarFetchError(calendarId);
			});
	};

	setCalendarFetchError = calendarId => {
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
	};

	receiveCalendars = calendars => {
		this.setState(
			{ calendars: arrayToObject(calendars) },
			this.fetchEvents,
		);
	};

	receiveEvents = (newEvents, calendarId, nextPageToken) => {
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
	};

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
				(selectedEvents = selectedEvents.concat(
					events[calendarId] || [],
				)),
		);

		return selectedEvents;
	}

	toggleCalendar = calendarId => {
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
	};

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
