// ── 1. FILTROS DEL MENÚ ──
const filterBtns = document.querySelectorAll('.filter-btn');
const menuCards = document.querySelectorAll('.menu-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    menuCards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filter === 'todos' || category === filter) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ── 2. CARRITO DE COMPRAS Y CONEXIÓN CON RESERVAS ──
let cart = [];
const cartBtn = document.getElementById('cart-btn');
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const checkoutBtn = document.getElementById('checkout-btn');

document.querySelectorAll('.card-btn').forEach(button => {
  button.addEventListener('click', () => {
    const name = button.getAttribute('data-name');
    const price = parseInt(button.getAttribute('data-price'));

    cart.push({ name, price });
    updateCartUI();
    mostrarCartelNeon(`¡${name} agregado!`, "Producto sumado a tu carga actual.");
  });
});

cartBtn.addEventListener('click', () => cartModal.classList.add('open'));
closeCart.addEventListener('click', () => cartModal.classList.remove('open'));
cartModal.addEventListener('click', (e) => {
  if (e.target === cartModal) cartModal.classList.remove('open');
});

function updateCartUI() {
  cartCount.textContent = cart.length;
  
  // Elementos del resumen de pedido en el formulario de reservas
  const textoResumen = document.getElementById('resumen-pedido-texto');
  const inputOculto = document.getElementById('input-pedido-oculto');

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="empty-cart">Tu carrito está vacío.</p>`;
    cartTotalPrice.textContent = `$0`;
    if (textoResumen) textoResumen.textContent = 'Ningún plato seleccionado (puedes reservar igual)';
    if (inputOculto) inputOculto.value = 'Sin selección de menú';
    return;
  }

  cartItemsContainer.innerHTML = '';
  let total = 0;
  let nombresPlatos = [];

  cart.forEach((item) => {
    total += item.price;
    nombresPlatos.push(`${item.name} ($${item.price.toLocaleString()})`);
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.innerHTML = `
      <span class="cart-item-name">${item.name}</span>
      <span class="cart-item-price">$${item.price.toLocaleString()}</span>
    `;
    cartItemsContainer.appendChild(itemDiv);
  });

  cartTotalPrice.textContent = `$${total.toLocaleString()}`;

  // Sincronizamos los platos elegidos con el formulario de reservas
  const listaConcatenada = nombresPlatos.join(' | ');
  if (textoResumen) textoResumen.textContent = listaConcatenada;
  if (inputOculto) inputOculto.value = listaConcatenada;
}

checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }
  cartModal.classList.remove('open');
  // Desplazamos la pantalla hacia la sección de reservas para completar los datos
  document.getElementById('reserva').scrollIntoView({ behavior: 'smooth' });
  mostrarCartelNeon("¡CARRITO LISTO!", "Completá tus datos abajo para confirmar la reserva y el pedido.");
});

// ── 3. RESERVAS CONECTADAS A MYSQL VIA PHP ──
const reservaForm = document.getElementById('reserva-form');

reservaForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(reservaForm);

  fetch('guardar_reserva.php', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      const nombreUsuario = document.getElementById('nombre').value;
      mostrarCartelNeon(`¡LISTO, ${nombreUsuario.toUpperCase()}!`, "Reserva y pedido registrados correctamente en MySQL.");
      reservaForm.reset();
      
      // Limpiamos el carrito y restablecemos el texto del resumen tras enviar con éxito
      cart = [];
      updateCartUI();
    } else {
      alert("⚠️ Error: " + data.message);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert("⚠️ Ocurrió un error al conectar con el servidor local de MySQL.");
  });
});

// ── FUNCIÓN DE NOTIFICACIÓN FLOTANTE CYBERPUNK ──
function mostrarCartelNeon(titulo, mensaje) {
  const cartel = document.createElement('div');
  cartel.className = 'cartel-notificacion';
  cartel.innerHTML = `
    <div class="cartel-header-notif">// NEON NOTIFICACIÓN</div>
    <div class="cartel-body-notif">
      <p>${titulo}</p>
      <small>${mensaje}</small>
    </div>
    <div class="cartel-progress"></div>
  `;

  document.body.appendChild(cartel);
  setTimeout(() => cartel.classList.add('show'), 100);

  setTimeout(() => {
    cartel.classList.remove('show');
    setTimeout(() => cartel.remove(), 400);
  }, 4000);
}