'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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
    e.preventDefault()
    // Display marker
    const {latlng: { lat, lng }} = this.#mapEvent

    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = ''

    L.marker([lat, lng]).addTo(this.#map)
      .bindPopup(L.popup({
        minWidth: 100,
        maxWidth: 250,
        autoClose: false,
        closeOnClick: false,
        className: 'running-popup' // cycling-popup
      }))
      .setPopupContent('Workout')
      .openPopup();
  }
}


const app = new App()



