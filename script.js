const response = await fetch('data.json');
const data = await response.json();

const itemsAddedContainer = document.querySelector('.items-added');
const cartTitle = document.querySelector('.cart-container h1');
const imgEmpty = document.querySelector('.img-content');
const totalOrder = document.querySelector('.total-order');
const infoCarbon = document.querySelector('.carbon-info');
const btnOrder = document.querySelector('.order');
const listProduct = document.querySelector('.list-product');

let cart = []; 

// Parcourir les produits et générer les cartes de produits
data.forEach(item => {
    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('card');
    cardWrapper.dataset.id = item.id;

    // Image du produit
    const itemImg = document.createElement('img');
    itemImg.classList.add('item-img');
    itemImg.src = item.image.desktop;
    itemImg.alt = item.name;
    cardWrapper.appendChild(itemImg);

    // Bouton "Add to Cart"
    const addBtn = createAddToCartButton(item);
    cardWrapper.appendChild(addBtn);

    // Infos produit
    const itemInfo = document.createElement('div');
    itemInfo.classList.add('item-info');
    cardWrapper.appendChild(itemInfo);

    const itemCategory = document.createElement('p');
    itemCategory.textContent = item.category;
    itemInfo.appendChild(itemCategory);

    const itemTitle = document.createElement('h2');
    itemTitle.textContent = item.name;
    itemInfo.appendChild(itemTitle);

    const itemPrice = document.createElement('span');
    itemPrice.textContent = `$${item.price.toFixed(2)}`;
    itemInfo.appendChild(itemPrice);

    listProduct.appendChild(cardWrapper);
});

// Fonction pour ajouter ou enlever la sélection
function toggleSelection(cardWrapper, add) {
    if (add) {
        cardWrapper.classList.add('selected');
    } else {
        cardWrapper.classList.remove('selected');
    }
}

// Création du bouton "Add to Cart" avec gestion des événements
function createAddToCartButton(item) {
    const addBtn = document.createElement('button');
    addBtn.classList.add('add-btn');

    const imgBtn = document.createElement('img');
    imgBtn.src = './assets/images/icon-add-to-cart.svg';
    addBtn.appendChild(imgBtn);

    const textBtn = document.createElement('p');
    textBtn.textContent = 'Add to Cart';
    addBtn.appendChild(textBtn);

    addBtn.addEventListener('click', () => {
        const cardWrapper = document.querySelector(`.card[data-id="${item.id}"]`);
        toggleSelection(cardWrapper, true); 


        let cartItem = cart.find(cartItem => cartItem.id === item.id);

        if (cartItem != null) {
            cartItem.quantity++;
        } else {
            cartItem = { ...item, quantity: 1 };
            cart.push(cartItem);
        }

        renderCart();
        checkCartEmpty();

        // Remplacer le bouton "Add to Cart" par les boutons +/-
        cardWrapper.replaceChild(createQtyButtons(cartItem, cardWrapper), addBtn);
    });

    return addBtn;
}

// Création des boutons +/-
function createQtyButtons(cartItem) {
    const btnQty = document.createElement('div');
    btnQty.classList.add('btn-qty');

    const divBtnMinus = document.createElement('div');
    divBtnMinus.classList.add('divBtnMinus');
    btnQty.appendChild(divBtnMinus);

    const btnMinus = document.createElement('img');
    btnMinus.src = './assets/images/icon-decrement-quantity.svg';
    btnMinus.classList.add('btn-minus');
    divBtnMinus.appendChild(btnMinus);

    const quantityDisplay = document.createElement('span');
    quantityDisplay.classList.add('quantity-display');
    quantityDisplay.textContent = cartItem.quantity;
    btnQty.appendChild(quantityDisplay);

    const divBtnPlus = document.createElement('div');
    divBtnPlus.classList.add('divBtnPlus');
    btnQty.appendChild(divBtnPlus);

    const btnPlus = document.createElement('img');
    btnPlus.src = './assets/images/icon-increment-quantity.svg';
    btnPlus.classList.add('btn-plus');
    divBtnPlus.appendChild(btnPlus);


    // Gestion des clics sur les boutons +/-
    btnPlus.addEventListener('click', () => {
        cartItem.quantity++;
        quantityDisplay.textContent = cartItem.quantity;
        renderCart();
    });

    btnMinus.addEventListener('click', () => {
        if (cartItem.quantity > 1) {
            cartItem.quantity--;
        } else {
            removeFromCart(cartItem.id);
        }
        quantityDisplay.textContent = cartItem.quantity;
        renderCart();
        checkCartEmpty();
    });

    return btnQty;
}

// Vérifier si le panier est vide

function checkCartEmpty() {
    const itemsCart = itemsAddedContainer.querySelectorAll('.select-item');
    if (itemsCart.length === 0) {
        imgEmpty.style.display = 'flex';
        totalOrder.classList.add('display');
        infoCarbon.classList.add('display');
        btnOrder.classList.add('display');
    } else {
        imgEmpty.style.display = 'none';
        totalOrder.classList.remove('display');
        infoCarbon.classList.remove('display');
        btnOrder.classList.remove('display');
    }
}

function autoGrow() {
    const cartContainer = document.querySelector('.cart-container');
    cartContainer.style.height = '299px';
    cartContainer.style.height = cartContainer.scrollHeight + 'px';

}

