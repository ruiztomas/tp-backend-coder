const express=require('express');
const router=express.Router();
const productManager=require('../managers/ProductManager');
const cartManager=require('../managers/CartManager');

router.get('/products',async(req,res)=>{
    try{
        const{limit,page,sort,query}=req.query;

        let=filter={};
        if(query){
            const parts=query.split(':');
            if(parts.length===2)filter[parts[0]]=parts[1];
        }
        const options={
            limit:limit?parseInt(limit):10,
            page:page?parseInt(page):1,
            sort,
            query:filter
        };
        const result=await productManager.getAll(options);
        
        res.render('products',{
            products: result.docs,
            page: result.page,
            totalPages: result.totalPages,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            query: req.query.query || '',
            sort: req.query.sort || '',
            limit: options.limit,
        });
    } catch(error){
        res.status(500).send('Error al cargar productos');
    }
});

router.get('/products/:pid', async(req,res)=>{
    try{
        const product=await productManager.getById(req.params.pid);
        if(!product)return res.status(404).send('Producto no encontrado');
        res.render('productDetail',{product});
    }catch(error){
        res.status(500).send('Error al cargar producto');
    }
});

router.get('/carts/:cid',async(req,res)=>{
    try{
        const cart=await cartManager.getById(req.params.cid);
        if(!cart)return res.status(404).send('Carrito no encontrado');
        res.render('cart',{products: cart.products, cartId: req.params.cid});
    }catch(error){
        res.status(500).send('Error al cargar carrito');
    }
});

module.exports=router;