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

router.post('/:cid/product/:pid', (req,res)=>{
    cartManager.addProduct(req.params.cid, req.params.pid, cart =>{
        if(!cart) return res.status(404).send('No se pudo agregar');
        res.json(cart);
    });
});

module.exports=router;