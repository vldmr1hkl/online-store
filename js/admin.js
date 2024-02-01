import { products } from './products.js';
import {workingProducts, productsData, loadProductsFromLocalStorage, saveProductsToLocalStorage } from './home.js';
import {showNotifications} from './productsCart.js';


const overlay = document.querySelector('.overlay');


renderProductsToEdit(workingProducts, 'edit-product');


const formForCreate = document.querySelector('.form-to-create');
const productNameInput = document.querySelector('input[name="name"]');
const productPriceInput = document.querySelector('input[name="price"]');
const productDescriptionInput = document.querySelector('textarea[name="description"]');
const productMainImage = document.querySelector('input[name="productMainImage"]');
const productAdditionalImage = document.querySelector('input[name="productAdditionalImage"]');
const productNewSelect = document.querySelector('select[name="isThisNew"]');
const selectCategorySelect = document.querySelector('select[name="selectCategory"]');
let maxId = Math.max(...workingProducts.map(obj => obj.id));
const newId = ++maxId;

function createNewProduct() {
    let newProduct = {};
    newProduct = {
      name: productNameInput.value,
      price: parseFloat(productPriceInput.value),
      description: productDescriptionInput.value,
      category: selectCategorySelect.value,
      new: productNewSelect.value === "true",
      imageMain: productMainImage.value,
      imageAdditional: productAdditionalImage.value,
      id: newId

    };
    showNotifications('Product was successfully created!')
    formForCreate.reset();
    workingProducts.push(newProduct);
    localStorage.setItem('productsInStore', JSON.stringify(workingProducts));
    renderProductsToEdit(workingProducts,'edit-product');
}
 
const createProductButton = document.querySelector('input[name="createProductButton"]');
createProductButton.addEventListener('click', function() {
    createNewProduct();
});

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


let newProducts = []
function renderNewProducts() {
    newProducts = productsData.filter(product => product.new === true);
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



function editProduct(productId) {
    let workingProducts = localStorage.getItem('productsInStore')
        ? JSON.parse(localStorage.getItem('productsInStore'))
        : products;
    
    const productIndex = products.findIndex(product => product.id === productId);


    if (productIndex !== -1) {
        const productNameInput = document.querySelector(`.product-item[data-id="${productId}"] input[name="name"]`);
        const productPriceInput = document.querySelector(`.product-item[data-id="${productId}"] input[name="price"]`);
        const productDescriptionInput = document.querySelector(`.product-item[data-id="${productId}"] textarea[name="description"]`);
        const productMainImage = document.querySelector(`.product-item[data-id="${productId}"] input[name="productMainImage"]`);
        const productAdditionalImage = document.querySelector(`.product-item[data-id="${productId}"] input[name="productAdditionalImage"]`);
        const productNewSelect = document.querySelector(`.product-item[data-id="${productId}"] select[name="isThisNew"]`);
        const selectCategorySelect = document.querySelector(`.product-item[data-id="${productId}"] select[name="selectCategory"]`);


        workingProducts[productIndex] = {
            ...workingProducts[productIndex],
            name: productNameInput.value,
            price: parseFloat(productPriceInput.value),
            description: productDescriptionInput.value,
            category: selectCategorySelect.value,
            new: productNewSelect.value === "true",
            imageMain: productMainImage.value,
            imageAdditional: productAdditionalImage.value,
        };

        console.log(productIndex)
        console.log(products[productIndex]);
        
    } else {
        console.log('Object not found');
    }
    showNotifications('Product was successfully edited!')
    overlay.classList.remove('show');
    localStorage.setItem('productsInStore', JSON.stringify(workingProducts));
    renderProductsToEdit(workingProducts,'edit-product');
    console.log(products)
        
}
console.log(products)

function deleteProduct(productId) {
    const productIndex = workingProducts.findIndex(product => product.id === productId);
    workingProducts.splice(productIndex, 1); 
    localStorage.setItem('productsInStore', JSON.stringify(workingProducts));
    console.log(workingProducts);
    renderProductsToEdit(workingProducts,'edit-product');
    overlay.classList.remove('show');
}



function renderProductsToEdit(products, containerId, category) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    products.forEach(product => {
        if (!category || product.category === category) {

            let templateForProductEdit = Handlebars.compile(document.querySelector("#productToEditTemplate").innerHTML);
            let filled = templateForProductEdit({products: [product]});
            
            const productElement = document.createElement('div');
            productElement.classList.add('product-item');
            productElement.setAttribute('data-id', product.id);
            productElement.innerHTML = filled;

            productElement.querySelector('.edit').addEventListener('click', () => {
                productElement.classList.toggle('show');
                overlay.classList.add('show');
            });
            productElement.querySelector('.quick-view-close-button').addEventListener('click', () => {
                productElement.classList.remove('show');
                overlay.classList.remove('show');
            });

            productElement.querySelector('input[name="editProductButton"]').addEventListener('click', () => editProduct(product.id));
            productElement.querySelector('input[name="deleteProductButton"]').addEventListener('click', () => deleteProduct(product.id));

            if (product.new) {
                productElement.classList.add('new');
            }

            container.appendChild(productElement);
            
        }
        
    })
}
