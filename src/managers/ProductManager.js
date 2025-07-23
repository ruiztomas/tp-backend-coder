const fs = require('fs');
const path=require('path');
const productFile = path.join(__dirname, '..','..','data','products.json');
const Product=require('../models/Products');

const getProducts = callback => {
  fs.readFile(productFile, 'utf-8', (err, data) => {
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
  fs.writeFile(productFile, JSON.stringify(products, null, 2), (err)=>{
    if(err){
      console.error("Error al escribir el archivo:", err);
    } else {
      console.log("Archivo guardado correctamente.");
    }
    callback();
  });
};

const productManager = {
  getAll: () => {
    try {
      if (!fs.existsSync(productFile)) fs.writeFileSync(productFile, '[]');
      const data = fs.readFileSync(productFile, 'utf-8');
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
      console.log("Productos antes de guardar:", products);
      saveProducts(products, () =>{
        console.log("Producto guardado:", newProduct);
        callback(newProduct);
      });
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
