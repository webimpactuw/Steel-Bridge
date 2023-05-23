// Load the Google API client library
gapi.load('client', initClient);

function initClient() {
  // Initialize the API client with your client ID and API key
  gapi.client.init({
    'apiKey': 'YOUR_API_KEY',
    'clientId': 'YOUR_CLIENT_ID',
    'scope': 'https://www.googleapis.com/auth/calendar'
  }).then(function() {
    // Authorize access to the Calendar API
    gapi.auth2.getAuthInstance().signIn().then(function() {
      // Get the calendar with the specified ID
      var calendarId = 'CALENDAR_ID_HERE';
      var request = gapi.client.calendar.calendars.get({
        'calendarId': calendarId
      });

      request.execute(function(resp) {
        // Log the calendar's name and description
        console.log('Calendar Name: ' + resp.summary);
        console.log('Description: ' + resp.description);
      });
    });
  });
}
