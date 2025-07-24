const express=require('express');
const router=express.Router();
const cartManager=require('../managers/CartManager');

router.post('/', async(req,res)=>{
    const newCArt=await cartManager.create();
    res.status(201).json(newCart);
});

router.get('/:cid', async(req,res)=>{
    const cart=await cartManager.getById(req.params.cid);
    if(!cart)return res.status(404).json({error: 'Carrito no encontrado'});
    res.json(cart.products);
});

router.post('/:cid/product/:pid', async (req,res)=>{
    const cart=await cartManager.addProduct(req.params.cid, req.params.pid)
    if(!cart) return res.status(404).send({error: 'No se pudo agregar producto'});
    res.json(cart);
});

router.delete('/:cid/products/:pid', async(req,res)=>{
    const cart=await cartManager.removeProduct(req.params.cid, req.params.pid);
    if(!cart)return res.status(404).json({error: 'Carrito o producto no encontrado'});
    res.json(cart);
});

router.put('/:cid', async(req,res)=>{
    const products=req.body.products;
    if(!Array.isArray(products))return res.status(400).json({error:'products debe ser un arreglo'});

    const cart=await cartManager.updateCartProducts(req.params.cid, products);
    if (!cart)return res.status(404).json({error: 'Carrito no encontrado'});
    res.json(cart);  
});

router.put('/:cid/products/:pid', async(req,res)=>{
    const {quantity}=req.body;
    if(typeof quantity!=='number' || quantity<1)return res.status(400).json({error: 'Cantidad invalida'});

    const cart=await cartManager.updateProductQuantity(req.params.cid, req.params.pid, quantity);
    if(!cart) return res.status(404).json({error: 'Carrito o producto no encontrado'});
    res.json(cart);
});

router.delete('/:cid', async(req,res)=>{
    const cart=await cartManager.clearCart(req.params.cid);
    if(!cart)return res.status(404).json({error: 'Carrito no encontrado'});
    res.json(cart);
});

module.exports=router;