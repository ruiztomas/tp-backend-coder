const Product=require('../models/Product');

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
