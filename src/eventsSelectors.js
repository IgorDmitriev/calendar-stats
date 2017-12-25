import _ from 'lodash';
import moment from 'moment';
window.moment = moment;

const mapToListItems = (value, key) => ({ label: key, value: value.length });
const sortItemsDesc = (a, b) => b.value - a.value;
const sortDates = format => (a, b) =>
  moment(a.label, format).unix() - moment(b.label, format).unix();

export const topBySummary = (events, limit = 10) => {
  const groupedBySummary = _.groupBy(events, 'summary');
  const sortedItems = _.map(groupedBySummary, mapToListItems).sort(
    sortItemsDesc,
  );

  return sortedItems.slice(0, limit);
};
export const topByLocation = (events, limit = 10) => {
  const groupedBySummary = _.groupBy(events, 'location');
  delete groupedBySummary['undefined'];
  const sortedItems = _.map(groupedBySummary, mapToListItems).sort(
    sortItemsDesc,
  );

  return sortedItems.slice(0, limit);
};

export const topAttendees = (events, userEmail, limit = 10) =>
  _.map(
    _.groupBy(_.flatten(_.compact(_.map(events, 'attendees'))), 'email'),
    mapToListItems,
  )
    .filter(({ label }) => label !== userEmail)
    .sort(sortItemsDesc)
    .slice(0, limit);

export const countByDate = (events, format) =>
  _.map(
    _.groupBy(events, ({ start: { dateTime } }) =>
      moment(dateTime).format(format),
    ),
    mapToListItems,
  ).sort(sortDates(format));

export const countByDuration = (events, limit = 5) =>
  _.map(
    _.groupBy(events, ({ start, end }) =>
      moment(end.dateTime).diff(start.dateTime, 'minutes'),
    ),
    mapToListItems,
  )
    .sort(sortItemsDesc)
    .slice(0, limit);
