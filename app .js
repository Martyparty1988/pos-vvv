import { StorageManager, STORAGE_KEYS } from './storage.js';
import { InputValidator } from './validation.js';
import { PDFExporter } from './pdfExport.js';

// Globální stav aplikace
const state = {
    cart: [],
    products: []
};

// Inicializace aplikace
document.addEventListener('DOMContentLoaded', () => {
    // Načtení uložených dat
    loadSavedData();
    
    // Inicializace event listenerů
    initializeEventListeners();
    
    // Kontrola podpory Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registrován:', registration);
            })
            .catch(error => {
                console.error('Chyba při registraci Service Workeru:', error);
            });
    }
});

// Načtení uložených dat
function loadSavedData() {
    // Načtení košíku
    const savedCart = StorageManager.getData(STORAGE_KEYS.CART);
    if (savedCart) {
        state.cart = savedCart;
        updateCartDisplay();
    }
    
    // Načtení produktů
    const savedProducts = StorageManager.getData(STORAGE_KEYS.INVENTORY);
    if (savedProducts) {
        state.products = savedProducts;
        updateProductsDisplay();
    }
}

// Inicializace event listenerů
function initializeEventListeners() {
    // Košík
    document.getElementById('checkout-btn').addEventListener('click', handleCheckout);
    
    // Vyhledávání produktů
    document.getElementById('product-search').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterProducts(searchTerm);
    });
    
    // Export do PDF
    document.getElementById('export-pdf-btn').addEventListener('click', () => {
        const pdfExporter = new PDFExporter();
        pdfExporter.exportInventory(state.products, {
            fileName: `sklad_${new Date().toISOString().split('T')[0]}.pdf`
        });
    });
}

// Přidání produktu do košíku
function addToCart(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product || product.stock <= 0) return;

    const cartItem = state.cart.find(item => item.id === productId);
    
    if (cartItem) {
        if (cartItem.quantity < product.stock) {
            cartItem.quantity++;
        } else {
            alert('Není dostatek zboží na skladě');
            return;
        }
    } else {
        state.cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    // Uložení košíku
    StorageManager.saveData(STORAGE_KEYS.CART, state.cart);
    updateCartDisplay();
}

// Dokončení objednávky
function handleCheckout() {
    if (state.cart.length === 0) {
        alert('Košík je prázdný');
        return;
    }

    // Kontrola dostupnosti zboží
    const invalidItems = state.cart.filter(item => {
        const product = state.products.find(p => p.id === item.id);
        return !product || product.stock < item.quantity;
    });

    if (invalidItems.length > 0) {
        alert('Některé položky již nejsou dostupné v požadovaném množství');
        return;
    }

    // Aktualizace skladu
    state.cart.forEach(item => {
        const product = state.products.find(p => p.id === item.id);
        if (product) {
            product.stock -= item.quantity;
        }
    });

    // Uložení změn
    StorageManager.saveData(STORAGE_KEYS.INVENTORY, state.products);
    
    // Vyčištění košíku
    state.cart = [];
    StorageManager.saveData(STORAGE_KEYS.CART, state.cart);
    
    // Aktualizace UI
    updateCartDisplay();
    updateProductsDisplay();
    
    alert('Objednávka byla úspěšně dokončena');
}

// Aktualizace zobrazení košíku
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    cartItems.innerHTML = '';
    
    let total = 0;
    
    state.cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        
        const price = item.price * item.quantity;
        total += price;
        
        itemElement.innerHTML = `
            <span>${item.name}</span>
            <span>${item.quantity} ks</span>
            <span>${price} Kč</span>
            <button class="remove-item" data-id="${item.id}">×</button>
        `;
        
        cartItems.appendChild(itemElement);
    });
    
    cartTotal.textContent = `${total} Kč`;
    
    // Event listenery pro odstranění položek
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            removeFromCart(id);
        });
    });
}

// Odstranění položky z košíku
function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    StorageManager.saveData(STORAGE_KEYS.CART, state.cart);
    updateCartDisplay();
}

// Filtrování produktů
function filterProducts(searchTerm) {
    const filteredProducts = state.products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.id.toString().includes(searchTerm)
    );
    
    updateProductsDisplay(filteredProducts);
}

// Aktualizace zobrazení produktů
function updateProductsDisplay(productsToShow = state.products) {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        
        productElement.innerHTML = `
            <h3>${product.name}</h3>
            <p class="price">${product.price} Kč</p>
            <p class="stock">Skladem: ${product.stock} ks</p>
            <button class="add-to-cart" ${product.stock <= 0 ? 'disabled' : ''}>
                ${product.stock <= 0 ? 'Vyprodáno' : 'Přidat do košíku'}
            </button>
        `;
        
        if (product.stock > 0) {
            productElement.querySelector('.add-to-cart').addEventListener('click', () => {
                addToCart(product.id);
            });
        }
        
        productsGrid.appendChild(productElement);
    });
}