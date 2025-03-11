const inventoryItems = [
    // Blank first item
    { name: '', price: 0, currency: 'CZK', image: '', category: '' },
    
    // 1. Nealkoholické nápoje
    { name: 'Coca-Cola', price: 32, currency: 'CZK', image: 'images/cola.png', category: 'non-alcoholic' },
    { name: 'Sprite', price: 32, currency: 'CZK', image: 'images/sprite.png', category: 'non-alcoholic' },
    { name: 'Fanta', price: 32, currency: 'CZK', image: 'images/fanta.png', category: 'non-alcoholic' },
    { name: 'Red Bull', price: 59, currency: 'CZK', image: 'images/redbull.png', category: 'non-alcoholic' },
    
    // 2. Alkoholické nápoje
    { name: 'Malibu', price: 99, currency: 'CZK', image: 'images/malibu.png', category: 'alcoholic' },
    { name: 'Jack’s Cola', price: 99, currency: 'CZK', image: 'images/jack.png', category: 'alcoholic' },
    { name: 'Moscow Mule', price: 99, currency: 'CZK', image: 'images/moscow.png', category: 'alcoholic' },
    { name: 'Gin Tonic', price: 99, currency: 'CZK', image: 'images/gin.png', category: 'alcoholic' },
    { name: 'Mojito', price: 99, currency: 'CZK', image: 'images/mojito.png', category: 'alcoholic' },
    { name: 'Prosecco', price: 390, currency: 'CZK', image: 'images/prosecco.png', category: 'alcoholic' },
    
    // 3. Piva
    { name: 'Budvar', price: 59, currency: 'CZK', image: 'images/budvar.png', category: 'beer' },
    { name: 'Sud 30 litrů', price: 125, currency: 'EUR', image: 'images/keg.png', category: 'beer' },
    { name: 'Sud 50 litrů', price: 175, currency: 'EUR', image: 'images/pivo50.png', category: 'beer' },
    { name: 'Budvar plechovka', price: 59, currency: 'CZK', image: 'images/budvar.png', category: 'beer' },
    
    // 4. Relax
    { name: 'Wellness balíček', price: 0, currency: 'EUR', image: 'images/wellness.png', category: 'relax', customPrice: true },
    { name: 'Grily', price: 20, currency: 'EUR', image: 'images/grill.png', category: 'relax' },
    { name: 'Plyny do ohňových stolů', price: 12, currency: 'EUR', image: 'images/Plyn.png', category: 'relax' }
];

const inventory = {
    'oh-yeah': [...inventoryItems],
    'amazing-pool': [...inventoryItems],
    'little-castle': [...inventoryItems]
};