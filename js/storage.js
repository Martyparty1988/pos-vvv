const STORAGE_KEYS = {
    PRODUCTS: 'villa_pos_products',
    CART: 'villa_pos_cart',
    SETTINGS: 'villa_pos_settings',
    SALES: 'villa_pos_sales',
    CURRENT_LOCATION: 'villa_pos_current_location'
};

// Objekt pro práci s lokálním úložištěm
const Storage = {
    /**
     * Inicializuje výchozí data v localStorage
     */
    init: function() {
        // Kontrola, zda již existují data produktů
        if (!this.get(STORAGE_KEYS.PRODUCTS)) {
            this.set(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
        }
        
        // Inicializace košíku, pokud neexistuje
        if (!this.get(STORAGE_KEYS.CART)) {
            this.set(STORAGE_KEYS.CART, []);
        }
        
        // Inicializace nastavení, pokud neexistuje
        if (!this.get(STORAGE_KEYS.SETTINGS)) {
            this.set(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
        }
        
        // Inicializace prodejů, pokud neexistují
        if (!this.get(STORAGE_KEYS.SALES)) {
            this.set(STORAGE_KEYS.SALES, []);
        }
        
        // Nastavení výchozí lokace
        if (!this.get(STORAGE_KEYS.CURRENT_LOCATION)) {
            this.set(STORAGE_KEYS.CURRENT_LOCATION, 'oh-yeah');
        }
    },
    
    /**
     * Získá data z localStorage
     * @param {string} key - Klíč pro localStorage
     * @returns {any} - Uložená data, nebo null pokud neexistují
     */
    get: function(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting data from localStorage:', error);
            return null;
        }
    },
    
    /**
     * Uloží data do localStorage
     * @param {string} key - Klíč pro localStorage
     * @param {any} data - Data k uložení
     */
    set: function(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving data to localStorage:', error);
            // Zobrazení upozornění uživateli
            UI.showNotification('Chyba při ukládání dat. Zkontrolujte prosím dostupné místo v úložišti.', 'error');
        }
    },
    
    /**
     * Odstraní data z localStorage
     * @param {string} key - Klíč pro localStorage
     */
    remove: function(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing data from localStorage:', error);
        }
    },
    
    /**
     * Vymaže všechna data aplikace z localStorage
     */
    clearAll: function() {
        try {
            Object.values(STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    },
    
    /**
     * Získá aktuální košík
     * @returns {Array} - Pole položek v košíku
     */
    getCart: function() {
        return this.get(STORAGE_KEYS.CART) || [];
    },
    
    /**
     * Uloží košík
     * @param {Array} cart - Pole položek v košíku
     */
    saveCart: function(cart) {
        this.set(STORAGE_KEYS.CART, cart);
    },
    
    /**
     * Získá produkty
     * @returns {Array} - Pole produktů
     */
    getProducts: function() {
        return this.get(STORAGE_KEYS.PRODUCTS) || [];
    },
    
    /**
     * Získá nastavení
     * @returns {Object} - Objekt s nastavením
     */
    getSettings: function() {
        return this.get(STORAGE_KEYS.SETTINGS) || DEFAULT_SETTINGS;
    },
    
    /**
     * Uloží nastavení
     * @param {Object} settings - Objekt s nastavením
     */
    saveSettings: function(settings) {
        this.set(STORAGE_KEYS.SETTINGS, settings);
    },
    
    /**
     * Získá prodeje
     * @returns {Array} - Pole prodejů
     */
    getSales: function() {
        return this.get(STORAGE_KEYS.SALES) || [];
    },
    
    /**
     * Uloží prodej
     * @param {Object} sale - Objekt s informacemi o prodeji
     */
    saveSale: function(sale) {
        const sales = this.getSales();
        sales.push(sale);
        this.set(STORAGE_KEYS.SALES, sales);
    },
    
    /**
     * Získá aktuální lokaci
     * @returns {string} - Identifikátor aktuální lokace
     */
    getCurrentLocation: function() {
        return this.get(STORAGE_KEYS.CURRENT_LOCATION) || 'oh-yeah';
    },
    
    /**
     * Nastaví aktuální lokaci
     * @param {string} location - Identifikátor lokace
     */
    setCurrentLocation: function(location) {
        this.set(STORAGE_KEYS.CURRENT_LOCATION, location);
    },
    
    /**
     * Exportuje všechna data aplikace
     * @returns {Object} - Objekt se všemi daty aplikace
     */
    exportData: function() {
        const exportData = {};
        Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
            exportData[key] = this.get(storageKey);
        });
        return exportData;
    }
};

