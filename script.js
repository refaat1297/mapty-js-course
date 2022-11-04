'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];



class Workout {
  date = new Date()
  id = (Date.now() + '').slice(-10)
  constructor (coords, distance, duration) {
    this.coords = coords
    this.distance = distance // in km
    this.duration = duration // in min
  }
}

class Running extends Workout {
  type = 'running'

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence
    this.calcPace()
  }

  calcPace () {
    // min/km
    this.pace = this.duration / this.distance
    return this.pace
  }
}

class Cycling extends Workout {
  type = 'cycling'

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain
    this.calcSpeed()
  }

  calcSpeed () {
    // km/h
    this.speed = this.distance / (this.duration / 60)
    return this.speed
  }
}

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
let inputDistance = document.querySelector('.form__input--distance');
let inputDuration = document.querySelector('.form__input--duration');
let inputCadence = document.querySelector('.form__input--cadence');
let inputElevation = document.querySelector('.form__input--elevation');

class App {
  #map;
  #mapEvent;
  #workouts = [];

  constructor () {
    this._getPosition()
    form.addEventListener('submit', this._newWorkout.bind(this))
    inputType.addEventListener('change', this._toggleElevationField)
  }

  _getPosition () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () => {
        console.log('error')
      })
    }
  }

  _loadMap ({ coords: { latitude, longitude} }) {
    const coords = [latitude, longitude]

    this.#map = L.map('map').setView(coords, 14);

    // fr/hot/
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.#map);

    this.#map.on('click', this._showForm.bind(this))
  }

  _showForm (mapEvt) {
    this.#mapEvent = mapEvt
    form.classList.remove('hidden')
    inputDistance.focus()
  }

  _toggleElevationField () {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
  }

  _newWorkout (e) {
    const {latlng: { lat, lng }} = this.#mapEvent
    const validInputs = (...inputs) => inputs.every(inp => Number.isFinite(inp))
    const allPositive = (...inputs) => inputs.every(inp => inp > 0)

    e.preventDefault()

    // get the data from the form
    const type = inputType.value
    const distance = +inputDistance.value
    const duration = +inputDuration.value
    let workout



    // check if data is valid

    // if activity running, create running object
    if (type === 'running') {
      const cadence = +inputCadence.value

      // check if data id valid
      if (!validInputs(distance, duration, cadence) || !allPositive(distance, duration, cadence)) {
        return alert('Inputs have to be positive numbers!')
      }

      workout = new Running([lat, lng], distance, duration, cadence)
    }

    // if activity cycling, create cycling object
    if (type === 'cycling') {
      const elevation = +inputElevation.value

      // check if data id valid
      if (!validInputs(distance, duration, elevation) || !allPositive(distance, duration)) {
        return alert('Inputs have to be positive numbers!')
      }

      workout = new Cycling([lat, lng], distance, duration, elevation)
    }

    // add new object to workout array
    this.#workouts.push(workout)
    console.log(workout);

    // render workout on map as a marker
    this._renderWorkoutMarker(workout)

    // render workout on the list

    // hide form + clear the input fields
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = ''

  }

  _renderWorkoutMarker (workout) {
    L.marker(workout.coords).addTo(this.#map)
      .bindPopup(L.popup({
        minWidth: 100,
        maxWidth: 250,
        autoClose: false,
        closeOnClick: false,
        className: `${workout.type}-popup`
      }))
      .setPopupContent(workout.distance.toString())
      .openPopup();
  }
}




const app = new App()



