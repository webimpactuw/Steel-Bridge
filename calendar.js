
"use strict";
import createClient from 'https://esm.sh/@sanity/client@4.0.0'
import imageUrlBuilder from 'https://esm.sh/@sanity/image-url'

(function() {

  const DISPLAY_AMOUNT_LIMIT = 5;
  const monthsArray = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  window.addEventListener("load", init);

  function init(){
    console.log("hiIIIIIII")
    generateCalender();
    generateEvents();
  }

  function generateCalender() {
    id("calendar").innerHTML = `
      <iframe id=\"open-web-calendar\"
      style=\"background:url(\"https://raw.githubusercontent.com/niccokunzmann/open-web-calendar/master/static/img/loaders/circular-loader.gif\") center center no-repeat;\"
      src=\"https://open-web-calendar.hosted.quelltext.eu/calendar.html?url=https%3A%2F%2Fwww.calendarlabs.com%2Fical-calendar%2Fics%2F46%2FGermany_Holidays.ics&amp;css=.event%2C%20.dhx_cal_tab.active%2C%20.dhx_cal_tab.active%3Ahover%20%7Bbackground-color%3A%20%234b2e83%3B%7D%20.dhx_month_head%2C%20.dhx_cal_tab%2C%20.dhx_cal_today_button%20%7Bcolor%3A%20%234b2e83%3B%7D%20.dhx_cal_tab%2C%20.dhx_cal_tab.active%20%7Bborder-color%3A%20%234b2e83%3B%7D%0A\"
      sandbox=\"allow-scripts allow-same-origin allow-top-navigation\"
      allowTransparency=\"true\" scrolling=\"no\"
      frameborder=\"0\" height=\"600px\" width=\"100%\"></iframe>
    `
  }

  async function generateEvents() {
    let request = 'https://www.googleapis.com/calendar/v3/calendars/igryanle4321@gmail.com/events?key=AIzaSyAkjFYbzEnNHkETPe4xQxEoElwOYZ08y6A'
    let resultFetch = await fetch(request)
      .then(statusCheck)
      .then(res => res.json())
      .catch(handleError);

    let currentAmountDisplayed = 0;
    let currentDate = new Date();
    for (let i = 0; i < resultFetch.items.length && currentAmountDisplayed < DISPLAY_AMOUNT_LIMIT; i++) {
      let currentData = resultFetch.items[i];
      if (currentDate > new Date(currentData.start.dateTime)) continue;  // get rid of all events before current date
      let card = generateCard(currentData);
      id("events").append(card);
      currentAmountDisplayed++;
    }
  }

  function generateCard(eventData) {
    let startString = eventData.start.dateTime;
    let startDate = new Date(startString);
    let day = String(startDate.getDay());
    let month = monthsArray[startDate.getMonth()];
    let hours = startDate.getHours();
    let minutes = String(startDate.getMinutes());

    let endString = eventData.end.dateTime;
    let endDate = new Date(endString);
    let endDay = String(endDate.getDay());
    let endMonth = monthsArray[endDate.getMonth()];
    let endHours = endDate.getHours();
    let endMinutes = String(endDate.getMinutes());

    if (day.length === 1) day = "0" + day;
    if (minutes.length === 1) minutes = "0" + minutes;

    if (endDay.length === 1) endDay = "0" + endDay;
    if (endMinutes.length === 1) endMinutes = "0" + endMinutes;

    let eventName = eventData.summary;

    // convert from 24 to am/pm
    let ampm = hours >= 12 ? "PM" : "AM";
    if (hours === 0) {
      hours = 12;
    } else if (hours > 12) {
      hours = hours - 12;
    }

    let endAmpm = endHours >= 12 ? "PM" : "AM";
    if (endHours === 0) {
      endHours = 12;
    } else if (endHours > 12) {
      endHours = endHours - 12;
    }

    // really good example why to use UI frameworks
    let card = gen("div");
    card.classList.add("card");

    let date = gen("date");
    date.classList.add("date");

    let dayTitle = gen("h3");
    dayTitle.textContent = day;

    let monthTitle = gen("h4");
    monthTitle.textContent = month;

    let event = gen("div");
    event.classList.add("event");

    let eventTitle = gen('h3');
    eventTitle.textContent = eventName;

    let timeTitle = gen('h4');
    if (Number(endDay) === Number(day)) {
      let timeString = hours + ":" + minutes +  " " + ampm + " - " + endHours + ":"+ endMinutes + " " + ampm;
      timeTitle.textContent = timeString;
    } else {
      let timeString = (Number(endDay) - Number(day)) + " Days";
      timeTitle.textContent = timeString;
    }

    card.append(date);
    card.append(event);
    date.append(dayTitle);
    date.append(monthTitle);
    event.append(eventTitle);
    event.append(timeTitle);
    return card;
  }

  /**
   * Return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} response - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   *                    Promise result
   */
  async function statusCheck(response) {
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response;
  }


  function handleError() {
    console.log("error occurred with API call");
  }

  /**
   * Specify the image to be rendered. Accepts either a Sanity image record, an asset record, or just
   * the asset id as a string. In order for hotspot/crop processing to be applied, the image record
   * must be supplied, as well as both width and height.
   */
  function urlFor(source) {
    return builder.image(source)
  }


  /** ------------------------------ Helper Functions  ------------------------------ */
  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} The first DOM object matching the query.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} selector - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Returns a new element with the given tag name.
   * @param {string} tagName - HTML tag name for new DOM element.
   * @returns {object} New DOM object for given HTML tag.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

  /**
   * Clears all the event listeners for the element given.
   * @param {HTMLElement} element - any HTMLElement
   */
  function clearAllEventListeners(element) {
    let oldElement = element;
    let newElement = oldElement.cloneNode(true);
    oldElement.parentNode.replaceChild(newElement, oldElement);
  }

})();