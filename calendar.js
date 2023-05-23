
"use strict";

(function(){
  window.addEventListener("load", init);
  async function init(){
    generateEvents();
  }
async function generateEvents() {
  let request = 'https://www.googleapis.com/calendar/v3/calendars/{calendarid}/events?key={Your Public API Key}'
  let resultFetch = await fetch(request)
    .then(statusCheck)
    .then(res => res.json())
    .catch(handleError);

  for (let i = 0; i < resultFetch.result.length; i++) {
    /*
    Include the calendar json file inputs here
    */
  }
}
})