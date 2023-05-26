
"use strict";
import createClient from 'https://esm.sh/@sanity/client@4.0.0'
import imageUrlBuilder from 'https://esm.sh/@sanity/image-url'

(function() {

  let client;
  let builder;

  const DATASET = "production";
  const PROJECT_ID = "l6dam5td";

  let yearToMembers = new Map();
  let latestYear = 0;
  let oldestYear = 99999999;

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

    builder = imageUrlBuilder(client);
    generateMemberInfo();
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


  async function generateMemberInfo() {
    let request = 'https://l6dam5td.apicdn.sanity.io/v2021-10-21/data/query/production?query=*%5B_type%3D%3D%22member%22%5D'
    let resultFetch = await fetch(request)
      .then(statusCheck)
      .then(res => res.json())
      .catch(handleError);

    genYearToMembers(resultFetch);
    genYearOptions();
  }

  /**
   *
   * @param {String} name - member's name
   * @param {String} role - member's role
   * @param {Object} image - member's image from sanity
   * @param {String} linkedinLink - member's linkedin
   */
  function generateMember(name, role, image, linkedinLink) {
    let div = gen("div");
    div.classList.add("member");
    div.classList.add("flex");

    let img = gen("img");
    img.classList.add("member-photo");
    img.classList.add("flex");
    img.loading = "lazy";

    if (image == null) {
      img.src = "img/hat.png";
      img.alt = "University of Washington construction hard-hat";
    } else {
      img.src = urlFor(image).width(850).height(850).quality(50).url();
      img.alt = name;
    }

    div.append(img);

    let nameHeader = gen("h4");
    if (linkedinLink == null) {
      nameHeader.textContent = name;
    } else {
      let anchorTag = gen("a");
      anchorTag.textContent = name;
      anchorTag.href = linkedinLink;
      nameHeader.append(anchorTag);
    }

    div.append(nameHeader);

    let roleHeader = gen("h5");
    if (role == null) {
      roleHeader.textContent = "‎"; // this is an invisible character since the formatting breaks without it
    } else {
      roleHeader.textContent = role;
    }

    div.append(roleHeader);

    return div;
  }

  function generateMembers(year) {

    let memberArray = yearToMembers.get(year);

    // must have name, officerStatus defined
    // role, image, linkedinLink can all be undefined.

    // Wanted to be sorted by priority for members (excluding officers since they get their own array)
    // - image, role
    // - image, no role
    // - no image, role
    // - no image, NoRole

    // linkedin is irrelevant in ordering.

    let imageRole = [];
    let imageNoRole = [];
    let noImageRole = [];
    let noImageNoRole = [];

    let officersCategory = id("admin");
    let membersCategory = id("members");

    officersCategory.innerHTML = "";
    membersCategory.innerHTML = "";

    for (let i = 0; i < memberArray.length; i++) {
      let member = memberArray[i];
      let memberDiv = generateMember(member.name, member.role, member.image, member.linkedin);

      // added immediately
      if (member.officer == true) {
        if (member.role.toLowerCase() === "general manager") {
          officersCategory.prepend(memberDiv);
        } else {
          officersCategory.append(memberDiv);
        }
        continue;
      }

      // else sort through them and put them in their category.
      // you can definitely do this with only one array, but that is hard.
      if (member.image != null && member.role != null) {
        imageRole.push(memberDiv);
      } else if (member.image != null && member.role == null) {
        imageNoRole.push(memberDiv);
      } else if (member.image == null && member.role != null) {
        noImageRole.push(memberDiv);
      } else {
        noImageNoRole.push(memberDiv);
      }

    }

    imageRole.forEach(function(member) {membersCategory.append(member)});
    imageNoRole.forEach(function(member) {membersCategory.append(member)});
    noImageRole.forEach(function(member) {membersCategory.append(member)});
    noImageNoRole.forEach(function(member) {membersCategory.append(member)});

  }

  function genYearToMembers(resultFetch) {

    for (let i = 0; i < resultFetch.result.length; i++) {
      let member = resultFetch.result[i];
      let name = member.name;
      let role = member.role;
      let image = member.image;
      let linkedin = member.linkedin;
      let year = member.year;
      let officer = member.officer;

      let memberData = {
        "name": name,
        "role": role,
        "image": image,
        "linkedin": linkedin,
        "officer": officer
      }

      if (year > latestYear) latestYear = year;
      if (year < oldestYear) oldestYear = year;

      let array;
      if (yearToMembers.has(year)) {
        array = yearToMembers.get(year);
      } else {
        array = [];
      }

      array.push(memberData);
      yearToMembers.set(year, array);
    }
  }

  function genYearOptions() {

    for (let i = latestYear; i >= oldestYear; i--) {
      if (yearToMembers.has(i)) {
        let currentYearOption = gen("option");
        currentYearOption.textContent = i + " - " + (i + 1);
        id("options").append(currentYearOption);
        currentYearOption.value = i;
      }
    }

    id("options").addEventListener("change", function(event) {
      let options = id("options");
      let value = options.value;
      generateMembers(Number(value));
    })

    generateMembers(latestYear);
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