import axios from 'axios';

// Replace with your actual API key
axios.defaults.headers.common['x-api-key'] = 'live_4Ag4o5TKDh12APC8P2xfZ5Y1HnBHFc4PvidCy9iqdzraRgiXHVNIFt7ASHdQOhSO';

async function fetchBreeds() {
  try {
    const response = await axios.get('https://api.thecatapi.com/v1/breeds');
    return response.data;
  } catch (error) {
    console.error('Error fetching breeds:', error);
    showError();
  } finally {
    hideLoader();
  }
}

async function fetchCatByBreed(breedId) {
  try {
    const response = await axios.get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`);
    return response.data[0]; // Assuming only one image is returned
  } catch (error) {
    console.error('Error fetching cat by breed:', error);
    showError();
  } finally {
    hideLoader();
  }
}

function showLoader() {
  document.querySelector('.loader').classList.remove('hidden');
}

function hideLoader() {
  document.querySelector('.loader').classList.add('hidden');
}

function showError() {
  document.querySelector('.error').classList.remove('hidden');
}

function hideError() {
  document.querySelector('.error').classList.add('hidden');
}

// Call fetchBreeds on page load to populate the select element
fetchBreeds().then((breeds) => {
  const select = document.querySelector('.breed-select');
  breeds.forEach((breed) => {
    const option = document.createElement('option');
    option.value = breed.id;
    option.textContent = breed.name;
    select.appendChild(option);
  });

  // Handle breed selection change
  select.addEventListener('change', async (event) => {
    const breedId = event.target.value;
    showLoader();
    const catData = await fetchCatByBreed(breedId);
    document.querySelector('.cat-info img').src = catData.url;
    document.querySelector('.cat-info p:nth-child(2)').textContent = `Breed: ${catData.breeds[0].name}`;
    document.querySelector('.cat-info p:nth-child(3)').textContent = `Description: ${catData.breeds[0].description}`;
    document.querySelector('.cat-info p:nth-child(4)').textContent = `Temperament: ${catData.breeds[0].temperament}`;