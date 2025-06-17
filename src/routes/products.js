const express = require('express');
const router = express.Router();
const productManager = require('../managers/ProductManager');

router.get('/', (req, res) => {
  const products = productManager.getAll();
  res.json(products);
});

router.get('/:pid', (req, res) => {
  const pid = req.params.pid;
  productManager.getById(pid, product => {
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  });
});

router.post('/', (req, res) => {
  productManager.add(req.body, newProduct => {
    res.status(201).json(newProduct);
  });
});

router.put('/:pid', (req, res) => {
  productManager.update(req.params.pid, req.body, updated => {
    if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(updated);
  });
});

router.delete('/:pid', (req, res) => {
  productManager.delete(req.params.pid, () => {
    res.sendStatus(204);
  });
});

module.exports = router;
