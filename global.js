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
    getStoreLink();
    setNavToggle();
    let path = window.location.href.split("/").slice(-1)[0].slice(0, -5);
    getHeaderImage(path);
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

  async function getHeaderImage(path) {
    if (!path || path === "officers" || path === "index") {
      return;
    }
    let request = `https://6t93n5tw.api.sanity.io/v2021-10-21/data/query/production?query=*%5B_type%3D%3D%22headerImage%22%26%26path%3D%3D%22${path}%22%5D`;
    let resultFetch = await fetch(request)
      .then(statusCheck)
      .then((res) => res.json())
      .catch(handleError);
    let imageUrl = builder.image(resultFetch.result[0].image).width(1920).url();
    let styleString =
      "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(" +
      imageUrl +
      ")";
    id("title-container").style["background-image"] = styleString;
  }

  async function getNewsletterLink() {
    let request =
      "https://6t93n5tw.apicdn.sanity.io/v2021-10-21/data/query/production?query=*%5B_type%3D%3D%22join%22%5D";
    let resultFetch = await fetch(request)
      .then(statusCheck)
      .then((res) => res.json())
      .catch(handleError);

    let link = resultFetch.result[0].link;
    qsa(".link-newsletter").forEach((e) => {
      e.href = link;
    });
  }

  async function getStoreLink() {
    let request =
      "https://6t93n5tw.apicdn.sanity.io/v2021-10-21/data/query/production?query=*%5B_type%3D%3D%22store%22%5D";
    let resultFetch = await fetch(request)
      .then(statusCheck)
      .then((res) => res.json())
      .catch(handleError);

    let link = resultFetch.result[0].link;
    qsa(".link-store").forEach((e) => {
      e.href = link;
    });
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
