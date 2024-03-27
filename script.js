// Define constants for containers
let resultContainer = document.getElementById('result');
let suggestionContainer = document.getElementById('suggestionContainer');
let wishListContainer = document.getElementById('wishlistContainer');

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

// Call fetchData with a default search term when the page content is loaded
document.addEventListener('DOMContentLoaded', async function() {
    await fetchData();
});

// Event listener for the form submission
document.querySelector('.searchbox').addEventListener('submit', async function(event) {
    event.preventDefault();
    searchValue = event.target.querySelector('input[type="search"]').value;
    await fetchData(searchValue);
    event.target.querySelector('input[type="search"]').value = '';
});

// Function to render the first search result
function renderFirstResult(result) {
    let firstResult = document.createElement('div');
    firstResult.classList.add('result');
    firstResult.innerHTML = `
        <img class="item-image" src="${result.src.original}" alt="demo">
        <div class="result-text">
            <h3 class="alt-text">${result.alt}</h3>
            <p class="name">${result.photographer}</p>
            <button class="explore-button">
                Explore More
            </button>
        </div>
    `;
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

// Event listener for "Add to Wishlist" button click
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('add-to-wishlist')) {
        const imageData = {
            src: event.target.dataset.src,
            alt: event.target.dataset.alt,
            photographer: event.target.dataset.photographer
        };
        let wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
        const exists = wishlistItems.some(item => item.src === imageData.src);
        if (!exists) {
            wishlistItems.push(imageData);
            localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
            renderWishlist();
        }
    }
});

// Function to render wishlist items
function renderWishlist() {
    wishListContainer.innerHTML = '';
    const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
    wishlistItems.forEach(item => {
        const itemContainer = document.createElement('div');
        itemContainer.classList.add('swiper-slide');
        itemContainer.innerHTML = `
            <img class="fetch-image" src="${item.src}" alt="${item.alt}">
            <h4 class="image-alt">${item.alt}</h4>
            <p class="name">${item.photographer}</p>
        `;
        wishListContainer.appendChild(itemContainer);
    });
}
