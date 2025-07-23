const fs=require('fs');
const path='./data/carts.json';
const Cart=require('../models/Cart');

const getCarts=callback=>{
    fs.readFile(path, 'utf8', (err, data)=>{
        const carts=err?[]:JSON.parse(data);
        callback(carts);
    });
};

const saveCarts=(carts, callback)=>{
    fs.writeFile(path, JSON.stringify(carts, null, 2), callback);
};

const cartManager={
    create: async()=>{
        const newCart=new Cart({products: []});
        await newCart.save();
        return newCart.toObject();
    },
    getById: async(id)=>{
        const cart= await Cart.findById(id).populate('products.product').lean();
        return cart;
    },
    addProduct: async(cid, pid)=>{
        const cart=await Cart.findById(cid);
        if(!cart)return null;

        const exist=cart.products.find(p=>p.product.toString()===pid);
        if(exist){
            exist.quantity+=1;
        }else{
            cart.products.push({product: pid, queantity: 1});
        }
        await cart.save();
        return cart.toObject();
    },
    removeProduct: async(cid, pid)=>{
        const cart=await Cart.findById(cid);
        if(!cart)return null;

        cart.products=cart.products.filter(p=>p.product.toString()!==pid);
        await cart.save();
        return cart.toObject();
    },
    updateCartProducts: async(cid, products)=>{
        const cart=await Cart.findById(cid);
        if(!cart)return null;

        cart.products=products;
        await cart.save();
        return cart.toObject();
    },
    updateProductQuantity: async(cid, pid, quantity)=>{
        const cart=await Cart.findById(cid);
        if(!cart)return null;

        const productInCart=cart.products.find(p=>p.product.toString()===pid);
        if(!productInCart)return null;

        productInCart.quantity=quantity;
        await cart.save();
        return cart.toObject();
    },
    clearCart: async(cid)=>{
        const cart=await Cart.findById(cid);
        if(!cart)return null;

        cart.products=[];
        await cart.save();
        return cart.toObject();
    }
};

module.exports=cartManager;