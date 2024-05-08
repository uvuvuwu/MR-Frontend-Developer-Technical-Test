let productApi = "";
let selectedSize = "";
let shoppingCart = new Array();
let cartShow = false;

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
    let buttonsDiv = document.getElementById("buttons");

    // for size options in sizeOptions
    let sizeOptions = productApi.sizeOptions;
    for(let i = 0; i < sizeOptions.length; i++){
        let option = sizeOptions[i].label;

        // Create button
        let button = document.createElement("button");
        // Add text content
        button.textContent = option;
        // Add a class, so that we can use the class to check if its selected or not
        button.classList.add("size-button", "btn", "btn-primary");

        // Add click event handler
        button.onclick = function() {
            changeSelectedSize(option);
            updateButtonClasses();
        };

        // Add button to div
        buttonsDiv.appendChild(button);
    }
}

// When user clicks a size button, change the currently selected size
function changeSelectedSize(size){
    if(size == selectedSize){
        selectedSize = "";
    }
    else {
        selectedSize = size;
    }
}

// Update "selected" classes for the buttons so that only the button that was just clicked is "selected"
function updateButtonClasses() {
    let buttons = document.querySelectorAll(".size-button");
    buttons.forEach(button => {
        if (button.textContent === selectedSize) {
            button.classList.add("selected");
        } else {
            button.classList.remove("selected");
        }
    });
}

// Describes an item object
function Item(title, itemNum, cost, size){
    var _title = title;
    var _itemNum = itemNum;
    var _cost = cost;
    var _size = size;

    this.getTitle = function () {
        return _title;
    }
    this.getItemNum = function () {
        return _itemNum;
    }
    this.getCost = function () {
        return _cost;
    }
    this.getSize = function () {
        return _size;
    }

    this.incrementItemNum = function () {
        _itemNum += 1;
    }
}

// When the user clicks add to cart, add an item to the cart
function addItemToCart(){
    // Create an item if it doesn't exist in the cart
    // If it exists in the cart, increment the count

    // If no size is selected, return error
    if(selectedSize == ""){
        noSizeSelected();
        return;
    }

    // Loop through shopping cart, check if item of size exists in cart
    let isExists = false;
    let itemPositionInCart;
    for(let i = 0; i < shoppingCart.length; i++){
        if(shoppingCart[i].getSize() == selectedSize){
            isExists = true;
            itemPositionInCart = i;
            break;
        }
    }

    // If item is already in the cart, increment the count
    if(isExists == true){
        shoppingCart[itemPositionInCart].incrementItemNum();
    }
    if(isExists == false){
        let title = productApi.title;
        let itemNum = 1;
        let cost = productApi.price;
        let size = selectedSize;
        var item = new Item(title, itemNum, cost, size);
        shoppingCart.push(item);
    }

    // If the user added a new item to the cart while the cart is open, update the cart
    if(cartShow == true){
        showCart();
    }
}

// Error to return when the user adds to cart without a size selected
function noSizeSelected(){
    alert("No size was selected");
}

// When "my cart" is clicked, open/close the cart
function setCart(){
    if(shoppingCart.length == 0){
        alert("There is nothing in the cart!");
        return;
    }

    let cartDisplay = document.getElementById("cart-display");
    cartShow = !cartShow;
    if(cartShow == false){
        cartDisplay.innerHTML = "";
        return;
    }

    showCart();
}

// Display to user everything in the cart
function showCart(){
    let cartDisplay = document.getElementById("cart-display");
    
    // Clear cart display before displaying anything
    cartDisplay.innerHTML = "";

    for(let i = 0; i < shoppingCart.length; i++){
        let div = document.createElement("div");
        div.classList.add("cart-item");

        // Create the image element, append to item div
        let imageUrl = productApi.imageURL;
        let imgElement = document.createElement("img");
        imgElement.src = imageUrl;
        imgElement.classList.add("cart-img");
        div.appendChild(imgElement);


        let itemInfo = document.createElement("div");
        itemInfo.classList.add("item-info");

        // Create the title element
        let title = shoppingCart[i].getTitle();
        let titleDiv = document.createElement("div");
        titleDiv.textContent = title;
        itemInfo.appendChild(titleDiv);

        // Cost
        let cost = productApi.price;
        let itemCost2dp = cost.toFixed(2);
        itemCost2dp = "$" + itemCost2dp;
        // Number of items
        let itemNum = shoppingCart[i].getItemNum();
        let itemNumDiv = document.createElement("div");
        itemNumDiv.textContent = itemNum + "x " + itemCost2dp;
        itemInfo.appendChild(itemNumDiv);

        // Create a size element 
        let size = shoppingCart[i].getSize();
        let sizeDiv = document.createElement("div");
        sizeDiv.textContent = "Size: " + size;
        itemInfo.appendChild(sizeDiv);

        div.appendChild(itemInfo);
        // Append item div to cart display
        cartDisplay.appendChild(div);
    }
}