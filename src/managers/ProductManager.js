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
  getAll: async(options) => {
    const {limit=10, page=1,sort,query}=options;

    let filter={};
    if(query){
      if(query.category) filter.category=query.category;
      if(query.available !== undefined) filter.available=query.available;
    }
    let sortOption={};
    if (sort==='asc')sortOption.price=1;
    else if(sort==='desc')sortOption.price=-1;

    const result=await Product.paginate(filter, {
      limit,
      page,
      sort: sortOption,
      lean: true
    });
    
    return result;
  },

  getById: async(id)=>{
    return Product.findById(id).lean();
  },

  add: async(data)=>{
    const newProduct=new Product(data);
    await newProduct.save();
    return newProduct.toObject();
  },

  update: async(id, updates)=>{
    return Product.findByIdAndUpdate(id, updates, {new: true}).lean();
  },

  delete: async(id)=>{
    await Product.findByIdAndDelete(id);
  }
};

module.exports = productManager;