// Affichage du contenu du panier
function renderCart() {
    itemsAddedContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const selectItem = document.createElement('div');
        selectItem.classList.add('select-item');
        itemsAddedContainer.appendChild(selectItem);

        const infoSelectItem = document.createElement('div');
        infoSelectItem.classList.add('select-item-info');
        selectItem.appendChild(infoSelectItem);

        const itemName = document.createElement('h3');
        itemName.textContent = item.name;
        infoSelectItem.appendChild(itemName);

        const itemDetails = document.createElement('div');
        itemDetails.classList.add('item-details');
        infoSelectItem.appendChild(itemDetails);

        const itemQuantity = document.createElement('p');
        itemQuantity.textContent = `${item.quantity}x`;
        itemQuantity.classList.add('item-quantity');
        itemDetails.appendChild(itemQuantity);

        const itemPrice = document.createElement('p');
        itemPrice.textContent = `@ $${item.price.toFixed(2)}`;
        itemPrice.classList.add('item-price');
        itemDetails.appendChild(itemPrice);

        const itemTotalPrice = document.createElement('p');
        itemTotalPrice.textContent = `$${(item.price * item.quantity).toFixed(2)}`;
        itemTotalPrice.classList.add('item-total-price');
        itemDetails.appendChild(itemTotalPrice);

        const divIcon = document.createElement('div');
        divIcon.classList.add('divIcon');
        const removeIcon = document.createElement('img');
        removeIcon.src = './assets/images/icon-remove-item.svg';
        removeIcon.classList.add('icon-remove');
        divIcon.appendChild(removeIcon);
        infoSelectItem.appendChild(divIcon);

        const separator = document.createElement('div');
        separator.classList.add('item-separator');
        itemsAddedContainer.appendChild(separator);

        removeIcon.addEventListener('click', () => {
            removeFromCart(item.id);
        });

        total += item.price * item.quantity;
    });

    
    totalOrder.querySelector('span').textContent = `$${total.toFixed(2)}`;
    cartTitle.textContent = `Your Cart (${cart.length})`;

   
    autoGrow();
}




// Suppression d'un article du panier
function removeFromCart(itemId) {
    const cardWrapper = document.querySelector(`.card[data-id="${itemId}"]`);

    cart = cart.filter(cartItem => cartItem.id !== itemId);

    const btnQty = cardWrapper.querySelector('.btn-qty');
    if (btnQty !== null) {
        btnQty.remove();
    }

    const addBtn = createAddToCartButton(data.find(item => item.id === itemId));
    cardWrapper.appendChild(addBtn);

    // Retirer la sélection (retirer la bordure)
    toggleSelection(cardWrapper, false);

    renderCart();
    checkCartEmpty();
}

/*MODAL*/



function showModal() {

    let total = 0;

    const popUpBackground = document.querySelector('.popUpBackground');
    const itemsOrder = document.querySelector('.itemsOrder');
    itemsOrder.innerHTML = '';

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('modal-items');
    itemsOrder.appendChild(itemDiv);

    const modalTotalOrder = document.createElement('div');
    modalTotalOrder.classList.add('modal-total-order');
    itemsOrder.appendChild(modalTotalOrder);

    const modalOrderTotal = document.createElement('p');
    modalOrderTotal.textContent = 'Order Total';
    modalTotalOrder.appendChild(modalOrderTotal);

    const modalOrderTotalPrice = document.createElement('span');
    modalTotalOrder.appendChild(modalOrderTotalPrice);
    
    


    cart.forEach(item => {

        const itemConfirmed = document.createElement('div');
        itemConfirmed.classList.add('modal-item-confirmed');
        itemDiv.appendChild(itemConfirmed);

        const itemContent = document.createElement('div');
        itemContent.classList.add('modal-item-content');
        itemConfirmed.appendChild(itemContent);
        
        const itemImg = document.createElement('img');
        itemImg.src = item.image.desktop;
        itemImg.alt = item.name;
        itemImg.classList.add('modal-item-img');
        itemContent.appendChild(itemImg);

        const itemText = document.createElement('div');
        itemText.classList.add('modal-item-text');
        itemContent.appendChild(itemText);

        const itemName = document.createElement('h3');
        itemName.textContent = item.name;
        itemText.appendChild(itemName);

        const itemAmount = document.createElement('div');
        itemAmount.classList.add('modal-item-amount');
        itemText.appendChild(itemAmount);

        const modalItemQuantity = document.createElement('p');
        modalItemQuantity.textContent = `${item.quantity}x`;
        modalItemQuantity.classList.add('modal-item-quantity');
        itemAmount.appendChild(modalItemQuantity);

        const modalItemPrice = document.createElement('p');
        modalItemPrice.textContent = `@ $${item.price.toFixed(2)}`;
        modalItemPrice.classList.add('modal-item-price');
        itemAmount.appendChild(modalItemPrice);

        const modalItemTotalPrice = document.createElement('p');
        modalItemTotalPrice.textContent = `$${(item.price * item.quantity).toFixed(2)}`;
        modalItemTotalPrice.classList.add('modalItemTotalPrice');
        itemConfirmed.appendChild(modalItemTotalPrice);

        const modalSeparator = document.createElement('div');
        modalSeparator.classList.add('modal-item-separator');
        itemDiv.appendChild(modalSeparator);
       

        total += item.price * item.quantity;
        
    });

    modalTotalOrder.querySelector('span').textContent = `$${total.toFixed(2)}`;
    
    
    popUpBackground.classList.add('active');
}


btnOrder.addEventListener('click', () => {
    showModal();
});


function resetApp() {
   
    cart = [];
    renderCart();
    checkCartEmpty();

 
    document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('selected'); 
        const btnQty = card.querySelector('.btn-qty');
        if (btnQty != null) {
        btnQty.remove(); 
}

       
        const itemId = card.dataset.id;
        const itemData = data.find(item => item.id == itemId);
        if (itemData) {
            card.querySelector('.add-btn')?.remove(); 
            card.appendChild(createAddToCartButton(itemData));
        }
    });

    document.querySelector('.popUpBackground').classList.remove('active');
}

document.querySelector('.newOrder').addEventListener('click', resetApp);









