let resultContainer = document.getElementById('result');
let suggestionContainer = document.getElementById('suggestionContainer');
let wishListContainer = document.getElementById('wishlistContainer');
let searchTerm;
// Define API key
const apiKey = "WIs3btbmkJIwgTmCXAKYoGJjoG9RRAuRBWr7tZ7Y9rJyPw37dzKGshLS";

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
                Authorization: apiKey
            }
        });

        // Convert the response to JSON
        const response = await data.json();

        // Log the response to console
        // console.log(response);

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
        imgContainer.id = `${photo.id}`
       
        imgContainer.innerHTML = `
            <img class="fetch-image" src="${photo.src.original}" alt="${photo.alt}">
            <h4 class="image-alt">${altText}</h4>
            <p class="name">${photo.photographer}</p>
            <button class="add-to-wishlist" data-id="${photo.id}" >
                <img src='https://res.cloudinary.com/dfsppvj1s/image/upload/v1711541148/Heart_aeas27.png' alt='wishlist' class='wishlist' style="width: 30px; height: 30px; position: absolute; top: 0; right: 0;">
            </button>
            
        `;
        imgContainer.querySelector('.add-to-wishlist').addEventListener('click', function() {
            updateWishlist(photo)})
        
        suggestionContainer.appendChild(imgContainer);
    });
}

// Call fetchData with a default search term when the page content is loaded
document.addEventListener('DOMContentLoaded', async function() {
    await fetchData(searchTerm);
});

// Define a variable to hold wishlist data
let wishlist = [];

// Attach event listener to the document body to listen for clicks on "add-to-wishlist" buttons
document.body.addEventListener('click', function(event) {
    if (event.target.classList.contains('add-to-wishlist')) {
        // Extract data attributes from the clicked button
        const id = event.target.getAttribute('data-id');
        const photo = document.getElementById(id);
        const src = photo.querySelector('.fetch-image').getAttribute('src');
        const alt = photo.querySelector('.image-alt').textContent;
        const photographer = photo.querySelector('.name').textContent;

        // Create an object with the extracted data
        const imageData = {
            id: id,
            src: src,
            alt: alt,
            photographer: photographer
        };

        // Check if the image is already in the wishlist
        const existingIndex = wishlist.findIndex(item => item.id === id);
        if (existingIndex === -1) {
            // Push the object to the wishlist array
            wishlist.push(imageData);

            // Update the wishlist container with the updated wishlist data
            updateWishlist();
        } else {
            alert('This image is already in the wishlist.');
        }
    }
});

// Function to update the wishlist container
function updateWishlist(photo) {
    console.log(photo);

    // Check if the photo is already in the wishlist container
    const existingItem = document.querySelector(`.wishlist-image[data-id="${photo.id}"]`);
    if (existingItem) {
        // Item already exists in the container, do not add again
        return;
    }

    // Check if the photo is already in the local storage
    let wishItems = JSON.parse(localStorage.getItem('wishList-container')) || [];
    const existsInLocalStorage = wishItems.some(item => item.id === photo.id);
    if (existsInLocalStorage) {
        // Item already exists in the local storage, do not add again
        return;
    }

    // Clear previous wishlist content

    // Create a new wishlist item
    const wishlistItem = document.createElement('div');
    wishlistItem.classList.add('swiper-slide');
    wishlistItem.innerHTML = `
        <img class='wishlist-image' src="${photo.src.original}" alt="${photo.alt}" data-id="${photo.id}">
        <p class="photographer">${photo.photographer}</p>
        <button class='remove-from-wishlist' >X</button>
    `;

    // Append the wishlist item to the container
    wishListContainer.appendChild(wishlistItem);

    // Update local storage
    wishItems.push(photo);
    localStorage.setItem('wishList-container', JSON.stringify(wishItems));
}



function populateWishList(){
    const wishItems = JSON.parse(localStorage.getItem('wishList-container')) || [];
    wishItems.forEach(photo=>{
        const wishlistItem = document.createElement('div');
        wishlistItem.classList.add('swiper-slide');
        wishlistItem.innerHTML = `
            <img class='wishlist-image' src="${photo.src.original}" alt="${photo.alt}">
            <p class="photographer">${photo.photographer}</p>
            <button class='remove-from-wishlist' >X</button>
        `;
        wishListContainer.appendChild(wishlistItem);
        wishlistItem.querySelector('.remove-from-wishlist').addEventListener('click', function() {
            deleteWishList(wishlistItem,photo)})
            // wishListContainer.removeChild(wishlistItem)
    })


}

function deleteWishList(wishlistItem,photo){
    console.log('deleted')
    wishListContainer.removeChild(wishlistItem)
    let wishItems = JSON.parse(localStorage.getItem('wishList-container')) || [];
    wishItems = wishItems.filter(item=> item.id != photo.id);
    localStorage.setItem('wishList-container',JSON.stringify(wishItems))




}

window.onload = populateWishList;