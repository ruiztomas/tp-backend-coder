const express=require("express");
const http=require("http");
const {Server}=require("socket.io");
const path=require("path");

const productsRouter=require("./routes/products.js");
const cartsRouter=require("./routes/carts.js");
const viewsRouter=require('./routes/views.router.js');
const productManager=require("./managers/ProductManager.js");
const { console } = require("inspector");
const connectDB=require('./config/db');

const app=express();
const server=http.createServer(app);
const io= new Server(server);

const PORT=process.env.PORT || 8000;
connectDB();

const exphbs=require('express-handlebars');
const hbs=exphbs.create({
    helpers:{
        multiply: (a,b)=>a*b,
        eq:(a,b)=>a===b,
    },
});
app.engine('handlebars', hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "../public")));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/',viewsRouter);

app.get("/realtimeproducts", (req, res)=>{
    res.render("realTimeProducts");
});

io.on("connection", (socket)=>{
    console.log("Nuevo cliente conectado");

    productManager
        .getAll({limit:100})
        .then(({docs:products})=>{
            socket.emit('updateProducts', products);
        });
    socket.on("addProduct", async(data)=>{
        try{
            await productManager.add(data);
            const {docs:products}=await productManager.getAll({limit:100});
            io.emit('updateProducts',products);
        }catch(error){
            console.error('Error agregando producto', error);
        }
    });

    socket.on("deleteProduct", async(id)=>{
        try{
            await productManager.delete(id);
            const {docs:products}=await productManager.getAll({limit:100});
            io.emit('updateProducts', products);
        }catch(error){
            console.error('Error eliminando producto', error);
        }
    });
});

server.listen(PORT, ()=>{
    console.log(`Server inicializado en http://localhost:${PORT}`);
});