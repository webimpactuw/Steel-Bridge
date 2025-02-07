"use strict";

import { id, gen, statusCheck, handleError } from "./global.js";

(function () {
  /**
   * Add a function that will be called when the window is loaded.
   */
  window.addEventListener("load", init);

  /**
   * CHANGE: Describe what your init function does here.
   */
  async function init() {
    generateAward();
  }

  async function generateAward() {
    // query
    let request =
      "https://6t93n5tw.apicdn.sanity.io/v2021-10-21/data/query/production?query=*%5B_type%3D%3D%22achievements%22%5D";
    let resultFetch = await fetch(request)
      .then(statusCheck)
      .then((res) => res.json())
      .catch(handleError);

    let list = id("award-list");
    list.innerHTML = "";
    for (let i = 0; i < resultFetch.result.length; i++) {
      let currentData = resultFetch.result[i];
      let listItem = gen("li");
      listItem.textContent =
        currentData.award +
        ", " +
        currentData.location +
        ", " +
        currentData.year;
      list.append(listItem);
    }
  }
})();
