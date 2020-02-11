// ------------------------------------------
//  API URL
// ------------------------------------------

const peopleUrl = 'https://randomuser.me/api/?results=12&nat=us';

// ------------------------------------------
//  FETCH API
// ------------------------------------------

// When the window load the fetch API is being processed
//generating the profiles and the HTML rendering

window.addEventListener('load', async () => {
  try {
    const response = await fetch(peopleUrl);
    const responseJson = await response.json();
    const profiles = getProfiles(responseJson);
    generateHTML(profiles);
  } catch (err) {
    document.write('Something went wrong');
    console.log(err);
  }
});

// ------------------------------------------
//  CREATE PROFILES FROM THE JSON
// ------------------------------------------

function getProfiles(json) {
  const profileArr = [];
  json.results.forEach(person => {
    const { first: firstName, last: lastName } = person.name;
    const picture = person.picture.large;
    const email = person.email;
    const { city, state, street, postcode } = person.location;
    const birthday = person.dob.date;
    const cell = person.cell;

    profileArr.push({
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
    });
  });
  return profileArr;
}

// ------------------------------------------
//  HTML RENDERING ELEMENTS
// ------------------------------------------

// this function create the all the HTML elements and render it to the screen;
function generateHTML(arr) {
  const gallery = document.getElementById('gallery');
  arr.forEach(profile => {
    const { picture, firstName, lastName, email, city, state } = profile;
    const card = document.createElement('div');
    card.className += 'card';
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

  //when a card is clicked the name of the card and the name of the modal cards are compared.
  //if there is a match, the modal window visibility will be visibile

  function createModal(profile) {
    const {
      picture,
      firstName,
      lastName,
      email,
      city,
      cell,
      street,
      state,
      postcode,
      birthday
    } = profile;
    //creation of the modal window, hide it by visibility hidden
    const modalContainer = document.createElement('div');
    modalContainer.className += 'modal-container';
    modalContainer.innerHTML = `
      <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
          <div class="modal-info-container">
              <img class="modal-img" src=${picture} alt="profile picture">
                <h3 id="modal-name" class="modal-name cap">${firstName} ${lastName}</h3>
                <p class="modal-text">${email}</p>
                <p class="modal-text cap">${city}</p>
                <hr>
                <p class="modal-text">${formatPhoneNumber(cell)}</p>
                <p class="modal-text cap">${street.number} ${
      street.name
    }, ${city}, ${state} ,${postcode}</p>
                <p class="modal-text">Birthday: ${formatBirthday(birthday)}</p>
            </div>
      </div>
      `;

    modalContainer.style.display = 'block';

    const scriptJS = document.getElementsByTagName('script')[0];
    document.body.insertBefore(modalContainer, scriptJS);
  }
//creating the modal and deleting it when pressing the close button
  const cards = document.querySelectorAll('.card');

  for (const card of cards) {
    card.addEventListener('click', e => {
      const currentCard = e.currentTarget;
      const cardEmail = currentCard.querySelector('#email').textContent;

      for (let i = 0; i < arr.length; i++) {
        if (cardEmail === arr[i].email) {
          createModal(arr[i]);
        }
        if (document.body.contains(document.querySelector('.modal'))) {
          const modalCloseBtn = document.querySelector('#modal-close-btn');
          modalCloseBtn.addEventListener('click', () => {
            const modalContainer = document.querySelector('.modal-container');
            if (modalContainer) {
              modalContainer.remove();
            }
          });
        }
      }
    });
  }
}



// --------------------------------------------------
//  HELPER FUNCTION FOR PHONE AND BIRTHDAY FORMATTING
// --------------------------------------------------

function formatPhoneNumber(phoneNumberString) {
  const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return null;
}

function formatBirthday(date) {
  const newDate = new Date(date);
  const newEvent = newDate.toLocaleDateString('en-US');
  return newEvent;
}
