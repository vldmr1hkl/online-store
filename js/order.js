const overlay = document.querySelector('.overlay');
const productInCart = loadCartFromLocalStorage();
function loadCartFromLocalStorage() {
    const productInCart = localStorage.getItem('productInCart');
    return productInCart ? JSON.parse(productInCart) : [];
}
function saveCartToLocalStorage() {
    localStorage.setItem('productInCart', JSON.stringify(productInCart));
}


const cartOpenButton = document.querySelector('.cart-open-button');
const cartCloseButton = document.querySelector('.cart-close-button');
const cartContainer = document.querySelector('.cart-container');

function openProductCart() {
    cartContainer.classList.add('show');
    overlay.classList.add('show');
    renderCart(productInCart, 'products-cart');
}

function closeProductCart() {
    cartContainer.classList.remove('show');
    overlay.classList.remove('show');
}

cartOpenButton.addEventListener('click', openProductCart);
cartCloseButton.addEventListener('click', closeProductCart);


function showNotifications(message){
    const notification = document.querySelector('.notification p');
    notification.style.visibility = 'visible';
    notification.textContent = message;
    setTimeout(() => {
        notification.style.visibility = 'hidden';
    }, 2000);
}


function addToCard(productId) {
    const productIndex = products.findIndex(product => product.id === productId);
    const productItems = document.querySelectorAll('.product-item');

    if (productIndex !== -1) {
        const isInCart = productInCart.some(item => item.id === productId);

        if (!isInCart) {
            productInCart.push(products[productIndex]);
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



        container.appendChild(productElement);
    })
    const subtotalPrice = document.querySelector('.subtotal span');
    subtotalPrice.textContent = `${calculateSubtotalPrice()}$`;
}





let count = 0;

function decreaseCount(productId) {
    const countElement = document.querySelector(`[data-id="${productId}"] .count`);
    const product = productInCart.find(item => item.id === productId);

    if (product.quantity !== 1) {
        product.quantity--;
        product.total = product.quantity * product.price;
        countElement.innerHTML = product.quantity;
        saveCartToLocalStorage();
        renderOrder(productInCart);
        renderOrderCheck(productInCart);
    }
}

console.log(productInCart);

function increaseCount(productId) {
    const countElement = document.querySelector(`[data-id="${productId}"] .count`);
    const product = productInCart.find(item => item.id === productId);

    product.quantity++;
    product.total = product.quantity * product.price;
    countElement.innerHTML = product.quantity;
    saveCartToLocalStorage();
    renderOrder(productInCart);
    renderOrderCheck(productInCart);
}

function renderOrder(productInCart) {
    const container = document.querySelector('.order-product-container');
    container.innerHTML = '';

    productInCart.forEach(product => {
        const cartProducts = Handlebars.compile(document.querySelector("#productsToOrder").innerHTML);
        const filled = cartProducts({products: [product]});

        const productElement = document.createElement('div');
        productElement.classList.add('order-product');
        productElement.setAttribute('data-id', product.id);
        productElement.innerHTML = filled;

        const productIndex = productInCart.indexOf(product);
        productElement.querySelector('.remove-button').addEventListener('click', () => removeFromCart(productIndex));
        
        productElement.querySelector('.minus-btn').addEventListener('click', () => decreaseCount(product.id));
        productElement.querySelector('.plus-btn').addEventListener('click', () => increaseCount(product.id));

        container.appendChild(productElement);
    })
    
}
renderOrder(productInCart);

function renderOrderCheck(productInCart){
    const container = document.querySelector('.order-review table tbody');
    container.innerHTML = '';

    productInCart.forEach(product => {
        const productElement = document.createElement('tr');
        const productName = document.createElement('td');
        const productTolalPrice = document.createElement('td');

        productName.textContent = `${product.name} x ${product.quantity}`;
        productTolalPrice.textContent = `${product.price * product.quantity}$`;

        productElement.appendChild(productName);
        productElement.appendChild(productTolalPrice);

        container.appendChild(productElement);
    })
    const subtotalPrice = document.querySelector('.order-check-subtotal');
    subtotalPrice.textContent = `${calculateSubtotaOrderPrice()}$`;
}
renderOrderCheck(productInCart);

function calculateSubtotaOrderPrice(){
    let subtotalPrice = 0;
    for(const product of productInCart){
        subtotalPrice += product.price * product.quantity;
    }
    return subtotalPrice;
}


const radioInputs = document.querySelectorAll('.payment-method input[type="radio"]');
radioInputs.forEach(input => {
    input.addEventListener('change', function () {
        document.querySelectorAll('.payment-description').forEach(div => {
            div.style.display = 'none';
        });
        const parentLi = this.closest('.payment-method');
        const selectedDescription = parentLi.querySelector('.payment-description');
        if (selectedDescription) {
            selectedDescription.style.display = 'block';
        }
    });
});

console.log(radioInputs)