// Výchozí nastavení aplikace
const DEFAULT_SETTINGS = {
    defaultLocation: 'oh-yeah',
    currencyDisplay: 'after',
    animations: true,
    darkMode: false
};

// Výchozí seznam produktů
const DEFAULT_PRODUCTS = [
    // Nealko nápoje
    {
        id: 'coca-cola',
        name: 'Coca-Cola',
        price: 32,
        currency: 'CZK',
        category: 'nealko',
        image: 'images/coca-cola.png'
    },
    {
        id: 'fanta',
        name: 'Fanta',
        price: 32,
        currency: 'CZK',
        category: 'nealko',
        image: 'images/fanta.png'
    },
    {
        id: 'sprite',
        name: 'Sprite',
        price: 32,
        currency: 'CZK',
        category: 'nealko',
        image: 'images/sprite.png'
    },
    {
        id: 'red-bull',
        name: 'Red Bull',
        price: 59,
        currency: 'CZK',
        category: 'nealko',
        image: 'images/red-bull.png'
    },
    
    // Alkoholické nápoje
    {
        id: 'malibu',
        name: 'Malibu',
        price: 99,
        currency: 'CZK',
        category: 'alkohol',
        image: 'images/malibu.png'
    },
    {
        id: 'jack-cola',
        name: 'Jack s colou',
        price: 99,
        currency: 'CZK',
        category: 'alkohol',
        image: 'images/jack-cola.png'
    },
    {
        id: 'moscow-mule',
        name: 'Moscow Mule',
        price: 99,
        currency: 'CZK',
        category: 'alkohol',
        image: 'images/moscow-mule.png'
    },
    {
        id: 'gin-tonic',
        name: 'Gin-Tonic',
        price: 99,
        currency: 'CZK',
        category: 'alkohol',
        image: 'images/gin-tonic.png'
    },
    {
        id: 'mojito',
        name: 'Mojito',
        price: 99,
        currency: 'CZK',
        category: 'alkohol',
        image: 'images/mojito.png'
    },
    {
        id: 'prosecco',
        name: 'Prosecco',
        price: 390,
        currency: 'CZK',
        category: 'alkohol',
        image: 'images/prosecco.png'
    },
    
    // Piva
    {
        id: 'budvar',
        name: 'Budvar',
        price: 59,
        currency: 'CZK',
        category: 'pivo',
        image: 'images/budvar.png'
    },
    {
        id: 'sud-30l',
        name: 'Sud 30l',
        price: 125,
        currency: 'EUR',
        category: 'pivo',
        image: 'images/sud-30l.png'
    },
    {
        id: 'sud-50l',
        name: 'Sud 50l',
        price: 175,
        currency: 'EUR',
        category: 'pivo',
        image: 'images/sud-50l.png'
    },
    
    // Relaxační služby
    {
        id: 'wellness',
        name: 'Wellness balíček',
        price: 0,
        currency: 'EUR',
        category: 'relax',
        image: 'images/wellness.png',
        customPrice: true
    },
    {
        id: 'plyny',
        name: 'Plyny do ohňových stolů',
        price: 12,
        currency: 'EUR',
        category: 'relax',
        image: 'images/plyny.png'
    },
    {
        id: 'city-tax',
        name: 'City Tax',
        price: 0,
        currency: 'EUR',
        category: 'relax',
        image: 'images/city-tax.png',
        cityTax: true
    }
];