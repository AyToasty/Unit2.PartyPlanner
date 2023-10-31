const COHORT = '2309-FTB-ET-WEB-FT'
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`

const state = { 
  events: [],
};

const eventsList = document.querySelector('#events');
const addEventsList = document.querySelector('#partyForm');
addEventsList.addEventListener("submit", addEvent);

async function render() {
  await getEvents();
  renderEvents();
}

render();

async function getEvents () {
  try {
    const response = await fetch (API_URL);
    const json = await response.json();
    state.events = json.data;
  } catch (error) {
    console.error(error)
  }
}

function renderEvents() {
  const listedEvents = state.events.map ((event) => {
    const  li = document.createElement('li');
    const capitalName = event.name.charAt(0).toUpperCase() + event.name.slice(1);
    li.innerHTML = `
      <h2>${capitalName}</h2> <br>
      <p>${event.description}</p> <br>
      <p>${event.date}</p>
      <p>${event.location}</p>
    `;

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete'
    deleteButton.addEventListener ('click', () => {
      deleteEvent(event.id)
    })
    
    li.appendChild(deleteButton)
    return li;
  });
  
  eventsList.replaceChildren (...listedEvents)
}

async function addEvent(event) {
  event.preventDefault();

  let name = addEventsList.name.value
  let description = addEventsList.description.value
  let date = addEventsList.date.value + ":00.000Z"
  let location = addEventsList.location.value

  const response = await fetch (API_URL, {
    method: "POST",
    headers: {"Content-type": "application/json"},
    body: JSON.stringify({
      name,
      description,
      date,
      location,
    })
  })
  console.log(response)

  render()
}

async function deleteEvent(id) {
  const response = await fetch (API_URL + `/${id}`, {
    method: "DELETE",
  })

  console.log ('Deleted Event: ', response)

  render ()
}