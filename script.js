let resultContainer = document.getElementById('result');
let suggestionContainer = document.getElementById('suggestionContainer');
let wishListContainer = document.getElementById('wishlistContainer');
let searchTerm;
// Define API key
const apikey = "WIs3btbmkJIwgTmCXAKYoGJjoG9RRAuRBWr7tZ7Y9rJyPw37dzKGshLS";

// Function to fetch data from the API
async function fetchData(searchTerm = "apple") {
    try {
        // Clear previous search result
        resultContainer.innerHTML = '';

        // Fetch data from the API
        const data = await fetch(`https://api.pexels.com/v1/search?query=${searchTerm}&page=1`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: apikey
            }
        });

        // Convert the response to JSON
        const response = await data.json();

        // Log the response to console
        console.log(response);

        // Extract photos from the response
        let photos = response.photos;

        // Render the first result and suggested images
        renderFirstResult(response.photos[0]);
        renderSuggestedImages(photos);
    } catch (error) {
        console.error('Error fetching curated photos:', error);
    }
}



// Event listener for the form submission
document.querySelector('.searchbox').addEventListener('submit', async function(event) {
    event.preventDefault();
    searchTerm = event.target.querySelector('input[type="search"]').value;
    await fetchData(searchTerm);
    event.target.querySelector('input[type="search"]').value = '';
});

// Function to render the first search result
function renderFirstResult(result) {
    let firstResult = document.createElement('div');
    firstResult.classList.add('result');

    let imageTag = document.createElement('img');
    imageTag.classList.add('item-image');
    imageTag.src = `${result.src.original}`;
    imageTag.alt = 'demo'

    let resultTextContainer = document.createElement('div');
    resultTextContainer.classList.add('result-text');
    
    let subHeading = document.createElement('h3');
    subHeading.textContent = `${result.alt}`;
    subHeading.classList.add('alt-text');

    let nameText = document.createElement('p')
    nameText.textContent = `${result.photographer}`
    nameText.classList.add('name')

    let buttonEl =  document.createElement('button')
    buttonEl.textContent ='Explore More'
    buttonEl.classList.add('explore-button')

    resultTextContainer.appendChild(subHeading);
    resultTextContainer.appendChild(nameText);
    resultTextContainer.appendChild(buttonEl);

    firstResult.appendChild(imageTag);
    firstResult.appendChild(resultTextContainer)


    resultContainer.appendChild(firstResult);
}

// Function to render suggested images
function renderSuggestedImages(photos) {
    suggestionContainer.innerHTML = '';
    photos.forEach(photo => {
        let altText = photo.alt.length > 6 ? photo.alt.substring(0, 6) + '...' : photo.alt;
        let imgContainer = document.createElement('div');
        imgContainer.classList.add('swiper-slide');
        imgContainer.innerHTML = `
            <img class="fetch-image" src="${photo.src.original}" alt="${photo.alt}">
            <h4 class="image-alt">${altText}</h4>
            <p class="name">${photo.photographer}</p>
            <button class="add-to-wishlist" data-src="${photo.src.original}" data-alt="${photo.alt}" data-photographer="${photo.photographer}">
                <img src='https://res.cloudinary.com/dfsppvj1s/image/upload/v1711541148/Heart_aeas27.png' alt='wishlist' class='wishlist' style="width: 30px; height: 30px; position: absolute; top: 10px; right: 10px;">
            </button>
        `;
        suggestionContainer.appendChild(imgContainer);
    });
}

// Call fetchData with a default search term when the page content is loaded
document.addEventListener('DOMContentLoaded', async function() {
    await fetchData(searchTerm);
});