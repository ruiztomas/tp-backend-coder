const fs = require('fs');
const path = './data/products.json';

const getProducts = callback => {
  fs.readFile(path, 'utf-8', (err, data) => {
    if (err) return callback([]);
    try {
      const products = JSON.parse(data);
      callback(products);
    } catch {
      callback([]);
    }
  });
};

const saveProducts = (products, callback) => {
  fs.writeFile(path, JSON.stringify(products, null, 2), callback);
};

const productManager = {
  getAll: () => {
    try {
      if (!fs.existsSync(path)) fs.writeFileSync(path, '[]');
      const data = fs.readFileSync(path, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  },
  getById: (id, callback) => {
    getProducts(products => {
      const found = products.find(p => p.id == id);
      callback(found);
    });
  },
  add: (data, callback) => {
    getProducts(products => {
      const newProduct = { id: Date.now().toString(), ...data };
      products.push(newProduct);
      saveProducts(products, () => callback(newProduct));
    });
  },
  update: (id, updates, callback) => {
    getProducts(products => {
      const index = products.findIndex(p => p.id == id);
      if (index === -1) return callback(null);
      products[index] = { ...products[index], ...updates, id: products[index].id };
      saveProducts(products, () => callback(products[index]));
    });
  },
  delete: (id, callback) => {
    getProducts(products => {
      const filtered = products.filter(p => p.id != id);
      saveProducts(filtered, () => callback());
    });
  }
};

module.exports = productManager;
