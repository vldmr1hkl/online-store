import {workingProducts} from './home.js';
console.log(workingProducts);
import {addToWishList} from './productsWishList.js';
import {addToCard} from './productsCart.js';


const overlay = document.querySelector('.overlay');


export function renderProducts(products, containerId, category) {
    
    const container = document.getElementById(containerId);
    if (!container) {
        console.log(`Container with id '${containerId}' not found.`);
        return;
    }

    container.innerHTML = '';

    products.forEach(product => {
        if (!category || product.category === category) {
            const storeProducts = Handlebars.compile(document.querySelector("#storeProducts").innerHTML);
            const filled = storeProducts({products: [product]});

            const productElement = document.createElement('div');
            productElement.classList.add('product-item');
            productElement.setAttribute('data-id', product.id);
            productElement.innerHTML = filled;

            productElement.querySelector('.see').addEventListener('click', () => {
                productElement.classList.toggle('show');
                overlay.classList.add('show');
            });
            productElement.querySelector('.quick-view-close-button').addEventListener('click', () => {
                productElement.classList.remove('show');
                overlay.classList.remove('show');
            });
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
renderProducts(workingProducts, 'allProductsContainer');


let currentProductsByCategory = []; 
function renderProductsByCategory(category) {
    currentProductsByCategory = workingProducts.filter(product => product.category === category);
    if (document.getElementById('allProductsContainer')) {
        renderProducts(currentProductsByCategory, 'allProductsContainer');
        sortSelect.selectedIndex = 0;
    } else  if (document.getElementById('edit-product')) {
        renderProductsToEdit(currentProductsByCategory, 'edit-product');
    }  else {
        console.log("Container not found")
    }
};
document.querySelectorAll('.category-selection').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelectorAll('.category-selection').forEach(el => {
            el.classList.remove('active');
        });
        this.classList.add('active');
        const category = this.dataset.category;
        renderProductsByCategory(category);
    });
});

document.querySelector('[data-category="All"]').addEventListener('click', () => {
    renderProducts(workingProducts, 'allProductsContainer');
});

let newProducts = []
function renderNewProducts() {
    newProducts = workingProducts.filter(product => product.new === true);
    if (document.getElementById('allProductsContainer')) {
        renderProducts(newProducts, 'allProductsContainer');
        sortSelect.selectedIndex = 0;
    } else  if (document.getElementById('edit-product')) {
        renderProductsToEdit(newProducts,'edit-product');
    }  else {
        console.log("Container not found")
    }
}; 
document.getElementById('newProduct').addEventListener('click', function() {
    renderNewProducts();
});


const sortSelect = document.getElementById('sortSelect');
sortSelect.addEventListener('change', function () {
    const selectedValue = this.value;
    let productsToRender;
    if (currentProductsByCategory.length === 0 && newProducts.length === 0) {
        productsToRender = workingProducts;
    } else if (currentProductsByCategory.length > 0) {
        productsToRender = currentProductsByCategory;
    } else {
        productsToRender = newProducts;
    }
    if (selectedValue === 'lowToHigh') {
        const sortedProducts = productsToRender.slice().sort((a, b) => a.price - b.price);
        renderProducts(sortedProducts, 'allProductsContainer');
    } else if (selectedValue === 'highToLow') {
        const sortedProducts = productsToRender.slice().sort((a, b) => b.price - a.price);
        renderProducts(sortedProducts, 'allProductsContainer');
    } else {
        renderProducts(productsToRender, 'allProductsContainer');
    }
});


let searchInput = document.getElementById("search"); 
function search() {
    const searchValue = searchInput.value.toLowerCase();
    const suggestionsContainer = document.getElementById('suggestions');
    const matchingProducts = [];
    suggestionsContainer.innerHTML = ''; // Очищення попередніх підказок
    for (let i = 0; i < workingProducts.length; i += 1) {
        const productName = workingProducts[i].name.toLowerCase();
        if (productName.includes(searchValue)) {
            matchingProducts.push(workingProducts[i]);
            const suggestionElement = document.createElement('li');
            suggestionElement.textContent = workingProducts[i].name;
            suggestionElement.addEventListener('click', function () {
                searchInput.value = workingProducts[i].name;
                suggestionsContainer.innerHTML = '';
                search();
                suggestionsContainer.style.display = 'none';
            });
            suggestionsContainer.appendChild(suggestionElement);
        }
    }
    if (searchValue.length > 0) {
        suggestionsContainer.style.display = 'block';
    } else {
        suggestionsContainer.style.display = 'none';
    }
    renderProducts(matchingProducts, 'allProductsContainer');
}
searchInput.addEventListener('input', search);


