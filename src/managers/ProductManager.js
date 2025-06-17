const fs=require('fs');
const path='./data/products.json';

const getProducts=callback=>{
    fs.readFile(path, 'utf8', (err, data)=>{
        const products=err?[]:json.parse(data);
        callback(products);
    });
};

const saveProducts=(products, callback)=>{
    fs.writeFile(path, JSON.stringify(products, null, 2), callback);
};

const productManager={
    getAll: callback=>getProducts(callback),
    getById: (id, callback)=>{
        getProducts(products=>{
            const found=products.find(p=> p.id == id);
            callback(found);
        });
    },
    add: (data, callback)=>{
        getProducts(products=>{
            const nuevo={id: Date.now().toString(), ...data};
            products.push(nuevo);
            saveProducts(products, ()=>callback(nuevo));
        });
    },
    update: (id, updates, callback)=>{
        getProducts(products=>{
            const index=products.findIndex(p=> p.id == id);
            if(index===-1)return callback(null);
            products[index]={...products[index], ...updates, id: products[index].id};
            saveProducts(products, ()=>callback(products[index]));
        });
    },
    delete: (id, callback)=>{
        getProducts(products=>{
            const filtrado= products.filter(p=> p.id != id);
            saveProducts(filtrado, ()=> callback());
        });
    }
};

module.exports=productManager;