
"use strict";

(function() {

  /**
   * Add a function that will be called when the window is loaded.
   */
  window.addEventListener("load", init);

  /**
   * CHANGE: Describe what your init function does here.
   */
  async function init() {
    generateAward();
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


  async function generateAward() {

    // query
    let request = 'https://l6dam5td.apicdn.sanity.io/v2021-10-21/data/query/production?query=*%5B_type%3D%3D%22achievements%22%5D'
    let resultFetch = await fetch(request)
      .then(statusCheck)
      .then(res => res.json())
      .catch(handleError);

    let list = id("award-list")
    list.innerHTML = "";
    for (let i = 0; i < resultFetch.result.length; i++) {
      let currentData = resultFetch.result[i];
      let listItem = gen("li");
      listItem.textContent = currentData.award + ", " + currentData.location + ", " + currentData.year;
      list.append(listItem);
    }

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

})();