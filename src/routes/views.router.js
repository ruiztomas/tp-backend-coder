const express=require('express');
const router=express.Router();
const Product=require('../models/Products');
const Cart=require('../models/Cart');

router.get('/products',async(req,res)=>{
    try{
        const limit=parseInt(req.query.limit)||10;
        const page=parseInt(req.query.page)||1;
        const sort=req.query.sort;
        const query=req.query.query;

        let=filter={};
        if(query){
            if(query==='true'||query==='false')filter.status=query==='true';
            else filter.category=query;
        }
        
        let sortOption={};
        if(sort==='asc')sortOption.price=1;
        else if(sort==='desc')sortOption.price=-1;

        const totalDocs=await Product.countDocuments(filter);
        const totalPages=Math.ceil(totalDocs/limit);
        const skip=(page-1)*limit;

        const products=await Product.find(fiter)
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .lean();

        res.render('products',{products, page, totalPages, cartId});
    } catch(error){
        res.status(500).send('Error al cargar productos');
    }
});

router.get('/products/:pid', async(req,res)=>{
    try{
        const product=await Product.findById(req.params.pid).lean();
        if(!product)return res.status(404).render('error',{message: 'Producto no encontrado'});
        res.render('productDetail',{product});
    }catch(error){
        res.status(500).send('Error al cargar producto');
    }
});

router.get('/carts/:cid',async(req,res)=>{
    try{
        const cart=await Cart.findById(req.params.cid).populate('products.product').lean();
        if(!cart)return res.status(404).render('error',{message:'Carrito no encontrado'});
        res.render('cartDetail',{cart});
    }catch(error){
        res.status(500).send('Error al cargar carrito');
    }
});

module.exports=router;