const fs=require('fs');
const path='./data/carts.json';

const getCarts=callback=>{
    fs.readFile(path, 'utf8', (err, data)=>{
        const carts=err?[]:JSON.parse(data);
        callback(carts);
    });
};

const saveCarts=(carts, callback)=>{
    fs.writeFile(path, JSON.stringify(carts, null, 2), callback);
};

const cartManager={
    create: callback=>{
        getCarts(carts=>{
            const nuevo= {id: Date.now().toString(), products: []};
            carts.push(nuevo);
            saveCarts(carts, ()=> callback(nuevo));
        });
    },
    getById: (id, callback)=>{
        getCarts(carts=>{
            const cart= carts.find(c=> c.id==id);
            callback(cart);
        });
    },
    addProduct: (cid, pid, callback)=>{
        getCarts(carts=>{
            const cart=carts.find(c=> c.id==cid);
            if(!cart) return callback(null);
            const exist=cart.products.find(p=> p.product==pid);
            if(existe) existe.quantity+=1;
            else cart.products.push({product: pid, quantity: 1});
            saveCarts(carts, ()=> callback(cart));
        });
    }
};

module.exports=cartManager;