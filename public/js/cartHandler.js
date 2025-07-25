async function getOrCreateCartId(){
    let cartId=localStorage.getItem('cartId');
    
    if(!cartId){
        const response=await fetch('/api/carts',{
            method:'POST',
        });
        if (response.ok){
            const data=await response.json();
            cartId=data._id || data.id;
            localStorage.setItem('cartId',cartId);
        }else{
            alert('Error al crear carrito');
            return null;
        }
    }
    return cartId;
}

async function agregarProductoAlCarrito(productId, quantity=1){
    const cartId=await getOrCreateCartId();
    if(!cartId)return;
    
    const response=await fetch(`/api/carts/${cartId}/product/${productId}`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({quantity})
    });
    if(response.ok){
        alert('Producto agregado al carrito');
    }else{
        const error=await response.json();
        alert('Error al agregar al carrito:' +(error.message || 'desconocido'));
    }
}

function verCarrito(){
  const cartId=localStorage.getItem('cartId');
  if(!cartId){
    alert('No hay carrito disponible');
    return;
  }
  window.location.href=`/cart?cartId=${cartId}`;
}

function handleVaciar(event){
    event.preventDefault();
    const form=event.target;
    fetch(form.action,{
        method: 'POST'
    }).then(()=>{
        window.location.reload();
    });
    return false;
}