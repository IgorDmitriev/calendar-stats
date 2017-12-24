import _ from 'lodash';

const mapToListItems = (value, key) => ({ label: key, value: value.length });
const sortItemsDesc = (a, b) => b.value - a.value;

export const topBySummary = (events, limit = 10) => {
  const groupedBySummary = _.groupBy(events, 'summary');
  const sortedItems = _.map(groupedBySummary, mapToListItems).sort(
    sortItemsDesc,
  );

  return sortedItems.slice(0, limit - 1);
};

export const topAttendees = (events, userEmail, limit = 10) =>
  _.map(
    _.groupBy(_.flatten(_.compact(_.map(events, 'attendees'))), 'email'),
    mapToListItems,
  )
    .filter(({ label }) => label !== userEmail)
    .sort(sortItemsDesc)
    .slice(0, limit - 1);
