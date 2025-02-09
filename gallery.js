"use strict";

import { id, qsa, gen, statusCheck, handleError, urlFor } from "./global.js";
import { createClient } from "https://esm.sh/@sanity/client";
import imageUrlBuilder from "https://esm.sh/@sanity/image-url";

(function () {
  let client;
  let builder;
  let imageSourceToCaption = new Map();

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

    id("full-pic").addEventListener("click", function (event) {
      if (event.target == this) {
        id("full-pic").style.display = "none";
      }
    });

    id("x").addEventListener("click", function (event) {
      id("full-pic").style.display = "none";
    });

    generateImages();
  }

  async function generateImages() {
    let request =
      "https://6t93n5tw.apicdn.sanity.io/v2021-10-21/data/query/production?query=*%5B_type%3D%3D%22gallery%22%5D";
    let resultFetch = await fetch(request)
      .then(statusCheck)
      .then((res) => res.json())
      .catch(handleError);

    for (let i = 0; i < resultFetch.result.length; i++) {
      let currentData = resultFetch.result[i];
      let caption = currentData.caption;
      let alt = currentData.alt;
      let image = currentData.image;

      let imageElement = generateImageElement(caption, alt, image);
      imageElement.addEventListener("click", function () {
        displayImage(this);
      });
      id("gallery").append(imageElement);
    }
  }

  function generateImageElement(caption, alt, image) {
    let imageElement = gen("img");
    imageElement.src = urlFor(builder, image).quality(55).url();
    if (alt) imageElement.alt = alt;
    if (caption)
      imageSourceToCaption.set(
        urlFor(builder, image).quality(55).url(),
        caption,
      );
    imageElement.loading = "lazy";
    return imageElement;
  }

  function displayImage(element) {
    id("full-pic").style.display = "flex";
    let fullImage = id("full-image");
    fullImage.src = element.src;
    let arrows = qsa(".image-arrow");
    // arrows.forEach(function (arrow) {
    //   clearAllEventListeners(arrow);
    // });
    arrows = qsa(".image-arrow");

    let caption = imageSourceToCaption.get(fullImage.src);
    let captionElement = id("caption");

    if (caption) {
      captionElement.textContent = caption;
    } else {
      captionElement.textContent = "";
    }

    let previousImage = element.previousElementSibling;
    let nextImage = element.nextElementSibling;

    if (previousImage != null) {
      arrows[0].addEventListener("click", function () {
        displayImage(previousImage);
      });
      arrows[0].classList.remove("dim");
      arrows[0].style.cursor = "pointer";
    } else {
      arrows[0].classList.add("dim");
      arrows[0].style.cursor = "initial";
    }

    if (nextImage) {
      arrows[1].addEventListener("click", function () {
        displayImage(nextImage);
      });
      arrows[1].classList.remove("dim");
      arrows[1].style.cursor = "pointer";
    } else {
      arrows[1].classList.add("dim");
      arrows[1].style.cursor = "initial";
    }

    document.onkeydown = function (e) {
      let displayNoneCheck = id("full-pic").style.display !== "none";
      if (e.key === "ArrowLeft" && previousImage && displayNoneCheck) {
        displayImage(previousImage);
      } else if (e.key === "ArrowRight" && nextImage && displayNoneCheck) {
        displayImage(nextImage);
      } else if (e.key === "Escape") {
        id("full-pic").style.display = "none";
      }
    };
  }
})();
