const countryText = document.getElementById('country');
const empty = '';
const placeNameText = document.getElementById('placeName');
const lotText = document.getElementById('LoT');
const countdownText = document.getElementById('countdown');
const weatherSectionDiv = document.getElementById('weather');
const imageSectionDiv = document.getElementById('image');

function buttonHandler(event) {
  countryText.textContent = empty;
  placeNameText.textContent = empty;
  lotText.textContent = empty;
  countdownText.textContent = empty;

  while (weatherSectionDiv.firstChild) {
    weatherSectionDiv.removeChild(weatherSectionDiv.firstChild);
  }

  if (imageSectionDiv.firstChild) {
    imageSectionDiv.removeChild(imageSectionDiv.firstChild);
  }
}

export default buttonHandler;
