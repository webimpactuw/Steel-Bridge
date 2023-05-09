
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

    client = createClient({
      projectId: PROJECT_ID,
      dataset: DATASET,
      useCdn: false, // set to `true` to fetch from edge cache
      apiVersion: '2023-03-01', // use current date (YYYY-MM-DD) to target the latest API version
    });

    let fullPage = id("fullpage");
    let images = qsa("#gallery img");

    id("full-pic").addEventListener("click", function (event) {
      if (event.target == this) {
        id("full-pic").style.display = "none";
      }
    });

    id("x").addEventListener("click", function (event) {
      id("full-pic").style.display = "none";
    });

    images.forEach((img) => {
      img.addEventListener('click', function() {
        displayImage(this);
      });
    });
  }


  function displayImage(element) {
    id("full-pic").style.display = "flex";
    let fullImage = id("full-image");
    fullImage.src = element.src;
    let arrows = qsa(".image-arrow");
    arrows.forEach(function(arrow) { clearAllEventListeners(arrow); });
    arrows = qsa(".image-arrow");

    let previousImage = element.previousElementSibling;
    let nextImage = element.nextElementSibling;

    if (previousImage) {
      arrows[0].addEventListener('click', function() {displayImage(previousImage);});
      arrows[0].classList.remove("dim");
      arrows[0].style.cursor = "pointer";
    } else {
      arrows[0].classList.add("dim");
      arrows[0].style.cursor = "";

    }

    if (nextImage) {
      arrows[1].addEventListener('click', function() {displayImage(nextImage);});
      arrows[1].classList.remove("dim");
      arrows[1].style.cursor = "pointer";
    } else {
      arrows[1].classList.add("dim");
      arrows[1].style.cursor = "initial";
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