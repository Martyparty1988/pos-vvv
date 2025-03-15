/**
 * inventory.js
 * Modul pro správu inventáře
 */

const Inventory = {
    /**
     * Inicializuje správu inventáře
     */
    init: function() {
        // Načtení produktů
        this.loadProducts();
    },
    
    /**
     * Načte produkty ze storage
     */
    loadProducts: function() {
        // Produkty jsou již načteny v localStorage přes Storage modul
        return Storage.getProducts();
    },
    
    /**
     * Získá produkt podle ID
     * @param {string} id - ID produktu
     * @returns {Object|null} - Produkt nebo null
     */
    getProductById: function(id) {
        const products = this.loadProducts();
        return products.find(product => product.id === id) || null;
    },
    
    /**
     * Filtruje produkty podle kategorie
     * @param {string} category - Kategorie (nealko, alkohol, pivo, relax)
     * @returns {Array} - Filtrované produkty
     */
    filterByCategory: function(category) {
        if (category === 'all') {
            return this.loadProducts();
        }
        
        const products = this.loadProducts();
        return products.filter(product => product.category === category);
    },
    
    /**
     * Vyhledá produkty podle názvu
     * @param {string} query - Vyhledávací dotaz
     * @returns {Array} - Nalezené produkty
     */
    searchProducts: function(query) {
        if (!query) {
            return this.loadProducts();
        }
        
        const products = this.loadProducts();
        const lowercaseQuery = query.toLowerCase();
        
        return products.filter(product => 
            product.name.toLowerCase().includes(lowercaseQuery) ||
            product.category.toLowerCase().includes(lowercaseQuery)
        );
    },
    
    /**
     * Kombinované filtrování a vyhledávání produktů
     * @param {string} category - Kategorie (nealko, alkohol, pivo, relax)
     * @param {string} query - Vyhledávací dotaz
     * @returns {Array} - Filtrované a prohledané produkty
     */
    filterAndSearch: function(category, query) {
        let filteredProducts = this.loadProducts();
        
        // Filtrování podle kategorie
        if (category && category !== 'all') {
            filteredProducts = filteredProducts.filter(product => product.category === category);
        }
        
        // Vyhledávání podle dotazu
        if (query) {
            const lowercaseQuery = query.toLowerCase();
            filteredProducts = filteredProducts.filter(product => 
                product.name.toLowerCase().includes(lowercaseQuery) ||
                product.category.toLowerCase().includes(lowercaseQuery)
            );
        }
        
        return filteredProducts;
    },
    
    /**
     * Seřadí produkty podle ceny (vzestupně nebo sestupně)
     * @param {Array} products - Produkty k seřazení
     * @param {boolean} ascending - True pro vzestupné seřazení, false pro sestupné
     * @returns {Array} - Seřazené produkty
     */
    sortByPrice: function(products, ascending = true) {
        return [...products].sort((a, b) => {
            if (ascending) {
                return a.price - b.price;
            } else {
                return b.price - a.price;
            }
        });
    },
    
    /**
     * Seřadí produkty podle názvu (abecedně)
     * @param {Array} products - Produkty k seřazení
     * @param {boolean} ascending - True pro vzestupné seřazení, false pro sestupné
     * @returns {Array} - Seřazené produkty
     */
    sortByName: function(products, ascending = true) {
        return [...products].sort((a, b) => {
            if (ascending) {
                return a.name.localeCompare(b.name, 'cs');
            } else {
                return b.name.localeCompare(a.name, 'cs');
            }
        });
    },
    
    /**
     * Získá produkty s vlastní cenou
     * @returns {Array} - Produkty s vlastní cenou
     */
    getCustomPriceProducts: function() {
        const products = this.loadProducts();
        return products.filter(product => product.customPrice === true);
    },
    
    /**
     * Získá produkty typu City Tax
     * @returns {Array} - Produkty City Tax
     */
    getCityTaxProducts: function() {
        const products = this.loadProducts();
        return products.filter(product => product.cityTax === true);
    },
    
    /**
     * Získá seznam kategorií
     * @returns {Array} - Unikátní kategorie
     */
    getCategories: function() {
        const products = this.loadProducts();
        const categories = products.map(product => product.category);
        return [...new Set(categories)];
    },
    
    /**
     * Získá produkty podle měny
     * @param {string} currency - Měna (CZK nebo EUR)
     * @returns {Array} - Produkty s danou měnou
     */
    getProductsByCurrency: function(currency) {
        const products = this.loadProducts();
        return products.filter(product => product.currency === currency);
    }
};