const cards=document.getElementById("cards")
const items= document.getElementById("items")
const footer=document.getElementById("footer")
const templateCard= document.getElementById("template-card").content
const templateFooter= document.getElementById("template-footer").content
const templateCarrito= document.getElementById("template-carrito").content
const fragment=document.createDocumentFragment()
let carrito ={}

document.addEventListener("DOMContentLoaded",() => {
  fetchData()
  if (localStorage.getItem("carrito")) {
    carrito= JSON.parse(localStorage.getItem("carrito"))
    mostrarCarrito()
  }
})

const fetchData = async () => {
  try{
    const res = await fetch("data.json")
    const data=await res.json()
    // console.log(data);
    fotoProd(data)
  } catch (error) {
    console.log(error);
  }
}
cards.addEventListener("click",e=> {
  addCarrito(e)
})
const fotoProd= data => {
//  console.log(data);
  data.forEach(productos => {
    templateCard.querySelector("h5").textContent=productos.nombre
    templateCard.querySelector("p").textContent=productos.precio
    // templateCard.querySelector("img").setAttribute("src",productos.thumbnailUrl)
    templateCard.querySelector(".btn-dark").dataset.id=productos.id
    const clone=templateCard.cloneNode(true)
    fragment.appendChild(clone)
  });
  cards.appendChild(fragment)
}
const addCarrito = e=>{
  if (e.target.classList.contains("btn-dark")) {
     setCarrito(e.target.parentElement)
     
  }
  e.stopPropagation()
}
const setCarrito= objeto =>{
  const producto= {
    id: objeto.querySelector(".btn-dark").dataset.id,
    nombre:objeto.querySelector("h5").textContent,
    precio:objeto.querySelector("p").textContent,
    cantidad: 1
  }
 if(carrito.hasOwnProperty(producto.id)){
  producto.cantidad= carrito[producto.id].cantidad + 1
 }

 carrito[producto.id]={...producto}
 mostrarCarrito()
}
const mostrarCarrito = () =>{
  items.innerHTML=""
  Object.values(carrito).forEach(producto => {
    templateCarrito.querySelector("th").textContent = producto.id
    templateCarrito.querySelectorAll("td")[0].textContent= producto.nombre
    templateCarrito.querySelectorAll("td")[1].textContent= producto.cantidad
    // templateCarrito.querySelector(".btn-info").dataset.id =producto.id
    templateCarrito.querySelector("span").textContent=producto.cantidad * producto.precio

    const clone= templateCarrito.cloneNode(true)
    fragment.appendChild(clone)
  })
  items.appendChild(fragment)
  cambiarFooter()

  localStorage.setItem("carrito", JSON.stringify(carrito))

}
const cambiarFooter= ()=> {
  footer.innerHTML= ""
  if(Object.keys(carrito).length === 0){
    footer.innerHTML = "Carrito vacio"
    return
  }
  const nCantidad= Object.values(carrito).reduce((acc,{cantidad}) => acc + cantidad,0)
  const nPrecio = Object.values(carrito).reduce ((acc,{cantidad,precio}) =>acc+ cantidad * precio,0)
  templateFooter.querySelectorAll("td")[0].textContent=nCantidad
  templateFooter.querySelector("span").textContent=nPrecio
  const clone=templateFooter.cloneNode(true)
  fragment.appendChild(clone)
  footer.appendChild(fragment)

  const btnVaciar= document.getElementById("vaciar-carrito")
  btnVaciar.addEventListener("click", ()=>{
    Toastify({
      text: "Producto eliminado del carrito",
      duration: 3000,
      destination: "https://github.com/apvarun/toastify-js",
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "linear-gradient(to right,  #FD8D00 ,#D18B33)",
      },
      onClick: function(){} // Callback after click
    }).showToast();
    carrito={}
    mostrarCarrito()
    localStorage.removeItem("carrito");
    
  })
  
  const btnComprar= document.getElementById("comprar-carrito")
  btnComprar.addEventListener("click",()=>{
    carrito={}
    mostrarCarrito()
    Swal.fire(
      'Compra realizada!',
      'muchas gracias!',
      'success'
    )
    // alert("Compra realizada con éxito!");
    localStorage.removeItem("carrito");
    // document.getElementById("carrito").innerHTML = "";
  }
  )

}