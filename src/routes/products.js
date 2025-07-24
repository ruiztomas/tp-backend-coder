const express = require('express');
const router = express.Router();
const productManager = require('../managers/ProductManager');

router.get('/', async(req, res) => {
  try{
    const limit=parseInt(req.query.limit) || 10;
    const page=parseInt(req.query.page) || 1;
    const sort=req.query.sort;
    const query=req.query.query;

    let filter={};
    if (query){
      if(query==='true'||query==='false')filter.status=query==='true';
      else filter.category=query;
    }

    const result=await productManager.getAll(filter,{limit,page,sort});

    const baseUrl=`${req.protocol}://${req.get('host')}${req.path}`;
    const prevPage=result.page>1?result.page-1:null;
    const nextPage=result.page<result.totalPages?result.page+1:null;

    res.json({
      status:'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage,
      nextPage,
      page: result.page,
      hasPrevPage: prevPage!==null,
      hasNextPage: nextPage!==null,
      prevLink:prevPage?`${baseUrl}?page=${prevPage}&limit=${limit}${query?`&query=${query}`:''}${sort?`&sort=${sort}`:''}`:null,
      nextLink:nextPage?`${baseUrl}?page=${nextPage}&limit=${limit}${query?`&query=${query}`:''}${sort?`&sort=${sort}`:''}`:null
    });
  }catch{
    res.status(500).json({status: 'error',message:'Error interno'});
  }
});

router.get('/:pid', async(req, res) => {
  try{
    const product=await productManager.getById(req.params.pid);
    if (!product) return res.status(404).json({status:'error',message:'Producto no encontrado'});
    res.json(product);
  }catch{
    res.status(500).json({status:'error',message:'Error interno'});
  }
});

router.post('/', async(req, res) => {
  try{
    const newProduct=await productManager.add(req.body);
    res.status(201).json(newProduct);
  }catch{
    res.status(500).json({status:'error', message:'Error guardando producto'});
  }
});

router.put('/:pid', async(req, res) => {
  try{
    const updated=await productManager.update(req.params.pid, req.body);
    if(!updated)return res.status(404).json({error: 'Producto no encontrado'});
    res.json(updated);
  }catch{
    res.status(500).json({status:'error',message:'Error actualizando producto'});
  }
});

router.delete('/:pid', async(req, res) => {
  try{
    await productManager.delete(req.params.pid);
    res.sendStatus(204);
  }catch{
    res.status(500).json({ status:'error',message:'Error eliminando producto'});
  }
});

module.exports = router;
