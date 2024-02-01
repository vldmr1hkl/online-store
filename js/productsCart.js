import {workingProducts} from './home.js';

export const productInCart = loadCartFromLocalStorage();
function loadCartFromLocalStorage() {
    const productInCart = localStorage.getItem('productInCart');
    return productInCart ? JSON.parse(productInCart) : [];
}
export function saveCartToLocalStorage() {
    localStorage.setItem('productInCart', JSON.stringify(productInCart));
}


const cartOpenButton = document.querySelector('.cart-open-button');
const cartCloseButton = document.querySelector('.cart-close-button');
const cartContainer = document.querySelector('.cart-container');

function openProductCart() {
    const overlay = document.querySelector('.overlay');
    cartContainer.classList.add('show');
    overlay.classList.add('show');
    renderCart(productInCart, 'products-cart');
}

function closeProductCart() {
    cartContainer.classList.remove('show');
    const overlay = document.querySelector('.overlay');
    overlay.classList.remove('show');
}

cartOpenButton.addEventListener('click', openProductCart);
cartCloseButton.addEventListener('click', closeProductCart);

// const productInCart = []

export function showNotifications(message){
    const notification = document.querySelector('.notification p');
    notification.style.visibility = 'visible';
    notification.textContent = message;
    setTimeout(() => {
        notification.style.visibility = 'hidden';
    }, 2000);
}


export function addToCard(productId) {
    const productIndex = workingProducts.findIndex(product => product.id === productId);
    const productItems = document.querySelectorAll('.product-item');

    if (productIndex !== -1) {
        const isInCart = productInCart.some(item => item.id === productId);

        if (!isInCart) {
            workingProducts[productIndex].quantity = 1;
            workingProducts[productIndex].total = workingProducts[productIndex].price;
            productInCart.push(workingProducts[productIndex]);
            
        } else {
            showNotifications("Product already in cart!");
        }
        productItems.forEach(productItem => {
            productItem.classList.remove('show');
        });

    } else {
       console.log('Object not found');
    }
    saveCartToLocalStorage();
    openProductCart();
}
console.log(productInCart)


function removeFromCart(indexToRemove){
    productInCart.splice(indexToRemove, 1);
    showNotifications("Product remove from cart!");
    saveCartToLocalStorage();
    openProductCart();
}

function calculateSubtotalPrice(){
    let subtotalPrice = 0;
    for(const product of productInCart){
        subtotalPrice += product.price;
    }
    return subtotalPrice;
}
function renderCart(products, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    document.querySelector('.cart-empty').style.display = (products.length !== 0) ? 'none' : 'flex';

    products.forEach(product => {
        const cartProducts = Handlebars.compile(document.querySelector("#productsInCart").innerHTML);
        const filled = cartProducts({products: [product]});

        const productElement = document.createElement('div');
        productElement.classList.add('cart-product-item');
        productElement.setAttribute('data-id', product.id);
        productElement.innerHTML = filled;

        const productIndex = products.indexOf(product);
        productElement.querySelector('.remove-button').addEventListener('click', () => removeFromCart(productIndex));
        console.log(products)



        container.appendChild(productElement);
    })
    const subtotalPrice = document.querySelector('.subtotal span');
    subtotalPrice.textContent = `${calculateSubtotalPrice()}$`;
}