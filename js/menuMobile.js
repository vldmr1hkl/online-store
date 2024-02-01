const burgerMenuButtonContainer = document.querySelector('.burger-menu-button-container');
const burgerMenuButton = document.querySelector('.burger-menu-button');
burgerMenuButtonContainer.addEventListener('click', function() {
    burgerMenuButton.classList.toggle('active');
});