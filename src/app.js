const express=require("express");
const https=require("http");
const {Server}=require("socket.io");
const exphbs=require("express-handlebars");
const path=require("path");

const productsRouter=require("./routes/products.js");
const cartsRouter=require("./routes/carts.js");

const ProductManager=require("./managers/ProductManager.js");

const app=express();
const server=https.createServer(app);
const io= new Server(server);

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get("/", (req, res)=>{
    const productManager= new ProductManager();
    const products= productManager.getAll();
    res.render("home", {products});
});

app.get("/realtimeproducts", (req, res)=>{
    res.render("realTimeProducts");
});

let productManager= new ProductManager();

io.on("connection", (socket)=>{
    console.log("Nuevo cliente conectado");

    socket.emit("updateProducts", productManager.getAll());

    socket.on("addProduct", (data)=>{
        productManager.add(data, (newProduct)=>{
            io.emit("updateProducts", productManager.getAll());
        });
    });

    socket.on("deleteProducts", (id)=>{
        productManager.delete(id, ()=>{
            io.emit("updateProducts", productManager.getAll());
        });
    });
});

const PORT=8000
server.listen(PORT, ()=>{
    console.log(`Server inicializado en http://localhost:${PORT}`);
});