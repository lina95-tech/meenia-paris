// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const total = document.getElementById('total');
    if (cartItems) {
        cartItems.innerHTML = '';
        let totalPrice = 0;
        cart.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <p>${item.product} - ${item.price}€ x ${item.quantity}</p>
                <div class="quantity-controls">
                    <button onclick="changeQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${index}, 1)">+</button>
                </div>
                <button onclick="removeFromCart(${index})">Retirer</button>
            `;
            cartItems.appendChild(itemDiv);
            totalPrice += parseFloat(item.price) * item.quantity;
        });
        if (total) total.textContent = totalPrice.toFixed(2) + '€';
    }
    updateCartCount();
    localStorage.setItem('cart', JSON.stringify(cart));
}

function changeQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    updateCartDisplay();
}

function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(element => {
        element.textContent = cart.length;
    });
}

function addToCart(product, price) {
    cart.push({ product, price });
    updateCartDisplay();
    alert(`${product} ajouté au panier!`);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

// Search functionality
function searchProducts(query) {
    const products = document.querySelectorAll('.product');
    if (products.length > 0) {
        // On shop or index pages
        products.forEach(product => {
            const title = product.querySelector('h3').textContent.toLowerCase();
            if (title.includes(query.toLowerCase())) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    } else {
        // On other pages, redirect to shop with search
        window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
    }
}

// Wishlist functionality
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

function addToWishlist(product) {
    if (!wishlist.includes(product)) {
        wishlist.push(product);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        alert(`${product} ajouté à la liste de souhaits!`);
    } else {
        alert(`${product} est déjà dans la liste de souhaits!`);
    }
}

function displayWishlist() {
    const wishlistContainer = document.getElementById('wishlist-items');
    if (wishlistContainer) {
        wishlistContainer.innerHTML = '';
        wishlist.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `<p>${item}</p>`;
            wishlistContainer.appendChild(itemDiv);
        });
    }
}

// User login simulation
let isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn')) || false;

function login() {
    const username = prompt('Entrez votre nom d\'utilisateur:');
    if (username) {
        isLoggedIn = true;
        localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
        alert(`Bienvenue, ${username}!`);
        updateUserStatus();
    }
}

function logout() {
    isLoggedIn = false;
    localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
    alert('Déconnecté.');
    updateUserStatus();
}

function updateUserStatus() {
    const userStatus = document.getElementById('user-status');
    if (userStatus) {
        userStatus.textContent = isLoggedIn ? 'Connecté' : 'Non connecté';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
    displayWishlist();
    updateUserStatus();

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const product = button.getAttribute('data-product');
            const price = button.getAttribute('data-price');
            addToCart(product, price);
        });
    });

    // Add to wishlist buttons
    document.querySelectorAll('.add-to-wishlist').forEach(button => {
        button.addEventListener('click', () => {
            const product = button.getAttribute('data-product');
            addToWishlist(product);
        });
    });

    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', () => {
            searchProducts(searchInput.value);
        });
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                searchProducts(searchInput.value);
            }
        });
    }

    // Checkout
    const checkoutBtn = document.getElementById('checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Votre panier est vide!');
            } else {
                window.location.href = 'checkout.html';
            }
        });
    }

    // Login/Logout buttons (assuming they exist in HTML)
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', login);
    }
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Product details modal
    const modal = document.getElementById('product-modal');
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = 'none';
        }
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    document.querySelectorAll('.details-btn').forEach(button => {
        button.addEventListener('click', () => {
            const product = button.getAttribute('data-product');
            showProductModal(product);
        });
    });

    // Newsletter signup
    const newsletterBtn = document.getElementById('newsletter-btn');
    if (newsletterBtn) {
        newsletterBtn.addEventListener('click', () => {
            const email = document.getElementById('newsletter-email').value;
            if (email) {
                alert('Merci pour votre inscription à la newsletter!');
            } else {
                alert('Veuillez entrer une adresse email valide.');
            }
        });
    }

    // Product page functionality
    if (window.location.pathname.includes('product.html')) {
        loadProductDetails();
    }

    // Cart page functionality
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
    }
});

// Product data for modal
const productData = {
    'Bijou 1': {
        description: 'Un magnifique bijou artisanal marocain, parfait pour ajouter une touche d\'élégance à votre tenue.',
        reviews: ['Excellent produit!', 'Très belle qualité.']
    },
    'Bijou 2': {
        description: 'Ce bijou unique est fabriqué à la main avec des matériaux de qualité supérieure.',
        reviews: ['Superbe!', 'Je recommande.']
    },
    'Caftan Marocain 1': {
        description: 'Un caftan traditionnel marocain, symbole de l\'artisanat local.',
        reviews: ['Magnifique!', 'Très confortable.']
    },
    'Caftan Marocain 2': {
        description: 'Élégant et raffiné, ce caftan est idéal pour les occasions spéciales.',
        reviews: ['Parfait!', 'Belle finition.']
    },
    'Caftan Marocain 3': {
        description: 'Un caftan moderne avec des touches traditionnelles.',
        reviews: ['J\'adore!', 'Très stylé.']
    },
    'Caftan Marocain 4': {
        description: 'Fabriqué avec soin, ce caftan représente l\'excellence artisanale.',
        reviews: ['Exceptionnel!', 'Qualité premium.']
    },
    'Caftan Marocain 5': {
        description: 'Un caftan unique avec des motifs exquis.',
        reviews: ['Superbe!', 'Très élégant.']
    },
    'Caftan Marocain 6': {
        description: 'Ce caftan est un must-have pour votre garde-robe.',
        reviews: ['Fantastique!', 'Très satisfait.']
    },
    'Brocard 1': {
        description: 'Un tissu brocard de qualité supérieure, parfait pour la couture.',
        reviews: ['Excellent tissu!', 'Très durable.']
    },
    'Brocard 2': {
        description: 'Ce brocard est idéal pour créer des pièces uniques.',
        reviews: ['Belle qualité!', 'Très polyvalent.']
    },
    'Brocard 3': {
        description: 'Un brocard traditionnel avec des motifs complexes.',
        reviews: ['Magnifique!', 'Artisanat de qualité.']
    }
};

function showProductModal(product) {
    const modal = document.getElementById('product-modal');
    const title = document.getElementById('modal-title');
    const image = document.getElementById('modal-image');
    const description = document.getElementById('modal-description');
    const reviews = document.getElementById('modal-reviews');
    const addToCartBtn = document.getElementById('modal-add-to-cart');

    title.textContent = product;
    image.src = getProductImage(product);
    image.alt = product;
    description.textContent = productData[product]?.description || 'Description non disponible.';
    
    reviews.innerHTML = '<h3>Avis clients:</h3>';
    if (productData[product]?.reviews) {
        productData[product].reviews.forEach(review => {
            reviews.innerHTML += `<p>"${review}"</p>`;
        });
    } else {
        reviews.innerHTML += '<p>Aucun avis pour le moment.</p>';
    }

    addToCartBtn.onclick = () => {
        const price = getProductPrice(product);
        addToCart(product, price);
        modal.style.display = 'none';
    };

    modal.style.display = 'block';
}

function getProductImage(product) {
    const imageMap = {
        'Bijou 1': '23.jpg',
        'Bijou 2': '24.jpg',
        'Caftan Marocain 1': 'CAFTAN MAROCAIN 1.jpeg',
        'Caftan Marocain 2': 'CAFTAN MAROCAIN 2.jpeg',
        'Caftan Marocain 3': 'CAFTAN MAROCAIN 3.jpeg',
        'Caftan Marocain 4': 'CAFTAN MAROCAIN 4.jpeg',
        'Caftan Marocain 5': 'CAFTAN MAROCAIN 5.jpeg',
        'Caftan Marocain 6': 'CAFTAN MAROCAIN 6.jpeg',
        'Brocard 1': '25.jpg',
        'Brocard 2': '26.jpg',
        'Brocard 3': '28.jpg'
    };
    return imageMap[product] || '';
}

function getProductPrice(product) {
    const priceMap = {
        'Bijou 1': '50',
        'Bijou 2': '60',
        'Caftan Marocain 1': '100',
        'Caftan Marocain 2': '110',
        'Caftan Marocain 3': '120',
        'Caftan Marocain 4': '130',
        'Caftan Marocain 5': '140',
        'Caftan Marocain 6': '150',
        'Brocard 1': '70',
        'Brocard 2': '80',
        'Brocard 3': '90'
    };
    return priceMap[product] || '0';
}

// Product page functionality
function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const products = [
        { id: 1, name: 'Caftan Élégant Nouveau', price: 150, category: 'nouveau', image: 'https://via.placeholder.com/600x600?text=Caftan+Nouveau', description: 'Un caftan moderne avec des touches traditionnelles. Fabriqué avec des tissus de qualité supérieure, ce caftan offre un confort exceptionnel et un style élégant pour toutes les occasions.' },
        { id: 2, name: 'Brocard Moderne', price: 120, category: 'brocard', image: 'https://via.placeholder.com/600x600?text=Brocard+Moderne', description: 'Tissu brocard de qualité supérieure, parfait pour créer des pièces uniques. Idéal pour les couturiers et les amateurs de mode.' },
        { id: 3, name: 'Bijoux Traditionnel', price: 80, category: 'bijoux', image: 'https://via.placeholder.com/600x600?text=Bijoux+Traditionnel', description: 'Bijoux artisanaux marocains, fabriqués à la main avec des matériaux précieux. Ajoutez une touche d\'élégance à votre tenue.' },
        { id: 4, name: 'Caftan Traditionnel', price: 180, category: 'caftan', image: 'https://via.placeholder.com/600x600?text=Caftan+Traditionnel', description: 'Caftan authentique marocain, symbole de l\'artisanat local. Confectionné selon les traditions ancestrales.' },
        { id: 5, name: 'Caftan Moderne', price: 160, category: 'caftan', image: 'https://via.placeholder.com/600x600?text=Caftan+Moderne', description: 'Caftan fusion moderne, alliant tradition et contemporanéité. Parfait pour un look sophistiqué.' },
        { id: 6, name: 'Caftan Festif', price: 200, category: 'caftan', image: 'https://via.placeholder.com/600x600?text=Caftan+Festif', description: 'Caftan parfait pour les occasions spéciales. Motifs exquis et finitions de qualité premium.' },
        { id: 7, name: 'Brocard Classique', price: 100, category: 'brocard', image: 'https://via.placeholder.com/600x600?text=Brocard+Classique', description: 'Brocard traditionnel avec des motifs complexes. Idéal pour la création de vêtements haut de gamme.' },
        { id: 8, name: 'Bijoux Moderne', price: 90, category: 'bijoux', image: 'https://via.placeholder.com/600x600?text=Bijoux+Moderne', description: 'Bijoux contemporains inspirés des traditions marocaines. Design moderne et matériaux de qualité.' },
        { id: 9, name: 'Caftan Soirée', price: 220, category: 'caftan', image: 'https://via.placeholder.com/600x600?text=Caftan+Soirée', description: 'Caftan élégant pour soirées. Coupe impeccable et tissus luxueux pour un look glamour.' },
        { id: 10, name: 'Brocard Luxe', price: 140, category: 'brocard', image: 'https://via.placeholder.com/600x600?text=Brocard+Luxe', description: 'Brocard de luxe avec des finitions exceptionnelles. Parfait pour les créations haut de gamme.' }
    ];

    const product = products.find(p => p.id == productId);
    if (product) {
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-price').textContent = product.price + '€';
        document.getElementById('product-image').src = product.image;
        document.getElementById('product-image').alt = product.name;
        document.getElementById('product-description').textContent = product.description;

        // Add to cart functionality for product page
        document.getElementById('add-to-cart-large').addEventListener('click', () => {
            const quantity = parseInt(document.getElementById('quantity').value);
            for (let i = 0; i < quantity; i++) {
                addToCart(product.name, product.price);
            }
        });
    }
}

// Cart page functionality
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('total');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        checkoutBtn.style.display = 'none';
        emptyCartMessage.style.display = 'block';
        return;
    }

    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;

    cart.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div class="cart-item-info">
                <h3>${item.product}</h3>
                <p>Prix: ${item.price}€</p>
                <div class="quantity-controls">
                    <button onclick="changeQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${index}, 1)">+</button>
                </div>
            </div>
            <div class="cart-item-total">
                <p>${(parseFloat(item.price) * item.quantity).toFixed(2)}€</p>
                <button onclick="removeFromCart(${index})" class="remove-btn">Retirer</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemDiv);
        totalPrice += parseFloat(item.price) * item.quantity;
    });

    cartTotal.textContent = totalPrice.toFixed(2) + '€';
}
