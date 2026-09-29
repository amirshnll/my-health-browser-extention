/* Local-only reminder worker: no network APIs or host permissions are used. */
chrome.alarms.onAlarm.addListener((alarm) => {
  if (!alarm.name.startsWith('medicine:')) return;
  chrome.notifications.create(alarm.name, { type: 'basic', iconUrl: 'icons/icon-128.png', title: 'یادآوری دارو', message: alarm.name.slice(9) });
});
