import { StorageManager, STORAGE_KEYS } from './storage.js';
import { InputValidator } from './validation.js';

// === Default Inventory Data ===
const inventoryItems = [
  { name: '', price: 0, currency: 'CZK', image: '', category: '' },
  { name: 'Coca-Cola', price: 32, currency: 'CZK', image: 'images/cola.png', category: 'non-alcoholic' },
  { name: 'Sprite', price: 32, currency: 'CZK', image: 'images/sprite.png', category: 'non-alcoholic' },
  { name: 'Fanta', price: 32, currency: 'CZK', image: 'images/fanta.png', category: 'non-alcoholic' },
  { name: 'Red Bull', price: 59, currency: 'CZK', image: 'images/redbull.png', category: 'non-alcoholic' },
  { name: 'Malibu', price: 99, currency: 'CZK', image: 'images/malibu.png', category: 'alcoholic' },
  { name: 'Jack’s Cola', price: 99, currency: 'CZK', image: 'images/jack.png', category: 'alcoholic' },
  { name: 'Moscow Mule', price: 99, currency: 'CZK', image: 'images/moscow.png', category: 'alcoholic' },
  { name: 'Gin Tonic', price: 99, currency: 'CZK', image: 'images/gin.png', category: 'alcoholic' },
  { name: 'Mojito', price: 99, currency: 'CZK', image: 'images/mojito.png', category: 'alcoholic' },
  { name: 'Prosecco', price: 390, currency: 'CZK', image: 'images/prosecco.png', category: 'alcoholic' },
  { name: 'Budvar', price: 59, currency: 'CZK', image: 'images/budvar.png', category: 'beer' },
  { name: 'Sud 30 litrů', price: 125, currency: 'EUR', image: 'images/keg.png', category: 'beer' },
  { name: 'Sud 50 litrů', price: 175, currency: 'EUR', image: 'images/pivo50.png', category: 'beer' },
  { name: 'Budvar plechovka', price: 59, currency: 'CZK', image: 'images/budvar.png', category: 'beer' },
  { name: 'Wellness balíček', price: 0, currency: 'EUR', image: 'images/wellness.png', category: 'relax', customPrice: true },
  { name: 'Grily', price: 20, currency: 'EUR', image: 'images/grill.png', category: 'relax' },
  { name: 'Plyny do ohňových stolů', price: 12, currency: 'EUR', image: 'images/Plyn.png', category: 'relax' }
];

const defaultInventory = {
  'oh-yeah': [...inventoryItems],
  'amazing-pool': [...inventoryItems],
  'little-castle': [...inventoryItems]
};

// Načtení nebo inicializace uloženého inventáře
let savedInventory = StorageManager.getData(STORAGE_KEYS.INVENTORY);
if (!savedInventory) {
  savedInventory = defaultInventory;
  StorageManager.saveData(STORAGE_KEYS.INVENTORY, savedInventory);
}

// Načtení aktuální vily (default: "oh-yeah")
let currentVilla = localStorage.getItem(STORAGE_KEYS.CURRENT_VILLA) || 'oh-yeah';
localStorage.setItem(STORAGE_KEYS.CURRENT_VILLA, currentVilla);

// Získání produktů pro aktuální vilu
let products = savedInventory[currentVilla] || [];

document.addEventListener('DOMContentLoaded', () => {
  // Nastavení selectu pro výběr vily
  const villaSelect = document.getElementById('villa-select');
  if (villaSelect) {
    villaSelect.value = currentVilla;
    villaSelect.addEventListener('change', (e) => {
      currentVilla = e.target.value;
      localStorage.setItem(STORAGE_KEYS.CURRENT_VILLA, currentVilla);
      savedInventory = StorageManager.getData(STORAGE_KEYS.INVENTORY) || defaultInventory;
      products = savedInventory[currentVilla] || [];
      updateInventoryTable(products);
    });
  }

  updateInventoryTable(products);

  // Event listenery
  document.getElementById('add-product-btn').addEventListener('click', openAddProductModal);
  document.getElementById('inventory-search-input').addEventListener('input', handleSearch);
  document.getElementById('product-form').addEventListener('submit', handleFormSubmit);
  document.getElementById('cancel-btn').addEventListener('click', closeModal);
  document.getElementById('confirm-delete-btn').addEventListener('click', confirmDelete);
  document.getElementById('cancel-delete-btn').addEventListener('click', closeConfirmModal);
});

