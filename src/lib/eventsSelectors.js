import _ from 'lodash';
import moment from 'moment';

const getValue = value => (_.isArray(value) ? value.length : value);

const mapObjectToListItems = (value, key) => ({
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

    event.attendees.forEach(({ email }) => attendeesEmails.add(email));
  });

  return attendeesEmails.size;
};

export const topBySummary = (events, limit = 10) => {
  const groupedBySummary = _.groupBy(events, 'summary');
  const sortedItems = _.map(groupedBySummary, mapObjectToListItems).sort(
    sortItemsDesc,
  );

  return sortedItems.slice(0, limit);
};

export const topBySummaryDuration = (events, limit = 10) =>
  _.map(_.groupBy(events, 'summary'), (groupedEvents, summary) => ({
    label: summary,
    value: _.sumBy(groupedEvents, getEventDuration),
  }))
    .sort(sortItemsDesc)
    .slice(0, limit);

export const topByLocation = (events, limit = 10) => {
  const groupedBySummary = _.groupBy(events, 'location');
  delete groupedBySummary['undefined'];
  const sortedItems = _.map(groupedBySummary, mapObjectToListItems).sort(
    sortItemsDesc,
  );

  return sortedItems.slice(0, limit);
};

export const topAttendees = (events, userEmail, limit = 10) =>
  _.map(
    _.groupBy(_.flatten(_.compact(_.map(events, 'attendees'))), 'email'),
    mapObjectToListItems,
  )
    .filter(({ label }) => label !== userEmail)
    .sort(sortItemsDesc)
    .slice(0, limit);

export const topByAttendeeDuration = (events, userEmail, limit = 10) => {
  const attendeesDuration = {};

  events.forEach(event => {
    if (event.attendees === undefined) return;
    const eventDuration = getEventDuration(event);

    event.attendees.forEach(({ email }) => {
      if (email === userEmail) return;

      if (attendeesDuration[email] === undefined) {
        attendeesDuration[email] = eventDuration;
      } else {
        attendeesDuration[email] += eventDuration;
      }
    });
  });

  return _.map(attendeesDuration, mapObjectToListItems)
    .sort(sortItemsDesc)
    .slice(0, limit);
};

export const countByDate = (events, format) =>
  _.map(
    _.groupBy(events, ({ start: { dateTime } }) =>
      moment(dateTime).format(format),
    ),
    mapObjectToListItems,
  ).sort(sortDates(format));

export const countByDuration = (events, limit = 5) =>
  _.map(_.groupBy(events, getEventDuration), mapObjectToListItems)
    .sort(sortItemsDesc)
    .slice(0, limit);
