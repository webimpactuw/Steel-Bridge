
"use strict";
import {createClient} from 'https://esm.sh/@sanity/client'
import imageUrlBuilder from 'https://esm.sh/@sanity/image-url'

(function() {

  let client;
  let builder;

  const DATASET = "production";
  const PROJECT_ID = "l6dam5td";

  /**
   * Add a function that will be called when the window is loaded.
   */
  window.addEventListener("load", init);

  /**
   * CHANGE: Describe what your init function does here.
   */
  async function init() {

    // console.log("HELLOOOOOO");
    client = createClient({
      projectId: PROJECT_ID,
      dataset: DATASET,
      useCdn: false, // set to `true` to fetch from edge cache
      apiVersion: '2023-03-01', // use current date (YYYY-MM-DD) to target the latest API version
    });

    builder = imageUrlBuilder(client);

    generateSponsors();
  }


  async function generateSponsors() {

    // query
    let request = 'https://l6dam5td.apicdn.sanity.io/v2021-10-21/data/query/production?query=*%5B_type%3D%3D%22company%22%20%7C%7C%20_type%3D%3D%22individual%22%5D'
    let resultFetch = await fetch(request)
      .then(statusCheck)
      .then(res => res.json())
      .catch(handleError);

    let companyElement = id("company_boxes");
    let individualElement = id("individuals");

    companyElement.innerHTML = "";
    individualElement.innerHTML = "";
    for (let i = 0; i < resultFetch.result.length; i++) {
      let currentData = resultFetch.result[i];
      let type = currentData._type;

      if (type == "company") {
        let imageElement = gen("img");
        imageElement.src = urlFor(currentData.image);
        imageElement.alt = currentData.name;
        companyElement.append(imageElement);
      } else if (type == "individual") {
        let h3Element = gen("h3");
        h3Element.textContent = currentData.name;
        individualElement.append(h3Element);
      }
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

})();