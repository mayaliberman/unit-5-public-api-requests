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
    const firstName = person.name.first;
    const lastName = person.name.last;
    const picture = person.picture.large;
    const email = person.email;
    const city = person.location.city;
    const state = person.location.state;
    const street = person.location.street;
    const postcode = person.location.postcode;
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
    const card = document.createElement('div');
    card.className += 'card';
    gallery.appendChild(card);
    card.innerHTML = `
          <div class="card-img-container">
          <img class="card-img" src=${profile.picture} alt="profile picture">
          </div>
          <div class="card-info-container">
          <h3 id="name" class="card-name cap">${profile.firstName} ${profile.lastName}</h3>
          <p class="card-text">${profile.email}</p>
          <p class="card-text cap">${profile.city}, ${profile.state}</p>
          </div>
          </div>
          `;

    //creation of the modal window, hide it by visibility hidden
    const modalContainer = document.createElement('div');
    modalContainer.className += 'modal-container';
    modalContainer.innerHTML = `
      <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
          <div class="modal-info-container">
              <img class="modal-img" src=${
                profile.picture
              } alt="profile picture">
                <h3 id="name" class="modal-name cap">${profile.firstName} ${
      profile.lastName
    }</h3>
                <p class="modal-text">${profile.email}</p>
                <p class="modal-text cap">${profile.city}</p>
                <hr>
                <p class="modal-text">${formatPhoneNumber(profile.cell)}</p>
                <p class="modal-text cap">${profile.street}, ${profile.city}, ${
      profile.state
    } ,${profile.postcode}</p>
                <p class="modal-text">Birthday: ${formatBirthday(
                  profile.birthday
                )}</p>
            </div>
      </div>
      `;
    $('#gallery').after(modalContainer);
    $('.modal-container').css('visibility', 'hidden');
  });

  //when a card is clicked the name of the card and the name of the modal cards are compared.
  //if there is a match, the modal window visibility will be visibile

  $('.card').on('click', e => {
    const card = e.currentTarget;
    const cardName = card.querySelector('.card-name').textContent;
    const cardsModal = document.querySelectorAll('.modal-container');
    for (let i = 0; i < cardsModal.length; i++) {
      const modalName = cardsModal[i].querySelector('#name').textContent;
      if (modalName === cardName) {
        cardsModal[i].style.visibility = 'visible';
      }
    }
  });

  //When the close button is clicked the modal window visibility will be hidden again

  $('.modal-close-btn').on('click', () => {
    $('.modal-container').css('visibility', 'hidden');
  });
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
