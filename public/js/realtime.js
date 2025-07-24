const socket=io();

const productForm=document.getElementById('productForm');
const productList=document.getElementById('productList');

productForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    
    const newProduct={
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: parseFloat(document.getElementById('price').value),
        category: document.getElementById('category').value,
        stock: parseInt(document.getElementById('stock').value)
    };
    socket.emit("addProduct", newProduct);
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