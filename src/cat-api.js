import axios from 'axios';
const BASE_URL = 'https://api.thecatapi.com/v1';
const API_KEY =
  'live_4Ag4o5TKDh12APC8P2xfZ5Y1HnBHFc4PvidCy9iqdzraRgiXHVNIFt7ASHdQOhSO';

axios.defaults.headers.common['x-api-key'] = API_KEY;
axios.defaults.baseURL = BASE_URL;

// fetchBreeds 

export function fetchBreeds() {
  return axios.get('/breeds').then(response => {
    return response.data;
  });
}

export function fetchCatByBreed(breedId) {
  return axios.get(`/images/search?breed_ids=${breedId}`).then(resp => {
    return resp.data;
  });
}



