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

let map, mapEvent;

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude} }) => {
    const coords = [latitude, longitude]

    map = L.map('map').setView(coords, 14);

    // fr/hot/
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    map.on('click', function (mapEvt) {
      mapEvent = mapEvt

      form.classList.remove('hidden')
      inputDistance.focus()

    })


  }, () => {
    console.log('error')
  })
}


form.addEventListener('submit', function (e) {
  e.preventDefault()
  // Display marker
  const {latlng: { lat, lng }} = mapEvent

  inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = ''

  L.marker([lat, lng]).addTo(map)
    .bindPopup(L.popup({
      minWidth: 100,
      maxWidth: 250,
      autoClose: false,
      closeOnClick: false,
      className: 'running-popup' // cycling-popup
    }))
    .setPopupContent('Workout')
    .openPopup();

})

inputType.addEventListener('change', function () {
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
})
