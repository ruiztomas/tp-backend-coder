const express=require("express");
const http=require("http");
const {Server}=require("socket.io");
const exphbs=require("express-handlebars");
const path=require("path");

const productsRouter=require("./routes/products.js");
const cartsRouter=require("./routes/carts.js");
const productManager=require("./managers/ProductManager.js");
const { console } = require("inspector");

const app=express();
const server=http.createServer(app);
const io= new Server(server);

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "../public")));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get("/", (req, res)=>{
    const products= productManager.getAll();
    console.log('Productos en GET /:', products);
    res.render("home", {products});
});

app.get("/realtimeproducts", (req, res)=>{
    res.render("realTimeProducts");
});

io.on("connection", (socket)=>{
    console.log("Nuevo cliente conectado");

    const products=productManager.getAll();
    console.log("Productos al conectar:", products);
    socket.emit("updateProducts", productManager.getAll());

    socket.on("addProduct", (data)=>{
        console.log("Agregar producto:", data);
        productManager.add(data, (newProduct)=>{
            console.log("Producto agregado:", newProduct);
            io.emit("updateProducts", productManager.getAll());
        });
    });

    socket.on("deleteProduct", (id)=>{
        console.log("Eliminar producto id:", id);
        productManager.delete(id, ()=>{
            io.emit("updateProducts", productManager.getAll());
        });
    });
});

const PORT=8000
server.listen(PORT, ()=>{
    console.log(`Server inicializado en http://localhost:${PORT}`);
});