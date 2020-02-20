// ------------------------------------------
//  API URL
// ------------------------------------------

// Oded:
// all code in this page should be inside an iife, to prefent namespace collisions with native or third party code
// iife: https://developer.mozilla.org/en-US/docs/Glossary/IIFE
/*
  (function (window) {
    const peopleUrl = "https://randomuser.me/api/?results=12&nat=us";
    ...
  })(window);
*/
const peopleUrl = "https://randomuser.me/api/?results=12&nat=us";

// ------------------------------------------
//  FETCH API
// ------------------------------------------

// When the window load the fetch API is being processed
//generating the profiles and the HTML rendering

window.addEventListener("load", async () => {
  try {
    const response = await fetch(peopleUrl);
    const responseJson = await response.json();
    const profiles = getProfiles(responseJson);
    generateCards(profiles);
  } catch (err) {
    // Oded: should avoide the use of documet write, it's considered bad practice for a long time
    // see here: https://stackoverflow.com/questions/802854/why-is-document-write-considered-a-bad-practice
    // instead use:
    document.getElementById("error").textContent = 'bla bla'; 
    // 
    document.write("Something went wrong");
    console.log(err);
  }
});

// ------------------------------------------
//  CREATE PROFILES FROM THE JSON
// ------------------------------------------

function getProfiles(json) {
  // Oded: forEach is also good, but some interviewres will want to see here usage of array.map 
  // it's shorter, cleaner and more versitale can chain methods like filter:
  return json.results.map(person -> getSingleProfile(person)); 
  // 
  const profileArr = [];
  json.results.forEach(person => {
    profileArr.push(getSingleProfile(person));
  });
  return profileArr;
}

// ------------------------------------------
//  HTML RENDERING ELEMENTS
// ------------------------------------------

function generateCards(profiles) {
  const gallery = document.getElementById("gallery");
  profiles.forEach(profile => {
    const { picture, firstName, lastName, email, city, state } = profile;
    const card = document.createElement("div");
    // Oded: it's better to use classList then className
    //
    card.classList.add("card")
    //
    card.className += "card";
    card.setAttribute("data-email", email);
    gallery.appendChild(card);
    card.innerHTML = `
          <div class="card-img-container">
          <img class="card-img" src=${picture} alt="profile picture">
          </div>
          <div class="card-info-container">
          <h3 id="name" class="card-name cap">${firstName} ${lastName}</h3>
          <p id="email" class="card-text">${email}</p>
          <p class="card-text cap">${city}, ${state}</p>
          </div>
          </div>
          `;
  });
  addModalEvents(profiles);
  search();
}

// --------------------------------------------------
//  MODAL EVENTS AND FUNCTIONS
// --------------------------------------------------
function addModalEvents(profiles) {
  const cards = document.querySelectorAll(".card");
  for (const card of cards) {
    card.addEventListener("click", e => {
      // Oded: function can be extrcted out, no need to create new one for each event handler
      const currentCard = e.currentTarget;
      const dataEmail = currentCard.getAttribute("data-email");
      const profile = profiles.find(item => item.email === dataEmail);
      updateModal(profile);
    });
  }

  nextModule(profiles);
  prevModule(profiles);
  closeModal();
}

function updateModal(profile) {
  // Oded: you can also use <template> to prevent the existence of the modal in dom, before the user clicked on card.
  const address = `${profile.street.number}, ${profile.street.name} ${profile.city}, ${profile.state} ${profile.postcode}`;
  for (item in profile) {
    if (item === "street") {
      document
        .querySelectorAll(`.modal-info-container .${item}`)
        .item(0).innerHTML = address;
    } else if (item === "picture") {
      document.querySelector(`.modal-info-container .${item}`).src =
        profile[item];
    } else if (item === "postcode" || item === 'state') {
      continue;
    }  else if (item === "lastName") {
      document.querySelector(`.cap .${item}`).innerHTML = profile[item];
    } else {
      document
        .querySelectorAll(`.modal-info-container .${item}`)
        .item(0).innerHTML = profile[item];
    }
  }
  document.querySelector(".modal-container").style.display = "block";
}


function nextModule(profiles) {
  // Oded: this nextModule and prevModule is almost identical, should be refactored
  // to use a generic function something like:
  /*
    functtion navModule(profiles, modals) {
      modals.forEach(modal => {
        modal.addEventListener("click", e => {
         // Oded: prefered to extract out function
         // also prefered to use this or e.currentTarget insted of query all dom
         const modalEmail = this.querySelector(".modal-container .email")
          .textContent;
         const direction = this.dataset.directions; // should be 1 or -1 
         const modalProfile = profiles.find(item => item.email === modalEmail);
         const profileIndex = profiles.indexOf(modalProfile);
         if (profiles[profileIndex + direction]) {
          updateModal(profiles[profileIndex + direction]);
         }
    }
      });
  */
  const modalNext = document.querySelector(".modal-next");
  modalNext.addEventListener("click", () => {
    const modalEmail = document.querySelector(".modal-container .email")
      .textContent;
    const modalProfile = profiles.find(item => item.email === modalEmail);
    const profileIndex = profiles.indexOf(modalProfile);
    if (profiles[profileIndex + 1]) {
      updateModal(profiles[profileIndex + 1]);
    } else {
      // Oded: no need for this return and the else {}
      return;
    }
  });
}


function prevModule(profiles) {
  const modalPrev = document.querySelector(".modal-prev");
  modalPrev.addEventListener("click", () => {
    const modalEmail = document.querySelector(".modal-container .email")
      .textContent;
    const modalProfile = profiles.find(item => item.email === modalEmail);
    const profileIndex = profiles.indexOf(modalProfile);
    if (profiles[profileIndex - 1] !== undefined) {
      updateModal(profiles[profileIndex - 1]);
    } else if (profiles[profileIndex - 1] === undefined) {
      return;
    }
  });
}


function closeModal () {
  const modalButton = document.querySelector(".modal-close-btn");
  modalButton.addEventListener("click", () => {
    document.querySelector(".modal-container").style.display = "none";
  });
}

// --------------------------------------------------
//  SEARCH FUNCTION
// --------------------------------------------------
function search () {
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('keyup', getFilteredNames);
  searchInput.addEventListener('search', getFilteredNames);
  function getFilteredNames(event) {
    event.preventDefault();
    const filter = searchInput.value.toLowerCase();
    const names = document.querySelectorAll(".card-name");
    for (let name of names) {
      txtValue = name.textContent || name.innerText;
      if (filter === '') {
         name.parentNode.parentNode.style.display = "";
      }
      if (txtValue.toLowerCase().indexOf(filter)  > -1  ) {
        name.parentNode.parentNode.style.display = "";
      } else {
        name.parentNode.parentNode.style.display = "none";
      }
    }
  }
}

// --------------------------------------------------
//  HELPER FUNCTION FOR PHONE AND BIRTHDAY FORMATTING
// --------------------------------------------------

function formatPhoneNumber(phoneNumberString) {
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return null;
}

function formatBirthday(date) {
  const newDate = new Date(date);
  const newEvent = newDate.toLocaleDateString("en-US");
  return newEvent;
}

function getSingleProfile(profile) {
  const { first: firstName, last: lastName } = profile.name;
  const picture = profile.picture.large;
  const email = profile.email;
  const { city, state, street, postcode } = profile.location;
  const birthday = formatBirthday(profile.dob.date);
  const cell = profile.cell;
  return {
    firstName,
    lastName,
    picture,
    email,
    city,
    state,
    street,
    postcode,
    birthday,
    cell
  };
}
