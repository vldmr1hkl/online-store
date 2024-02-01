$(document).ready(function(){
    $('.products-slider').slick({
        arrows:false,
        dots:true,
        autoplay:true,
        autoplaySpeed:3000,
        pauseOnHover:false,
        pauseOnFocus:false

    });
});

import {workingProducts} from './home.js';
import {addToWishList} from './productsWishList.js';
import {addToCard} from './productsCart.js';

function renderProductsSlider() {
    const productsForSlider = workingProducts.filter(product => product.hasOwnProperty('imageForSlider'));
    const container = document.querySelector('.products-slider');

    productsForSlider.forEach(product => {
        const productsSlider = Handlebars.compile(document.querySelector("#productsSlider").innerHTML);
        const filled = productsSlider({productsForSlider: [product]});

        const productElement = document.createElement('div');
        productElement.classList.add('slide-items');
        productElement.setAttribute('data-id', product.id);
        productElement.innerHTML = filled;

        productElement.querySelector('.action-button.like').addEventListener('click', () => addToWishList(product.id));
        productElement.querySelectorAll('.add-to-cart').forEach( button => {
            button.addEventListener('click', () => addToCard(product.id));
        });
        if (product.isActive) {
            productElement.querySelectorAll('.action-button.like').forEach(button => button.classList.add('active'));
        }

        container.appendChild(productElement);
    })
}
renderProductsSlider();