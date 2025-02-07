"use strict";

import { createClient } from "https://esm.sh/@sanity/client";
import imageUrlBuilder from "https://esm.sh/@sanity/image-url";

(function () {
  let client;
  let builder;

  const DATASET = "production";
  const PROJECT_ID = "6t93n5tw";

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
      useCdn: true, // set to `true` to fetch from edge cache
      apiVersion: "2023-03-01", // use current date (YYYY-MM-DD) to target the latest API version
    });

    builder = imageUrlBuilder(client);
    getNewsletterLink();
    setNavToggle();
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

  async function getNewsletterLink() {
    let request =
      "https://6t93n5tw.apicdn.sanity.io/v2021-10-21/data/query/production?query=*%5B_type%3D%3D%22join%22%5D";
    let resultFetch = await fetch(request)
      .then(statusCheck)
      .then((res) => res.json())
      .catch(handleError);

    let link = resultFetch.result[0].link;
    let navLinks = qsa("#navbar ul li a");

    // should be the last element, but doing this incase the ordering changes
    let joinUsElement;
    for (let i = navLinks.length - 1; i >= 0; i--) {
      if (navLinks[i].textContent === "Newsletter") {
        joinUsElement = navLinks[i];
        break;
      }
    }

    joinUsElement.href = link;
  }

  function setNavToggle() {
    let toggle = document.getElementById("mobile-toggle");
    let nav = document.getElementById("mobile-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        nav.style.display = nav.style.display === "none" ? "flex" : "none";
      });
    }
  }

  async function getHeaderImage() {
    let request =
      "https%3A%2F%2F6t93n5tw.apicdn.sanity.io%2Fv2021-10-21%2Fdata%2Fquery%2Fproduction%3Fquery%3D%2A%5B_type%3D%3D%22headerImage%22%5D";
    let resultFetch = await fetch(request)
      .then(statusCheck)
      .then((res) => res.json())
      .catch(handleError);

    // let link = resultFetch.result[0].link;
    // let navLinks = qsa("#header div ul li a");

    // // should be the last element, but doing this incase the ordering changes
    // let joinUsElement;
    // for (let i = navLinks.length - 1; i >= 0; i--) {
    //   if (navLinks[i].textContent === "Join Us") {
    //     joinUsElement = navLinks[i];
    //     break;
    //   }
    // }

    // joinUsElement.href = link;
  }
})();

/** ------------------------------ Helper Functions  ------------------------------ */
/**
 * Returns the element that has the ID attribute with the specified value.
 * @param {string} idName - element ID
 * @returns {object} DOM object associated with id.
 */
export function id(idName) {
  return document.getElementById(idName);
}

/**
 * Returns the first element that matches the given CSS selector.
 * @param {string} selector - CSS query selector.
 * @returns {object} The first DOM object matching the query.
 */
export function qs(selector) {
  return document.querySelector(selector);
}

/**
 * Returns the array of elements that match the given CSS selector.
 * @param {string} selector - CSS query selector
 * @returns {object[]} array of DOM objects matching the query.
 */
export function qsa(selector) {
  return document.querySelectorAll(selector);
}

/**
 * Returns a new element with the given tag name.
 * @param {string} tagName - HTML tag name for new DOM element.
 * @returns {object} New DOM object for given HTML tag.
 */
export function gen(tagName) {
  return document.createElement(tagName);
}

/**
 * Specify the image to be rendered. Accepts either a Sanity image record, an asset record, or just
 * the asset id as a string. In order for hotspot/crop processing to be applied, the image record
 * must be supplied, as well as both width and height.
 */
export function urlFor(builder, source) {
  return builder.image(source);
}

export async function statusCheck(response) {
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response;
}

export function handleError() {
  console.log("error occurred with API call");
}
