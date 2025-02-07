"use strict";

import { id, gen, statusCheck, handleError, urlFor } from "./global.js";
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
      useCdn: false, // set to `true` to fetch from edge cache
      apiVersion: "2023-03-01", // use current date (YYYY-MM-DD) to target the latest API version
    });

    builder = imageUrlBuilder(client);

    generateSponsors();
  }

  async function generateSponsors() {
    // query
    let request =
      "https://6t93n5tw.apicdn.sanity.io/v2021-10-21/data/query/production?query=*%5B_type%3D%3D%22company%22%20%7C%7C%20_type%3D%3D%22individual%22%5D";
    let resultFetch = await fetch(request)
      .then(statusCheck)
      .then((res) => res.json())
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
        imageElement.src = urlFor(builder, currentData.image).quality(50).url();
        imageElement.alt = currentData.name;
        companyElement.append(imageElement);
      } else if (type == "individual") {
        let h3Element = gen("h3");
        h3Element.textContent = currentData.name;
        individualElement.append(h3Element);
      }
    }
  }
})();
