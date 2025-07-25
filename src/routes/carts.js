const express=require('express');
const router=express.Router();
const cartManager=require('../managers/CartManager');

router.post('/', async(req,res)=>{
    try{
        const newCart=await cartManager.create();
        res.status(201).json(newCart);
    }catch{
        res.status(500).json({status:'error',message:'Error creando carrito'});
    }
});

router.get('/:cid', async(req,res)=>{
    try{
        const cart=await cartManager.getById(req.params.cid);
        if(!cart)return res.status(404).json({error: 'Carrito no encontrado'});
        res.json(cart);
    }catch{
        res.status(500).json({status:'error',message:'Error interno'});
    }
});

router.post('/:cid/product/:pid', async (req,res)=>{
    try{
        const quantity=parseInt(req.body.quantity)||1;
        const cart=await cartManager.addProduct(req.params.cid, req.params.pid, quantity);
        if(!cart) return res.status(404).send({status:'error',message:'Carrito no encontrado'});
        res.json(cart);
    }catch{
        res.status(500).json({status:'error',message:'Error agregando producto'});
    }
});

router.put('/:cid', async(req,res)=>{
    try{
        const products=req.body.products;
        const cart=await cartManager.updateCartProducts(req.params.cid, products);
        if(!cart)return res.status(404).json({status:'error', message:'Carrito no encontrado'});
        res.json(cart);
    }catch{
        res.status(500).json({status:'error', message:'Error actualizando carrito'});
    }
});

router.put('/:cid/products/:pid', async(req,res)=>{
    try{
        const quantity=req.body.quantity;
        const cart=await cartManager.updateProductQuantity(req.params.cid, req.params.pid, quantity);
        if(!cart) return res.status(404).json({status:'error', message:'Carrito o producto no encontrado'});
        res.json(cart);
    }catch{
        res.status(500).json({status:'error',message:'Error actualizando cantidad'});
    }
});

router.delete('/:cid/products/:pid', async(req,res)=>{
    try{
        const cart=await cartManager.deleteProduct(req.params.cid, req.params.pid);
        if(!cart)return res.status(404).json({error: 'Carrito o producto no encontrado'});
        res.json(cart);
    }catch{
        res.status(500).json({status:'error',message:'Error eliminando producto'});
    }
});

router.delete('/:cid', async(req,res)=>{
    try{
        const cart=await cartManager.emptyCart(req.params.cid);
        if(!cart)return res.status(404).json({status:'error',message:'Carrito no encontrado'});
        res.json(cart);
    }catch{
        res.status(500).json({status:'error',message:'Error vaciando carrito'});
    }
});

module.exports=router;