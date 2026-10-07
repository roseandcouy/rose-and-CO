let cart = JSON.parse(localStorage.getItem("roseCart") || "[]");
let currentFilter = "Todos";

const money = n => "$U " + n.toLocaleString("es-UY");
const grid = document.getElementById("productGrid");


function renderProducts(){

  const query = document
    .getElementById("search")
    .value
    .toLowerCase()
    .trim();


  const filtered = products.filter(p =>

    (currentFilter === "Todos" || p.category === currentFilter) &&

    `${p.name} ${p.brand} ${p.category}`
      .toLowerCase()
      .includes(query)

  );


  grid.innerHTML = filtered.map(p => {

    const image =
      p.images && p.images.length
        ? p.images[0]
        : p.image
          ? p.image
          : null;


    return `

      <article
        class="product-card"
        onclick="openProduct(${p.id})"
      >

        <div class="product-image">

          ${
            image
              ? `<img src="./${image}" alt="${p.brand} ${p.name}">`
              : `<div class="shape ${p.type || ""}">
                  ${
                    p.type === "flat"
                      ? "BEAUTY"
                      : p.brand.split(" ")[0].toUpperCase()
                  }
                </div>`
          }

        </div>


        <div class="product-info">

          <div class="category-name">
            ${p.category}
          </div>

          <h3>
            ${p.brand} ${p.name}
          </h3>

          <div class="price">
            ${money(p.price)}
          </div>

          <button
            class="add"
            onclick="event.stopPropagation(); addToCart(${p.id})"
          >
            ♧ &nbsp; AGREGAR AL CARRITO
          </button>

        </div>

      </article>

    `;

  }).join("") || `

    <p style="
      grid-column:1/-1;
      text-align:center;
      padding:40px
    ">
      No encontramos productos con esa búsqueda ♡
    </p>

  `;

}


function openProduct(id){

  window.location.href =
    `producto.html?id=${id}`;

}


function addToCart(id){

  const found =
    cart.find(i => i.id === id);

  if(found){

    found.qty++;

  }else{

    cart.push({
      id:id,
      qty:1
    });

  }

  saveCart();

  openCart();
}


function saveCart(){

  localStorage.setItem(
    "roseCart",
    JSON.stringify(cart)
  );

  renderCart();

}


function renderCart(){

  const items =
    document.getElementById("cartItems");

  const count =
    cart.reduce(
      (sum,item) => sum + item.qty,
      0
    );


  document.getElementById(
    "cartCount"
  ).textContent = count;


  if(!cart.length){

    items.innerHTML =
      '<div class="empty-cart">Tu carrito está vacío ♡</div>';

    document.getElementById(
      "cartTotal"
    ).textContent = money(0);

    return;
  }


  let total = 0;


  items.innerHTML = cart.map(i => {

    const p =
      products.find(
        product => product.id === i.id
      );


    if(!p){
      return "";
    }


    total += p.price * i.qty;


    return `

      <div class="cart-item">

        <div class="cart-thumb">
          ${p.brand.split(" ")[0]}
        </div>


        <div>

          <h4>
            ${p.brand} ${p.name}
          </h4>

          <p>
            ${money(p.price)}
            · Cantidad: ${i.qty}
          </p>


          <div class="qty">

            <button
              onclick="changeQty(${p.id},-1)"
            >
              −
            </button>

            <span>
              ${i.qty}
            </span>

            <button
              onclick="changeQty(${p.id},1)"
            >
              +
            </button>

            <button
              class="remove"
              onclick="removeItem(${p.id})"
            >
              Eliminar
            </button>

          </div>

        </div>


        <strong>
          ${money(p.price * i.qty)}
        </strong>

      </div>

    `;

  }).join("");


  document.getElementById(
    "cartTotal"
  ).textContent = money(total);

}


function changeQty(id,delta){

  const item =
    cart.find(i => i.id === id);

  if(!item){
    return;
  }


  item.qty += delta;


  if(item.qty <= 0){

    cart =
      cart.filter(i => i.id !== id);

  }


  saveCart();

}


function removeItem(id){

  cart =
    cart.filter(i => i.id !== id);

  saveCart();

}


function openCart(){

  document
    .getElementById("cartPanel")
    .classList
    .add("open");

  document
    .getElementById("overlay")
    .classList
    .add("show");

}


function closeCart(){

  document
    .getElementById("cartPanel")
    .classList
    .remove("open");

  document
    .getElementById("overlay")
    .classList
    .remove("show");

}


document
  .getElementById("cartButton")
  .addEventListener(
    "click",
    openCart
  );


document
  .getElementById("closeCart")
  .addEventListener(
    "click",
    closeCart
  );


document
  .getElementById("overlay")
  .addEventListener(
    "click",
    closeCart
  );


document
  .getElementById("search")
  .addEventListener(
    "input",
    renderProducts
  );


document
  .querySelectorAll(".filter")
  .forEach(btn =>

    btn.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".filter")
          .forEach(
            x => x.classList.remove("active")
          );


        btn.classList.add("active");

        currentFilter =
          btn.dataset.filter;

        renderProducts();

      }
    )

  );


document
  .querySelectorAll(".category")
  .forEach(btn =>

    btn.addEventListener(
      "click",
      () => {

        currentFilter =
          btn.dataset.category;


        document
          .querySelectorAll(".filter")
          .forEach(
            x =>
              x.classList.toggle(
                "active",
                x.dataset.filter === currentFilter
              )
          );


        renderProducts();


        document
          .getElementById("tienda")
          .scrollIntoView({
            behavior:"smooth"
          });

      }
    )

  );


document
  .getElementById("checkout")
  .addEventListener(
    "click",
    () => {

      if(!cart.length){

        alert(
          "Tu carrito está vacío."
        );

        return;

      }


      let total = 0;

      let message =
        "Hola Rosé & Co. ♡ Quiero realizar el siguiente pedido:%0A%0A";


      cart.forEach(i => {

        const p =
          products.find(
            x => x.id === i.id
          );


        if(!p){
          return;
        }


        total +=
          p.price * i.qty;


        message +=
          `• ${p.brand} ${p.name} x${i.qty} — ${money(p.price * i.qty)}%0A`;

      });


      message +=
        `%0A*Total: ${money(total)}*%0A%0ASé que los productos son por encargo y demoran aproximadamente 1 mes.`;


      window.open(
        `https://wa.me/59898158619?text=${message}`,
        "_blank"
      );

    }
  );


document
  .querySelector(".mobile-menu")
  .addEventListener(
    "click",
    () =>

      document
        .getElementById("mainNav")
        .classList
        .toggle("open")

  );


document
  .querySelectorAll("#mainNav a")
  .forEach(a =>

    a.addEventListener(
      "click",
      () =>

        document
          .getElementById("mainNav")
          .classList
          .remove("open")

    )

  );


renderProducts();

renderCart();
