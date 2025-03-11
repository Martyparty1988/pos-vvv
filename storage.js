const STORAGE_KEYS = {
  INVENTORY: 'pos_inventory',
  CART: 'pos_cart',
  SETTINGS: 'pos_settings',
  CURRENT_VILLA: 'pos_current_villa'
};
class StorageManager {
  static saveData(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Chyba při ukládání dat:', error);
      return false;
    }
  }
  static getData(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Chyba při načítání dat:', error);
      return null;
    }
  }
  static removeData(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Chyba při mazání dat:', error);
      return false;
    }
  }
  static clearAll() {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Chyba při mazání všech dat:', error);
      return false;
    }
  }
}
export { STORAGE_KEYS, StorageManager };