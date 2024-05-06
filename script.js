let productApi = "";

// Function to run upon loading the page
async function loadPage() {
    await getProductInfo();
    loadImage();
    loadTitle();
    loadCost();
    loadDescription();
    loadSizeButtons();
}

// Go to API to get product info
async function getProductInfo() {
    const response = await fetch(
        "https://3sb655pz3a.execute-api.ap-southeast-2.amazonaws.com/live/product"
    );
    const product = await response.json();
    productApi = product;
    console.log(productApi);
}

// Load image from info returned from api call
function loadImage() {
    // Set the image
    let imageUrl = productApi.imageURL;
    let imgElement = document.getElementById("item-image");
    imgElement.src = imageUrl;
    // Set the image alt attribute
    imgElement.setAttribute("alt", productApi.title);
}

// Load image title from info returned from api call
function loadTitle() {
    let itemTitle = productApi.title;
    let titleElement = document.getElementById("item-title");
    titleElement.textContent = itemTitle;
}

// Load item cost from info returned from api call
function loadCost() {
    let itemCost = productApi.price;
    let itemCost2dp = itemCost.toFixed(2);
    let costElement = document.getElementById("item-cost");
    costElement.textContent = "$" + itemCost2dp;
}

// Load item description from info returned from api call
function loadDescription() {
    let itemDesc = productApi.description;
    let descElement = document.getElementById("item-description");
    descElement.textContent = itemDesc;
}

// Load item size buttons from info returned from api call
function loadSizeButtons() {
    // for size options in sizeOptions
    // Create button
    // Add text content
    // Add to div
}