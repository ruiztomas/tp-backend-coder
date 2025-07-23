const express = require('express');
const router = express.Router();
const productManager = require('../managers/ProductManager');

router.get('/', async(req, res) => {
  try{
    const{ limit, page, sort, query}=req.query;
    let filter={};
    if (query){
      const parts=query.split(':');
      if(parts.length===2){
        filter[parts[0]]=parts[1];
      }
    }
    const options={
      limits: limit?parseInt(limit):10,
      page: page?parseInt(page):1,
      sort,
      query: filter
    };
    const result=await productManager.getAll(options);

    const baseUrl=req.baseUrl+req.path;
    const prevLink=result.hasPrevPage?`${baseUrl}?page=${result.prevPage}&limit=${result.limit}` : null;
    const nextLink=result.hasNextPage?`${baseUrl}?page=${result.nextPage}&limit=${result.limit}` : null;

    res.json({
      status:'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink,
      nextLink
    });
  }catch(error){
    res.status(500).json({status: 'error', error: error.message});
  }
});

router.get('/:pid', async(req, res) => {
  try{
    const product=await productManager.getById(req.params.pid);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  }catch(error){
    res.status(500).json({error: error.message});
  }
});

router.post('/', async(req, res) => {
  try{
    const newProduct=await productManager.add(req.body);
    res.status(201).json(newProduct);
  }catch(error){
    res.status(500).json({ error: error.message});
  }
});

router.put('/:pid', async(req, res) => {
  try{
    const updated=await productManager.update(req.params.pid, req.body);
    if(!updated)return res.status(404).json({error: 'Producto no encontrado'});
    res.json(updated);
  }catch(error){
    res.status(500).json({ error: error.message});
  }
});

router.delete('/:pid', async(req, res) => {
  try{
    await productManager.delete(req.params.pid);
    res.sendStatus(204);
  }catch(error){
    res.status(500).json({ error: error.message});
  }
});

module.exports = router;