function updateInventoryTable(list) {
  const tbody = document.getElementById('inventory-body');
  tbody.innerHTML = '';
  list.forEach((product) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.price} ${product.currency}</td>
      <td>${product.image ? `<img src="${product.image}" alt="${product.name}" style="max-height:30px;">` : ''}</td>
      <td>${product.category}</td>
      <td>
        <button class="btn btn-secondary" data-name="${product.name}" data-action="edit">Upravit</button>
        <button class="btn btn-danger" data-name="${product.name}" data-action="delete">Smazat</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  tbody.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', handleRowButton);
  });
}

function handleSearch(e) {
  const term = e.target.value.toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(term));
  updateInventoryTable(filtered);
}

function handleRowButton(e) {
  const name = e.target.dataset.name;
  const action = e.target.dataset.action;
  if (action === 'edit') {
    openEditProductModal(name);
  } else if (action === 'delete') {
    openConfirmDeleteModal(name);
  }
}

function openAddProductModal() {
  document.getElementById('modal-title').textContent = 'Přidat produkt';
  document.getElementById('product-id').value = '';
  document.getElementById('product-name').value = '';
  document.getElementById('product-price').value = '';
  document.getElementById('product-image').value = '';
  document.getElementById('product-category').value = '';
  openModal();
}

function openEditProductModal(name) {
  const product = products.find(p => p.name === name);
  if (!product) return;
  document.getElementById('modal-title').textContent = 'Upravit produkt';
  document.getElementById('product-name').value = product.name;
  document.getElementById('product-price').value = product.price;
  document.getElementById('product-image').value = product.image;
  document.getElementById('product-category').value = product.category;
  openModal();
}

function handleFormSubmit(e) {
  e.preventDefault();
  const nameField = document.getElementById('product-name');
  const priceField = document.getElementById('product-price');
  const imageField = document.getElementById('product-image');
  const categoryField = document.getElementById('product-category');

  const nameVal = InputValidator.validateText(nameField.value);
  if (!nameVal.isValid) {
    alert(nameVal.message);
    return;
  }
  const priceVal = InputValidator.validateNumber(priceField.value, { min: 0, allowZero: true });
  if (!priceVal.isValid) {
    alert(priceVal.message);
    return;
  }

  const existingIndex = products.findIndex(p => p.name === nameVal.value);
  if (existingIndex > -1) {
    products[existingIndex] = {
      ...products[existingIndex],
      price: priceVal.value,
      image: imageField.value,
      category: categoryField.value
    };
  } else {
    products.push({
      name: nameVal.value,
      price: priceVal.value,
      currency: 'CZK',
      image: imageField.value,
      category: categoryField.value
    });
  }

  savedInventory[currentVilla] = products;
  StorageManager.saveData(STORAGE_KEYS.INVENTORY, savedInventory);

  closeModal();
  updateInventoryTable(products);
}

function openConfirmDeleteModal(name) {
  window.deleteName = name;
  document.getElementById('confirm-modal').style.display = 'flex';
}

function confirmDelete() {
  products = products.filter(p => p.name !== window.deleteName);
  savedInventory[currentVilla] = products;
  StorageManager.saveData(STORAGE_KEYS.INVENTORY, savedInventory);
  closeConfirmModal();
  updateInventoryTable(products);
}

function closeConfirmModal() {
  document.getElementById('confirm-modal').style.display = 'none';
}

function openModal() {
  document.getElementById('product-modal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('product-modal').style.display = 'none';
}