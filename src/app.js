const express=require("express");
const app=express();

const productsRouter=require("./routes/products.js");
const cartsRouter=require("./routes/carts.js");

app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(8080, ()=>{
    console.log("App iniciada en puerto 8080...");
});