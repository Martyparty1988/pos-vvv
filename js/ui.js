const UI = {
    DOMElements: {
        productsGrid: document.getElementById('products-grid'),
        cartItems: document.getElementById('cart-items'),
        subtotalDisplay: document.getElementById('subtotal'),
        totalDisplay: document.getElementById('total'),
        searchInput: document.getElementById('search-input'),
        filterButtons: document.querySelectorAll('.filter-btn'),
        locationButtons: document.querySelectorAll('.location-btn'),
        themeToggle: document.getElementById('theme-toggle'),
        checkoutBtn: document.getElementById('checkout-btn'),
        clearCartBtn: document.getElementById('clear-cart'),
        
        statsModal: document.getElementById('stats-modal'),
        settingsModal: document.getElementById('settings-modal'),
        receiptModal: document.getElementById('receipt-modal'),
        customPriceModal: document.getElementById('custom-price-modal'),
        cityTaxModal: document.getElementById('city-tax-modal'),
        
        statsBtn: document.getElementById('stats-btn'),
        settingsBtn: document.getElementById('settings-btn'),
        
        closeModalButtons: document.querySelectorAll('.close-modal'),
        
        defaultLocationSelect: document.getElementById('default-location'),
        currencyDisplaySelect: document.getElementById('currency-display'),
        animationsToggle: document.getElementById('animations-toggle'),
        clearDataBtn: document.getElementById('clear-data'),
        exportDataBtn: document.getElementById('export-data'),
        
        receiptContainer: document.getElementById('receipt-container'),
        printReceiptBtn: document.getElementById('print-receipt'),
        saveReceiptBtn: document.getElementById('save-receipt'),
        completeSaleBtn: document.getElementById('complete-sale'),
        
        customPriceInput: document.getElementById('custom-price-input'),
        customPriceProductName: document.getElementById('custom-price-product-name'),
        applyCustomPriceBtn: document.getElementById('apply-custom-price'),
        
        personsCountInput: document.getElementById('persons-count'),
        nightsCountInput: document.getElementById('nights-count'),
        cityTaxTotalDisplay: document.getElementById('city-tax-total'),
        applyCityTaxBtn: document.getElementById('apply-city-tax'),
        
        notification: document.getElementById('notification')
    },
    
    init: function() {
        this.renderProducts();
        this.updateCart();
        this.applySettings();
        this.setupEventListeners();
    },
    
    setupEventListeners: function() {
        this.DOMElements.searchInput.addEventListener('input', this.handleSearch.bind(this));
        
        this.DOMElements.filterButtons.forEach(btn => {
            btn.addEventListener('click', this.handleFilter.bind(this));
        });
        
        this.DOMElements.locationButtons.forEach(btn => {
            btn.addEventListener('click', this.handleLocationChange.bind(this));
        });
        
        this.DOMElements.themeToggle.addEventListener('click', this.toggleDarkMode.bind(this));
        
        this.DOMElements.statsBtn.addEventListener('click', () => this.openModal('stats'));
        this.DOMElements.settingsBtn.addEventListener('click', () => this.openModal('settings'));
        this.DOMElements.checkoutBtn.addEventListener('click', () => this.openModal('receipt'));
        
        this.DOMElements.closeModalButtons.forEach(btn => {
            btn.addEventListener('click', this.closeModal.bind(this));
        });
        
        this.DOMElements.clearCartBtn.addEventListener('click', () => {
            if (Cart.isEmpty()) {
                this.showNotification('Košík je již prázdný', 'info');
                return;
            }
            
            if (confirm('Opravdu chcete vyprázdnit košík?')) {
                Cart.clearCart();
                this.updateCart();
                this.showNotification('Košík byl vyprázdněn', 'success');
            }
        });
        
        this.DOMElements.defaultLocationSelect.addEventListener('change', this.saveSettings.bind(this));
        this.DOMElements.currencyDisplaySelect.addEventListener('change', this.saveSettings.bind(this));
        this.DOMElements.animationsToggle.addEventListener('change', this.saveSettings.bind(this));
        this.DOMElements.clearDataBtn.addEventListener('click', this.handleClearData.bind(this));
        this.DOMElements.exportDataBtn.addEventListener('click', this.handleExportData.bind(this));
        
        this.DOMElements.printReceiptBtn.addEventListener('click', this.printReceipt.bind(this));
        this.DOMElements.saveReceiptBtn.addEventListener('click', this.saveReceipt.bind(this));
        this.DOMElements.completeSaleBtn.addEventListener('click', this.completeSale.bind(this));
        
        this.DOMElements.applyCustomPriceBtn.addEventListener('click', this.applyCustomPrice.bind(this));
        
        this.DOMElements.personsCountInput.addEventListener('input', this.updateCityTaxTotal.bind(this));
        this.DOMElements.nightsCountInput.addEventListener('input', this.updateCityTaxTotal.bind(this));
        this.DOMElements.applyCityTaxBtn.addEventListener('click', this.applyCityTax.bind(this));
        
        document.querySelectorAll('.primary-btn, .secondary-btn, .danger-btn, .success-btn, .filter-btn, .location-btn, .nav-btn').forEach(btn => {
            btn.addEventListener('click', this.createRippleEffect);
        });
        
        this.setupDragAndDrop();
    },
    
    createRippleEffect: function(e) {
        const button = e.currentTarget;
        
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        button.appendChild(ripple);
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        
        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    },
    
    showNotification: function(message, type = 'info') {
        const notification = this.DOMElements.notification;
        const icon = notification.querySelector('.notification-icon');
        const messageElement = notification.querySelector('.notification-message');
        
        messageElement.textContent = message;
        
        let iconClass = 'fa-info-circle';
        if (type === 'success') iconClass = 'fa-check-circle';
        if (type === 'error') iconClass = 'fa-exclamation-circle';
        if (type === 'warning') iconClass = 'fa-exclamation-triangle';
        
        icon.className = `notification-icon fas ${iconClass}`;
        
        notification.className = 'notification';
        notification.classList.add(`notification-${type}`);
        
        setTimeout(() => {
            notification.classList.add('active');
            
            setTimeout(() => {
                notification.classList.add('closing');
                
                setTimeout(() => {
                    notification.classList.remove('active');
                    notification.classList.remove('closing');
                }, 300);
            }, 3000);
        }, 10);
    },
    
    setupDragAndDrop: function() {
        const productCards = document.querySelectorAll('.product-card');
        const cartSection = document.querySelector('.cart-section');
        
        productCards.forEach(card => {
            card.addEventListener('dragstart', (e) => {
                card.classList.add('dragging');
                e.dataTransfer.setData('text/plain', card.dataset.id);
            });
            
            card.addEventListener('dragend', () => {
                card.classList.remove('dragging');
            });
        });
        
        cartSection.addEventListener('dragover', (e) => {
            e.preventDefault();
            cartSection.classList.add('drag-over');
        });
        
        cartSection.addEventListener('dragleave', () => {
            cartSection.classList.remove('drag-over');
        });
        
        cartSection.addEventListener('drop', (e) => {
            e.preventDefault();
            cartSection.classList.remove('drag-over');
            
            const productId = e.dataTransfer.getData('text/plain');
            const product = Storage.getProducts().find(p => p.id === productId);
            
            if (product) {
                if (product.customPrice) {
                    this.openCustomPriceModal(product);
                    return;
                }
                
                if (product.cityTax) {
                    this.openCityTaxModal();
                    return;
                }
                
                Cart.addItem(product);
                this.updateCart();
                this.animateAddToCart(product.id);
                this.showNotification(`${product.name} přidán do košíku`, 'success');
            }
        });
    },
    
    renderProducts: function() {
        const products = Storage.getProducts();
        const filterValue = this.getActiveFilter();
        const searchValue = this.DOMElements.searchInput.value.toLowerCase();
        
        let html = '';
        let delay = 0;
        
        const filteredProducts = products.filter(product => {
            if (filterValue !== 'all' && product.category !== filterValue) {
                return false;
            }
            if (searchValue && !product.name.toLowerCase().includes(searchValue)) {
                return false;
            }
            return true;
        });
        
        this.DOMElements.productsGrid.classList.add('filtering');
        
        filteredProducts.forEach(product => {
            const imagePath = product.image || `images/placeholder.png`;
            const priceDisplay = this.formatPrice(product.price, product.currency);
            
            html += `
                <div class="product-card ${product.category}" data-id="${product.id}" draggable="true" style="animation-delay: ${delay}s">
                    <div class="product-image" style="background-image: url('${imagePath}')">
                        <span class="product-category">${this.getCategoryName(product.category)}</span>
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <div class="product-price ${product.currency === 'EUR' ? 'product-price-eur' : ''}">
                            <span>${product.customPrice ? 'Vlastní cena' : (product.cityTax ? 'Výpočet ceny' : priceDisplay)}</span>
                            <button class="add-to-cart" data-id="${product.id}" aria-label="Přidat do košíku">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            delay += 0.05;
        });
        
        if (filteredProducts.length === 0) {
            html = '<div class="no-products">Žádné produkty nenalezeny.</div>';
        }
        
        this.DOMElements.productsGrid.innerHTML = html;
        
        setTimeout(() => {
            this.DOMElements.productsGrid.classList.remove('filtering');
        }, 400);
        
        this.DOMElements.productsGrid.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', this.handleAddToCart.bind(this));
        });
        
        this.DOMElements.productsGrid.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.add-to-cart')) {
                    return;
                }
                
                const productId = card.dataset.id;
                const product = products.find(p => p.id === productId);
                
                if (product.customPrice) {
                    this.openCustomPriceModal(product);
                } else if (product.cityTax) {
                    this.openCityTaxModal();
                }
            });
        });
        
        this.setupDragAndDrop();
    },
    
    getCategoryName: function(category) {
        const categories = {
            'nealko': 'Nealko',
            'alkohol': 'Alkohol',
            'pivo': 'Pivo',
            'relax': 'Relax'
        };
        
        return categories[category] || 'Ostatní';
    },
    
    getLocationName: function(location) {
        const locations = {
            'oh-yeah': 'Oh Yeah',
            'amazing-pool': 'Amazing Pool',
            'little-castle': 'Little Castle'
        };
        
        return locations[location] || 'Neznámá lokace';
    },
    
    formatPrice: function(price, currency) {
        const settings = Storage.getSettings();
        const formattedPrice = price.toLocaleString('cs-CZ', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
        
        if (currency === 'EUR') {
            return settings.currencyDisplay === 'before' ? `€ ${formattedPrice}` : `${formattedPrice} €`;
        } else {
            return settings.currencyDisplay === 'before' ? `Kč ${formattedPrice}` : `${formattedPrice} Kč`;
        }
    },
    
    updateCart: function() {
        const cartItems = Cart.getItems();
        let html = '';
        
        if (cartItems.length > 0) {
            cartItems.forEach(item => {
                const imagePath = item.image || `images/placeholder.png`;
                const itemTotal = item.price * item.quantity;
                const priceDisplay = this.formatPrice(item.price, item.currency);
                const totalDisplay = this.formatPrice(itemTotal, item.currency);
                
                html += `
                    <div class="cart-item" data-id="${item.id}">
                        <div class="cart-item-image" style="background-image: url('${imagePath}')"></div>
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price ${item.currency === 'EUR' ? 'cart-item-price-eur' : ''}">${priceDisplay}</div>
                        </div>
                        <div class="cart-item-actions">
                            <div class="quantity-control">
                                <button class="quantity-btn decrease" data-id="${item.id}">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="quantity-value">${item.quantity}</span>
                                <button class="quantity-btn increase" data-id="${item.id}">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            <button class="remove-item" data-id="${item.id}">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
        } else {
            html = '<div class="empty-cart-message">Košík je prázdný</div>';
        }
        
        this.DOMElements.cartItems.innerHTML = html;
        
        this.updateCartTotals();
        
        if (cartItems.length > 0) {
            this.DOMElements.cartItems.querySelectorAll('.quantity-btn.increase').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.dataset.id;
                    Cart.increaseQuantity(id);
                    this.updateCart();
                    this.animateQuantityChange(e.currentTarget.parentElement.querySelector('.quantity-value'));
                });
            });
            
            this.DOMElements.cartItems.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.dataset.id;
                    Cart.decreaseQuantity(id);
                    this.updateCart();
                    
                    const quantityElement = e.currentTarget.parentElement.querySelector('.quantity-value');
                    const item = Cart.getItemById(id);
                    
                    if (item) {
                        this.animateQuantityChange(quantityElement);
                    }
                });
            });
            
            this.DOMElements.cartItems.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.dataset.id;
                    const cartItem = e.currentTarget.closest('.cart-item');
                    
                    cartItem.classList.add('removing');
                    
                    setTimeout(() => {
                        Cart.removeItem(id);
                        this.updateCart();
                    }, 300);
                });
            });
        }
        
        this.DOMElements.checkoutBtn.disabled = cartItems.length === 0;
    },
    
    updateCartTotals: function() {
        const totals = Cart.calculateTotals();
        
        const subtotalCZK = this.formatPrice(totals.subtotalCZK, 'CZK');
        const subtotalEUR = this.formatPrice(totals.subtotalEUR, 'EUR');
        const totalCZK = this.formatPrice(totals.totalCZK, 'CZK');
        const totalEUR = this.formatPrice(totals.totalEUR, 'EUR');
        
        let subtotalText = '';
        let totalText = '';
        
        if (totals.subtotalCZK > 0 && totals.subtotalEUR > 0) {
            subtotalText = `${subtotalCZK} + ${subtotalEUR}`;
            totalText = `${totalCZK} + ${totalEUR}`;
        } else if (totals.subtotalCZK > 0) {
            subtotalText = subtotalCZK;
            totalText = totalCZK;
        } else if (totals.subtotalEUR > 0) {
            subtotalText = subtotalEUR;
            totalText = totalEUR;
        } else {
            subtotalText = '0 Kč';
            totalText = '0 Kč';
        }
        
        this.DOMElements.subtotalDisplay.textContent = subtotalText;
        this.DOMElements.totalDisplay.textContent = totalText;
    },
    
    animateQuantityChange: function(element) {
        element.classList.add('changed');
        
        setTimeout(() => {
            element.classList.remove('changed');
        }, 300);
    },
    
    animateAddToCart: function(productId) {
        const cartItem = this.DOMElements.cartItems.querySelector(`[data-id="${productId}"]`);
        
        if (cartItem) {
            cartItem.classList.add('new');
            
            setTimeout(() => {
                cartItem.classList.remove('new');
            }, 400);
        }
    },
    
    handleAddToCart: function(e) {
        e.stopPropagation();
        
        const button = e.currentTarget;
        const productId = button.dataset.id;
        const product = Storage.getProducts().find(p => p.id === productId);
        
        if (product) {
            if (product.customPrice) {
                this.openCustomPriceModal(product);
                return;
            }
            
            if (product.cityTax) {
                this.openCityTaxModal();
                return;
            }
            
            Cart.addItem(product);
            this.updateCart();
            this.animateAddToCart(product.id);
            this.showNotification(`${product.name} přidán do košíku`, 'success');
            
            button.classList.add('adding');
            setTimeout(() => {
                button.classList.remove('adding');
            }, 300);
        }
    },
    
    handleSearch: function() {
        this.renderProducts();
    },
    
    handleFilter: function(e) {
        const filterBtn = e.currentTarget;
        const filter = filterBtn.dataset.filter;
        
        this.DOMElements.filterButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        filterBtn.classList.add('active');
        
        this.renderProducts();
    },
    
    getActiveFilter: function() {
        const activeFilter = document.querySelector('.filter-btn.active');
        return activeFilter ? activeFilter.dataset.filter : 'all';
    },
    
    handleLocationChange: function(e) {
        const locationBtn = e.currentTarget;
        const location = locationBtn.dataset.location;
        
        this.DOMElements.locationButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        locationBtn.classList.add('active');
        
        Storage.setCurrentLocation(location);
        
        this.showNotification(`Přepnuto na lokaci: ${this.getLocationName(location)}`, 'info');
    },
    
    openModal: function(type) {
        let modal;
        
        switch (type) {
            case 'stats':
                modal = this.DOMElements.statsModal;
                Statistics.updateStats();
                break;
            case 'settings':
                modal = this.DOMElements.settingsModal;
                this.loadSettings();
                break;
            case 'receipt':
                modal = this.DOMElements.receiptModal;
                this.generateReceipt();
                break;
            default:
                return;
        }
        
        modal.classList.add('active');
        
        modal.addEventListener('click', this.handleModalOutsideClick);
    },
    
    openCustomPriceModal: function(product) {
        const modal = this.DOMElements.customPriceModal;
        
        this.DOMElements.customPriceProductName.textContent = product.name;
        
        this.DOMElements.customPriceInput.value = '';
        
        this.DOMElements.applyCustomPriceBtn.dataset.productId = product.id;
        
        modal.classList.add('active');
        
        setTimeout(() => {
            this.DOMElements.customPriceInput.focus();
        }, 100);
        
        modal.addEventListener('click', this.handleModalOutsideClick);
    },
    
    openCityTaxModal: function() {
        const modal = this.DOMElements.cityTaxModal;
        
        this.DOMElements.personsCountInput.value = '1';
        this.DOMElements.nightsCountInput.value = '1';
        
        this.updateCityTaxTotal();
        
        modal.classList.add('active');
        
        modal.addEventListener('click', this.handleModalOutsideClick);
    },
    
    closeModal: function(e) {
        const modal = e.target.closest('.modal');
        
        modal.classList.add('closing');
        
        setTimeout(() => {
            modal.classList.remove('active');
            modal.classList.remove('closing');
            
            modal.removeEventListener('click', this.handleModalOutsideClick);
        }, 300);
    },
    
    handleModalOutsideClick: function(e) {
        if (e.target.classList.contains('modal')) {
            const closeBtn = e.target.querySelector('.close-modal');
            if (closeBtn) {
                closeBtn.click();
            }
        }
    },
    
    applyCustomPrice: function() {
        const productId = this.DOMElements.applyCustomPriceBtn.dataset.productId;
        const priceInput = this.DOMElements.customPriceInput;
        const price = parseFloat(priceInput.value);
        
        if (isNaN(price) || price <= 0) {
            this.showNotification('Zadejte platnou cenu', 'error');
            priceInput.focus();
            return;
        }
        
        const product = { ...Storage.getProducts().find(p => p.id === productId) };
        product.price = price;
        
        Cart.addItem(product);
        this.updateCart();
        
        const modal = this.DOMElements.customPriceModal;
        modal.classList.remove('active');
        modal.removeEventListener('click', this.handleModalOutsideClick);
        
        this.showNotification(`${product.name} přidán do košíku`, 'success');
    },
    
    updateCityTaxTotal: function() {
        const personsCount = parseInt(this.DOMElements.personsCountInput.value) || 1;
        const nightsCount = parseInt(this.DOMElements.nightsCountInput.value) || 1;
        
        const cityTaxTotal = 2 * personsCount * nightsCount;
        
        this.DOMElements.cityTaxTotalDisplay.textContent = `${cityTaxTotal} €`;
    },
    
    applyCityTax: function() {
        const personsCount = parseInt(this.DOMElements.personsCountInput.value) || 1;
        const nightsCount = parseInt(this.DOMElements.nightsCountInput.value) || 1;
        
        const cityTaxTotal = 2 * personsCount * nightsCount;
        
        const product = { ...Storage.getProducts().find(p => p.id === 'city-tax') };
        product.price = cityTaxTotal;
        product.name = `City Tax (${personsCount} osob × ${nightsCount} nocí)`;
        
        Cart.addItem(product);
        this.updateCart();
        
        const modal = this.DOMElements.cityTaxModal;
        modal.classList.remove('active');
        modal.removeEventListener('click', this.handleModalOutsideClick);
        
        this.showNotification(`City Tax přidána do košíku`, 'success');
    },
    
    toggleDarkMode: function() {
        const body = document.body;
        const themeIcon = this.DOMElements.themeToggle.querySelector('i');
        const isDarkMode = body.classList.contains('dark-theme');
        
        body.classList.add('theme-transition');
        
        if (isDarkMode) {
            body.classList.remove('dark-theme');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            body.classList.add('dark-theme');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
        
        const settings = Storage.getSettings();
        settings.darkMode = !isDarkMode;
        Storage.saveSettings(settings);
        
        setTimeout(() => {
            body.classList.remove('theme-transition');
        }, 600);
    },
    
    loadSettings: function() {
        const settings = Storage.getSettings();
        
        this.DOMElements.defaultLocationSelect.value = settings.defaultLocation;
        this.DOMElements.currencyDisplaySelect.value = settings.currencyDisplay;
        this.DOMElements.animationsToggle.checked = settings.animations;
    },
    
    saveSettings: function() {
        const settings = {
            defaultLocation: this.DOMElements.defaultLocationSelect.value,
            currencyDisplay: this.DOMElements.currencyDisplaySelect.value,
            animations: this.DOMElements.animationsToggle.checked,
            darkMode: document.body.classList.contains('dark-theme')
        };
        
        Storage.saveSettings(settings);
        this.applySettings();
        this.showNotification('Nastavení bylo uloženo', 'success');
    },
    
    applySettings: function() {
        const settings = Storage.getSettings();
        
        const body = document.body;
        const themeIcon = this.DOMElements.themeToggle.querySelector('i');
        
        if (settings.darkMode) {
            body.classList.add('dark-theme');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            body.classList.remove('dark-theme');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
        
        if (!settings.animations) {
            body.classList.add('reduce-animations');
        } else {
            body.classList.remove('reduce-animations');
        }
        
        const currentLocation = Storage.getCurrentLocation();
        this.DOMElements.locationButtons.forEach(btn => {
            if (btn.dataset.location === currentLocation) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    },
    
    handleClearData: function() {
        if (confirm('Opravdu chcete vymazat všechna data? Tato akce je nevratná.')) {
            Storage.clearAll();
            Storage.init();
            
            this.renderProducts();
            this.updateCart();
            this.showNotification('Všechna data byla vymazána', 'success');
            
            this.DOMElements.settingsModal.classList.remove('active');
        }
    },
    
    handleExportData: function() {
        const data = Storage.exportData();
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const exportName = `villa_pos_export_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportName);
        linkElement.click();
        
        this.showNotification('Data byla exportována', 'success');
    },
    
    generateReceipt: function() {
        const cartItems = Cart.getItems();
        const totals = Cart.calculateTotals();
        const currentLocation = this.getLocationName(Storage.getCurrentLocation());
        const date = new Date().toLocaleDateString('cs-CZ');
        const time = new Date().toLocaleTimeString('cs-CZ');
        
        let html = `
            <div class="receipt">
                <div class="receipt-header">
                    <h2>Villa POS</h2>
                    <p>Lokace: ${currentLocation}</p>
                    <p>Datum: ${date}</p>
                    <p>Čas: ${time}</p>
                </div>
                
                <div class="receipt-items">
        `;
        
        cartItems.forEach(item => {
            const itemTotal = item.price * item.quantity;
            const priceDisplay = this.formatPrice(item.price, item.currency);
            const totalDisplay = this.formatPrice(itemTotal, item.currency);
            
            html += `
                <div class="receipt-item">
                    <div class="receipt-item-left">
                        <div class="receipt-item