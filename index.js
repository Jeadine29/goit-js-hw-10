import { fetchBreeds, fetchCatByBreed } from './cat-api';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

let breedId = '';

const elements = {
  select: document.querySelector('.breed-select'),
  info: document.querySelector('.cat-info'),
  loader: document.querySelector('.loader'),
  error: document.querySelector('.error'),
};

elements.loader.classList.add('is-hidden');
elements.error.classList.add('is-hidden');
elements.info.classList.add('is-hidden');

function fetchList() {
  fetchBreeds()
    .then(breeds => {
      const breedMarkup = breeds
        .map(({ id, name }) => {
          return `<option value="${id}">${name}</option>`;
        })
        .join('');
      elements.select.insertAdjacentHTML('beforeend', breedMarkup);

      new SlimSelect({
        select: elements.select,
      });
    })
    .catch(onError);
}

fetchList();
elements.select.addEventListener('change', onSelect);

// on the choice of breed
function onSelect(evt) {
  evt.preventDefault();
  onLoad();
  breedId = evt.target.value;
  showCat(breedId);
}

function showCat(breedId) {
  let selectedBreed;
  fetchBreeds()
    // to get information about the breed and store it in selectedBreed
    .then(data => {
      selectedBreed = data.find(breed => breed.id === breedId);
      //we will get the result from the image request
      return fetchCatByBreed(breedId);
    })
    .then(catInfo => {
      // we take the picture from the second request
      const catData = catInfo[0];

      const description = selectedBreed.description;
      const temperament = selectedBreed.temperament;
      const name = selectedBreed.name;
      const { url } = catData;

      //form a markup
      const oneCatMarkup = `
         <div class="cat">
         <div class="cat__img">
           <img src="${url}" alt='cat' width='500'/>
         </div class="cat__info-txt">
           <h1 class="cat__info-title">${name}</h1>
           <p class="cat__info-description">${description}</p>
           <p class="cat__info-temperament"><span>Temperament:</span> ${temperament}</p>
         </div></div>`;
      elements.info.innerHTML = oneCatMarkup;
      onAppear();
    })
    .catch(onError);
}

//  in case of error
function onError(error) {
  // elements.error.classList.remove('is-hidden');
  Notiflix.Notify.warning(
    'Oops! Something went wrong! Try reloading the page!'
  );
  console.log(error);
}

function onAppear() {
  elements.loader.classList.add('is-hidden');
  elements.info.classList.remove('is-hidden');
}

function onLoad() {
  elements.loader.classList.remove('is-hidden');
  elements.info.classList.add('is-hidden');
}