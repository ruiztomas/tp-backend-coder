const express=require('express');
const router=express.Router();
const productManager=require('../managers/ProductManager');

router.get('/', (req,res)=>{
    productManager.getAll(products=> res.json(products));
});

router.get('/:pid', (req, res)=>{
    productManager.getById(req.params.pid, product=>{
        if(!product) return res.status(404).send('No encontrado');
        res.json(product);
    });
});

router.post('/', (req,res)=>{
    productManager.add(req.body, nuevo=> res.status(201).json(nuevo));
});

router.put('/:pid', (req,res)=>{
    productManager.update(req.params.pid, req.body, actualizado=>{
        if(!actualizado) return res.status(404).send('No encontrada');
        res.json(actualizado);
    });
});

router.delete('/:pid', (req,res)=>{
    productManager.delete(req.params.pid, ()=> res.sendStatus(204));
});

module.exports=router;