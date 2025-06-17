const express=require('express');
const router=express.Router();
const cartManager=require('../managers/CartManager');

router.post('/', (req,res)=>{
    cartManager.create(nuevo=> res.status(201).json(nuevo));
});

router.get('/:cid', (req,res)=>{
    cartManager.getById(req.params.cid, cart=>{
        if(!cart) return res.status(404).send('Carrito no encontrado');
        res.json(cart.products);
    });
});

router.post('/:cid/product/:pid', (req,res)=>{
    cartManager.addProduct(req.params.cid, req.params.pid, cart =>{
        if(!cart) return res.status(404).send('No se pudo agregar');
        res.json(cart);
    });
});

module.exports=router;