import {products} from './products.js';
import {addToWishList} from './productsWishList.js';
import {addToCard} from './productsCart.js';

let workingProducts = localStorage.getItem('productsInStore')
        ? JSON.parse(localStorage.getItem('productsInStore'))
        : products;

const productsData = loadProductsFromLocalStorage();

function loadProductsFromLocalStorage() {
  const storedProducts = localStorage.getItem('productsInStore');
  return storedProducts ? JSON.parse(storedProducts) : [];
}

function saveProductsToLocalStorage() {
      localStorage.setItem('productsInStore', JSON.stringify(workingProducts));
};

export {
    workingProducts,
    productsData,
    loadProductsFromLocalStorage,
    saveProductsToLocalStorage
};



const overlay = document.querySelector('.overlay');
const newProducts = workingProducts.filter(product => product.new === true);
console.log(newProducts);

function renderProducts(products, containerId, category) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id '${containerId}' not found.`);
        return;
    }

    container.innerHTML = '';

    products.forEach(product => {
        if (!category || product.category === category) {
            const storeProducts = Handlebars.compile(document.querySelector("#newArrivals").innerHTML);
            const filled = storeProducts({products: [product]});

            const productElement = document.createElement('div');
            productElement.classList.add('product-item');
            productElement.setAttribute('data-id', product.id);
            productElement.innerHTML = filled;

            productElement.querySelectorAll('.action-button.like').forEach( button => {
                button.addEventListener('click', () => addToWishList(product.id));
            });
            productElement.querySelectorAll('.add-to-cart').forEach( button => {
                button.addEventListener('click', () => addToCard(product.id));
            });
            if (product.new) {
                productElement.classList.add('new');
            };
            if (product.isActive) {
                productElement.querySelectorAll('.action-button.like').forEach(button => button.classList.add('active'));
            }
            container.appendChild(productElement);
        }
    });
    
}
renderProducts(newProducts, 'newArrivalsContainer')
