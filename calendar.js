
"use strict";
import createClient from 'https://esm.sh/@sanity/client@4.0.0'
import imageUrlBuilder from 'https://esm.sh/@sanity/image-url'

(function() {

  const DISPLAY_AMOUNT_LIMIT = 4;
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
    generateEvents();
    getJoinUsLink();
  }

  async function getJoinUsLink() {
    let request = 'https://l6dam5td.apicdn.sanity.io/v2021-10-21/data/query/production?query=*%5B_type%3D%3D%22join%22%5D';
    let resultFetch = await fetch(request)
      .then(statusCheck)
      .then(res => res.json())
      .catch(handleError);

    let link = resultFetch.result[0].link;
    let navLinks = qsa("#header div ul li a");

    // should be the last element, but doing this incase the ordering changes
    let joinUsElement;
    for (let i = navLinks.length - 1; i >= 0; i--) {
      if (navLinks[i].textContent === "Join Us") {
        joinUsElement = navLinks[i];
        break;
      }
    }

    joinUsElement.href = link;
  }

  function generateCalender(calendarLink) {

    // id("calendar").innerHTML = `
    // <iframe id="open-web-calendar"
    // style="background:url('https://raw.githubusercontent.com/niccokunzmann/open-web-calendar/master/static/img/loaders/circular-loader.gif') center center no-repeat;"
    // src="https://open-web-calendar.hosted.quelltext.eu/calendar.html?url=https%3A%2F%2Fcalendar.google.com%2Fcalendar%2Fical%2Figryanle4321%2540gmail.com%2Fpublic%2Fbasic.ics&amp;css=.dhx_scale_holder_now%2C%20.dhx_now%20.dhx_month_head%2C%20.dhx_now%20.dhx_month_body%20%7B%20background-color%3A%20%234b2e83%3B%7D%0A.event%20%7B%0Acolor%3A%20white%3B%0A%7D"
    // sandbox="allow-scripts allow-same-origin allow-top-navigation"
    // allowTransparency="true" scrolling="no"
    // frameborder="0" height="600px" width="100%"></iframe>
    // `

    //https://outlook.office365.com/owa/calendar/d45ad64e0ac441d6a6d09a6ae5e12957@uw.edu/833dfe655e6442f7bb12c1f8da2aa877556960875527581770/calendar.ics

    console.log(`https://open-web-calendar.hosted.quelltext.eu/calendar.html?url=https%3A%2F%2Fcalendar.google.com%2Fcalendar%2Fical%2Figryanle4321%2540gmail.com%2Fpublic%2Fbasic.ics&amp;css=.dhx_scale_holder_now%2C%20.dhx_now%20.dhx_month_head%2C%20.dhx_now%20.dhx_month_body%20%7B%20background-color%3A%20%234b2e83%3B%7D%0A.event%20%7B%0Acolor%3A%20white%3B%0A%7D`);
    encodeURI()

    console.log(calendarLink);
    let calendarIFrame = gen('iframe');
    calendarIFrame.style = "border: 0; background:url('https://raw.githubusercontent.com/niccokunzmann/open-web-calendar/master/static/img/loaders/circular-loader.gif') center center no-repeat;";
    calendarIFrame.src = "https://open-web-calendar.hosted.quelltext.eu/calendar.html?url=" + encodeURIComponent(calendarLink) + "&amp;css=.event%2C%20.dhx_cal_tab.active%2C%20.dhx_cal_tab.active%3Ahover%20%7Bbackground-color%3A%20%234b2e83%3B%7D%20.dhx_month_head%2C%20.dhx_cal_tab%2C%20.dhx_cal_today_button%20%7Bcolor%3A%20%234b2e83%3B%7D%20.dhx_cal_tab%2C%20.dhx_cal_tab.active%20%7Bborder-color%3A%20%234b2e83%3B%7D%0A"
    calendarIFrame.sandbox = "allow-scripts allow-same-origin allow-top-navigation";
    calendarIFrame.allowTransparency = "true";
    calendarIFrame.scrolling = "no";
    calendarIFrame.frameborder = "0";
    calendarIFrame.height = "600px";
    calendarIFrame.width = "100%"

    id("calendar").append(calendarIFrame);
  }

  // from open web calendar,
  function getCalendarUrl(specification) {
    var url = DEFAULT_URL + CALENDAR_ENDPOINT + "?";
    var parameters = [];
    getOwnProperties(specification).forEach(function(property) {
        (Array.isArray(specification[property]) ? specification[property].length ? specification[property] : [""] : [specification[property]]
        ).forEach(function(url){
            parameters.push(encodeURIComponent(property) + "=" + encodeURIComponent("" + url))
        });
    });
    return url + parameters.join("&");
  }

  async function generateEvents() {

    let sanityRequest = 'https://l6dam5td.apicdn.sanity.io/v2021-10-21/data/query/production?query=*%5B_type%3D%3D%22calendar%22%5D'
    let sanityResult = await fetch(sanityRequest)
      .then(statusCheck)
      .then(res => res.json())
      .catch(handleError);

    let calendarLink = sanityResult.result[0].link;

    generateCalender(calendarLink);

    let resultFetch = await fetch(calendarLink)
      .then(statusCheck)
      .then(res => res.text())
      .catch(handleError);

    let calendarData = ICAL.parse(resultFetch);
    let vcalendar = new ICAL.Component(calendarData);
    let vevent = vcalendar.getAllSubcomponents('vevent').reverse();

    let currentAmountDisplayed = 0;
    let currentDate = new Date();
    for (let i = 0; i < vevent.length && currentAmountDisplayed < DISPLAY_AMOUNT_LIMIT; i++) {
      let event = new ICAL.Event(vevent[i]);
      if (currentDate > new Date(event.startDate.toString())) continue;  // get rid of all events before current date
      let card = generateCard(event);
      id("events").append(card);
      currentAmountDisplayed++;
    }

    if (currentAmountDisplayed === 0) {
      let title = gen("h3");
      title.textContent = "No events yet!";
      id("events").append(card);
    }

  }

  function generateCard(eventData) {
    let startString = eventData.startDate.toString();
    let startDate = new Date(startString);
    let day = String(startDate.getDate());
    let month = monthsArray[startDate.getMonth()];
    let hours = startDate.getHours();
    let minutes = String(startDate.getMinutes());

    let endString = eventData.endDate.toString();
    let endDate = new Date(endString);
    let endDay = String(endDate.getDate());
    let endMonth = monthsArray[endDate.getMonth()];
    let endHours = endDate.getHours();
    let endMinutes = String(endDate.getMinutes());

    if (day.length === 1) day = "0" + day;
    if (minutes.length === 1) minutes = "0" + minutes;

    if (endDay.length === 1) endDay = "0" + endDay;
    if (endMinutes.length === 1) endMinutes = "0" + endMinutes;

    let eventName = eventData.summary;
    console.log(eventName);

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
      let timeString = hours + ":" + minutes +  " " + ampm + " - " + endHours + ":"+ endMinutes + " " + endAmpm;
      timeTitle.textContent = timeString;
    } else {
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      let timeString = "Duration: " + (diffDays) + " Days";
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


  function handleError(error) {
    console.log("error occurred with API call");
    console.error(error);
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