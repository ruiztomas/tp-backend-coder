const express=require('express');
const router=express.Router();
const {getSocketServer}=require('../app');

let products=[];

router.get('/', (req,res)=>{
    res.render('home', {products});
});

router.get('/realtimeProducts', (req, res)=>{
    res.render('realtimeProducts');
});

router.post('/api/product', (req, res)=>{
    const {title, price}=req.body;

    const newProduct={
        id: Date.now().toString(),
        title,
        price
    };

    products.push(newProduct);

    const io=getSocketServer();
    io.emit('updateProducts', products);

    res.status(201).json({status: 'ok', message: 'Producto agregado', product: newProduct });
});

router.delete('/api/product/:id', (req, res)=>{
    const id=req.params.id;
    products=product.filter(p=> p.id !== id);

    const io=getSocketServer();
    io.emit('updateProducts', products);

    res.json({status: 'ok', message: 'Producto eliminado', id});
});

module.exports=router;