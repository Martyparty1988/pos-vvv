import { StorageManager, STORAGE_KEYS } from './storage.js';
import { InputValidator } from './validation.js';
import { PDFExporter } from './pdfExport.js';

const state = {
  cart: [],
  products: []
};

// Načteme aktuální vilu (default: "oh-yeah")
const currentVilla = localStorage.getItem(STORAGE_KEYS.CURRENT_VILLA) || 'oh-yeah';

document.addEventListener('DOMContentLoaded', () => {
  loadSavedData();
  initializeEventListeners();
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
      .then(registration => {
        console.log('Service Worker registrován:', registration);
      })
      .catch(error => {
        console.error('Chyba při registraci Service Workeru:', error);
      });
  }
});

function loadSavedData() {
  const savedCart = StorageManager.getData(STORAGE_KEYS.CART);
  if (savedCart) {
    state.cart = savedCart;
    updateCartDisplay();
  }
  
  // Inventář je nyní uložen jako objekt; načteme produkty pro aktuální vilu
  const savedInventory = StorageManager.getData(STORAGE_KEYS.INVENTORY);
  if (savedInventory && savedInventory[currentVilla]) {
    state.products = savedInventory[currentVilla];
    updateProductsDisplay();
  }
}

function initializeEventListeners() {
  document.getElementById('checkout-btn').addEventListener('click', handleCheckout);
  document.getElementById('product-search').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    filterProducts(searchTerm);
  });
  document.getElementById('export-pdf-btn').addEventListener('click', () => {
    const pdfExporter = new PDFExporter();
    pdfExporter.exportInventory(state.products, {
      fileName: `sklad_${new Date().toISOString().split('T')[0]}.pdf`
    });
  });
}

function addToCart(productName) {
  const product = state.products.find(p => p.name === productName);
  if (!product) return;
  
  const cartItem = state.cart.find(item => item.name === productName);
  if (cartItem) {
    cartItem.quantity++;
  } else {
    state.cart.push({
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }
  
  StorageManager.saveData(STORAGE_KEYS.CART, state.cart);
  updateCartDisplay();
}

function handleCheckout() {
  if (state.cart.length === 0) {
    alert('Košík je prázdný');
    return;
  }
  state.cart = [];
  StorageManager.saveData(STORAGE_KEYS.CART, state.cart);
  updateCartDisplay();
  alert('Objednávka byla úspěšně dokončena');
}

function updateCartDisplay() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  
  cartItems.innerHTML = '';
  let total = 0;
  
  state.cart.forEach(item => {
    const price = item.price * item.quantity;
    total += price;
    
    const itemElement = document.createElement('div');
    itemElement.className = 'cart-item';
    itemElement.innerHTML = `
      <span>${item.name}</span>
      <span>${item.quantity} ks</span>
      <span>${price} Kč</span>
      <button class="remove-item" data-name="${item.name}">×</button>
    `;
    cartItems.appendChild(itemElement);
  });
  
  cartTotal.textContent = `${total} Kč`;
  
  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', (e) => {
      const name = e.target.dataset.name;
      removeFromCart(name);
    });
  });
}

function removeFromCart(productName) {
  state.cart = state.cart.filter(item => item.name !== productName);
  StorageManager.saveData(STORAGE_KEYS.CART, state.cart);
  updateCartDisplay();
}

function filterProducts(searchTerm) {
  const filteredProducts = state.products.filter(product =>
    product.name.toLowerCase().includes(searchTerm)
  );
  updateProductsDisplay(filteredProducts);
}

function updateProductsDisplay(productsToShow = state.products) {
  const productsGrid = document.getElementById('products-grid');
  productsGrid.innerHTML = '';
  
  productsToShow.forEach(product => {
    const productElement = document.createElement('div');
    productElement.className = 'product-card';
    productElement.innerHTML = `
      <img src="${product.image}" alt="${product.name}" style="max-height:80px; margin-bottom:8px;">
      <h3>${product.name}</h3>
      <p class="price">${product.price} Kč</p>
      <p class="stock">Skladem</p>
      <button class="add-to-cart" ${!product.name ? 'disabled' : ''}>
        ${!product.name ? 'Není k dispozici' : 'Přidat do košíku'}
      </button>
    `;
    
    if (product.name) {
      productElement.querySelector('.add-to-cart').addEventListener('click', () => {
        addToCart(product.name);
      });
    }
    
    productsGrid.appendChild(productElement);
  });
}