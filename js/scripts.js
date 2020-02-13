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
    generateCards(profiles);
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
  
    profileArr.push(
      getProfile(person)
    
    );
  });
  return profileArr;
}

// ------------------------------------------
//  HTML RENDERING ELEMENTS
// ------------------------------------------

// this function create the all the HTML elements and render it to the screen;
function generateCards(profiles) {
  const gallery = document.getElementById('gallery');
  profiles.forEach(profile => {
    const { picture, firstName, lastName, email, city, state } = profile;
    const card = document.createElement('div');
    card.className += 'card';
    card.setAttribute('data-email', email);
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
}

function addModalEvents(profiles) {
  const cards = document.querySelectorAll('.card');
  for (const card of cards) {
    card.addEventListener('click', e => {
      const currentCard = e.currentTarget;
      const dataEmail = currentCard.getAttribute('data-email');
      const profile = profiles.find(item => item.email === dataEmail);
      updateModal(profile);
    });
  }
}


//Update Modal
function updateModal(profile) {
  console.log(profile)
  // var your_div = document.getElementById('your_div');
{/* <img class="modal-img picture" src="https://placehold.it/125x125" alt="profile picture">
                        <h3 class="modal-name cap"><span class="fistName">firstname</span>&nbsp;<span class="lastName">lastname</span></h3>
                        <p class="modal-text email">email</p>
                        <p class="modal-text cap city">city</p>
                        <hr>
                        <p class="modal-text cell">(555) 555-5555</p>
                        <p class="modal-text street">123 Portland Ave., Portland, OR 97204</p>
                        <p class="modal-text birthday">Birthday: 10/21/2015</p>
  // var text_to_change = your_div.childNodes[0];

  // text_to_change.nodeValue = 'new text'; */}
  const cardContainer = document.querySelector('.modal-info-container');
  cardContainer.childNodes[1].querySelector(profile.picture) = profile.picture;
  // const cardChilds = cardContainer.childNodes;
  //   for (item in profile) {
  //   cardContainer.getElementByClassName(item).textContent = item;
  //     }
  document.querySelector('.modal-container').style.display = 'block';
}
//creating the modal and deleting it when pressing the close button

function closeModal() {
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

function getProfile(profile) {
  const { first: firstName, last: lastName } = profile.name;
  const picture = profile.picture.large;
  const email = profile.email;
  const { city, state, street, postcode } = profile.location;
  const birthday = profile.dob.date;
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
