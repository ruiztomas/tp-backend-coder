const socket=io();

const productForm=document.getElementById('productForm');
const productList=document.getElementById('productList');

productForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    
    const title=document.getElementById('title').value;
    const price=document.getElementById('price').value;

    socket.emit("addProduct", {title, price});

    productForm.reset();
});

socket.on('updateProducts', (products)=>{
    productList.innerHTML='';
    products.forEach(p=>{
        productList.innerHTML+=`
        <li>
            ${p.title}-$${p.price}
            <button onclick="deleteProduct('${p.id}')">Eliminar</button>
        </li>`;        
    });
});

function deleteProduct(id){
    socket.emit("deleteProduct", id);    
}