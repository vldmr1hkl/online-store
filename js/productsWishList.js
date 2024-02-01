import {workingProducts, saveProductsToLocalStorage } from './home.js';
import {productInCart, saveCartToLocalStorage, showNotifications} from './productsCart.js';

let wishlist = loadWishlistFromLocalStorage();
function loadWishlistFromLocalStorage() {
    const storedWishlist = localStorage.getItem('wishlist');
    return storedWishlist ? JSON.parse(storedWishlist) : [];
}
function saveWishlistToLocalStorage() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

const wishlistOpenButton = document.querySelector('.wish-list-open-button');
const wishlistCloseButton = document.querySelector('.wish-list-close-button');
const wishlistContainer = document.querySelector('.wish-list-container');

function openWishlist() {
    const overlay = document.querySelector('.overlay');
    wishlistContainer.classList.add('show');
    overlay.classList.add('show');
    renderWishList(wishlist, 'wish-list-products');
}

function closeWishlist() {
    const overlay = document.querySelector('.overlay');
    wishlistContainer.classList.remove('show');
    overlay.classList.remove('show');
}

wishlistOpenButton.addEventListener('click', openWishlist);
wishlistCloseButton.addEventListener('click', closeWishlist);

export function addToWishList(productId) {
    const productIndex = workingProducts.findIndex(product => product.id === productId);
    const likeButtons = document.querySelectorAll(`[data-id="${productId}"] .like`);

    if (productIndex !== -1) {
        const isInWishlist = wishlist.some(item => item.id === productId);

        if (!isInWishlist) {
            workingProducts[productIndex].isActive = true;
            wishlist.push(workingProducts[productIndex]);
            likeButtons.forEach(button => button.classList.add('active'));
            showNotifications("Product was added to wishlist successfully!");
        } else {
            const existingIndex = wishlist.findIndex(item => item.id === productId);
            wishlist.splice(existingIndex, 1);
            delete workingProducts[productIndex].isActive;
            likeButtons.forEach(button => button.classList.remove('active'));
            showNotifications("Product was removed from wishlist!");
            renderWishList(); 
        }    
        
    } else {
        console.log("Product not found");
    }
    saveProductsToLocalStorage();
    saveWishlistToLocalStorage();
}

function renderWishList() {
    const container = document.getElementById('wish-list-products');
    container.innerHTML = '';
    document.querySelector('.wish-list-empty').style.display = (wishlist.length !== 0) ? 'none' : 'flex';

    wishlist.forEach(product => {
        const wishlistProducts = Handlebars.compile(document.querySelector("#wishListProducts").innerHTML);
        const filled = wishlistProducts({products: [product]});
        const productElement = document.createElement('div');
        productElement.classList.add('product-item');
        productElement.setAttribute('data-id', product.id);
        productElement.innerHTML = filled;


        productElement.querySelector('.action-button.like').addEventListener('click', () => addToWishList(product.id));
        if (product.isActive) {
            productElement.querySelector('.action-button.like').classList.add('active');
        };

        container.appendChild(productElement);
    })
}

function addWishListToCard() {
    wishlist.forEach(wishlistProduct => {
        const isInCart = productInCart.some(item => item.id === wishlistProduct.id);
        if (!isInCart) {
            productInCart.push(wishlistProduct);
            wishlistProduct.quantity = 1;
            saveCartToLocalStorage();
            showNotifications("Products from wishlist were added to cart successfully!"); 
        } else {
            showNotifications(`Product ${wishlistProduct.name} is already in cart.`);
        }
        clearWishList()
    });
}

function clearWishList(){
    wishlist.forEach(wishlistProduct => {
        const likeButtons = document.querySelectorAll(`[data-id="${wishlistProduct.id}"] .like`);
        likeButtons.forEach(button => button.classList.remove('active'));
    })
    wishlist = [];
    workingProducts.forEach(product => {
        delete product.isActive;
    });
    saveWishlistToLocalStorage();
    saveProductsToLocalStorage();
    renderWishList(wishlist, 'wish-list-products');  
}

document.querySelector(".clear-wish-list-button").addEventListener('click', () => clearWishList());
document.querySelector(".wish-list-footer .add-to-cart").addEventListener('click', () => addWishListToCard());
