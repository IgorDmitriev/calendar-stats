import _ from 'lodash';
import moment from 'moment';

const getValue = value => (_.isArray(value) ? value.length : value);

const objectToListItem = (value, key) => ({
	label: key,
	value: getValue(value),
});

const sortItemsDesc = (a, b) => b.value - a.value;

const sortDates = format => (a, b) =>
	moment(a.label, format).unix() - moment(b.label, format).unix();

const getEventDuration = ({ start, end }) =>
	moment(end.dateTime).diff(start.dateTime, 'minutes');

export const totalDuration = (events = []) =>
	events.reduce((acc, event) => acc + getEventDuration(event), 0);

export const countUniqAttendees = (events = []) => {
	const attendeesEmails = new Set();

	events.forEach(event => {
		if (event.attendees === undefined) return;

		event.attendees.forEach(({ email, self }) => {
			if (self === undefined) attendeesEmails.add(email);
		});
	});

	return attendeesEmails.size;
};

export const topBySummary = (events, limit = 10) => {
	const groupedBySummary = _.groupBy(
		events,
		({ summary }) => summary || 'Private/Busy',
	);
	const sortedItems = _.map(groupedBySummary, objectToListItem).sort(
		sortItemsDesc,
	);

	return sortedItems.slice(0, limit);
};

export const topBySummaryDuration = (events, limit = 10) =>
	_.map(
		_.groupBy(events, ({ summary }) => summary || 'Private/Busy'),
		(groupedEvents, summary) => ({
			label: summary,
			value: _.sumBy(groupedEvents, getEventDuration),
		}),
	)
		.sort(sortItemsDesc)
		.slice(0, limit);

export const topByLocation = (events, limit = 10) => {
	const eventsWithLocation = events.filter(({ location }) =>
		Boolean(location),
	);
	const groupedByLocation = _.groupBy(eventsWithLocation, 'location');

	return _.map(groupedByLocation, objectToListItem)
		.sort(sortItemsDesc)
		.slice(0, limit);
};

export const topAttendees = (events, limit = 10) => {
	const attendeesCount = {};

	events.forEach(({ attendees }) => {
		if (attendees === undefined) return;

		attendees.forEach(({ email, self }) => {
			if (self) return;

			if (attendeesCount[email]) {
				attendeesCount[email] += 1;
			} else {
				attendeesCount[email] = 1;
			}
		});
	});

	return _.map(attendeesCount, objectToListItem)
		.sort(sortItemsDesc)
		.slice(0, limit);
};

export const topByAttendeeDuration = (events, limit = 10) => {
	const attendeesDuration = {};

	events.forEach(event => {
		if (event.attendees === undefined) return;

		const eventDuration = getEventDuration(event);

		event.attendees.forEach(({ email, self }) => {
			if (self) return;

			if (attendeesDuration[email] === undefined) {
				attendeesDuration[email] = eventDuration;
			} else {
				attendeesDuration[email] += eventDuration;
			}
		});
	});

	return _.map(attendeesDuration, objectToListItem)
		.sort(sortItemsDesc)
		.slice(0, limit);
};

export const countByDate = (events, format) =>
	_.map(
		_.groupBy(events, ({ start: { dateTime } }) =>
			moment(dateTime).format(format),
		),
		objectToListItem,
	).sort(sortDates(format));

export const countByDuration = (events, limit = 10) =>
	_.map(_.groupBy(events, getEventDuration), objectToListItem)
		.sort(sortItemsDesc)
		.slice(0, limit);
