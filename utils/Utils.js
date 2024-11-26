function getFranceTimezone(date) {
  const options = {timeZone: 'Europe/Paris', timeZoneName: 'short'};
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const parts = formatter.formatToParts(date);
  const timezonePart = parts.find(part => part.type === 'timeZoneName');
  return timezonePart ? timezonePart.value : 'UTC';
}
