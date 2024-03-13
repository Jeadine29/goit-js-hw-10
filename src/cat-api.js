import axios from 'axios';

// Set the API key in the default headers
axios.defaults.headers.common['x-api-key'] = 'live_4Ag4o5TKDh12APC8P2xfZ5Y1HnBHFc4PvidCy9iqdzraRgiXHVNIFt7ASHdQOhSO';

// Function to fetch breeds
export function fetchBreeds() {
    return axios.get('https://api.thecatapi.com/v1/breeds')
        .then(response => response.data)
        .catch(error => {
            throw error;
        });
}

// Function to fetch cat information by breed ID
export function fetchCatByBreed(breedId) {
    return axios.get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
        .then(response => response.data[0])
        .catch(error => {
            throw error;
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const breedSelect = new SlimSelect({
        select: '#breed-select',
        placeholder: 'Select a breed'
    });
    const catInfo = document.getElementById('cat-info');
    const loader = document.getElementById('loader');
    const error = document.getElementById('error');

    // Fetch breeds and populate select options
    fetchBreeds()
        .then(breeds => {
            breeds.forEach(breed => {
                breedSelect.add(breed.id, breed.name);
            });
        })
        .catch(err => {
            console.error('Error fetching breeds:', err);
            error.style.display = 'block';
        });

    // Event listener for breed selection
    breedSelect.slim.container.addEventListener('change', () => {
        const selectedBreedId = breedSelect.selected();
        if (selectedBreedId) {
            loader.style.display = 'block';
            catInfo.style.display = 'none';
            fetchCatByBreed(selectedBreedId)
                .then(catData => {
                    // Display cat information
                    catInfo.innerHTML = `
                        <img src="${catData.image.url}" alt="Cat Image">
                        <p><strong>Breed:</strong> ${catData.breeds[0].name}</p>
                        <p><strong>Description:</strong> ${catData.breeds[0].description}</p>
                        <p><strong>Temperament:</strong> ${catData.breeds[0].temperament}</p>
                    `;
                    catInfo.style.display = 'block';
                    loader.style.display = 'none';
                })
                .catch(err => {
                    console.error('Error fetching cat by breed:', err);
                    error.style.display = 'block';
                    loader.style.display = 'none';
                });
        }
    });
});