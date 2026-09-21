/* =========================================================
   BIENESTAR TOTAL — CATALOGO INTERACTIVO
   Carga productos desde products.json, maneja galería,
   búsqueda/filtros, carrito flotante y checkout por WhatsApp.
========================================================= */

/* Número de WhatsApp Business (solo dígitos, con código de país) donde llegan los pedidos */
const WHATSAPP_NUMBER = "50487353593";

/* =========================================================
   DATOS: DEPARTAMENTOS Y MUNICIPIOS DE HONDURAS
========================================================= */
const HONDURAS = {
  "Atlántida": ["La Ceiba","El Porvenir","Esparta","Jutiapa","La Masica","San Francisco","Tela","Arizona"],
  "Colón": ["Trujillo","Balfate","Bonito Oriental","Iriona","Limón","Sabá","Santa Fe","Santa Rosa de Aguán","Sonaguera","Tocoa"],
  "Comayagua": ["Comayagua","Ajuterique","El Rosario","Esquías","Humuya","La Libertad","La Trinidad","Lamaní","Lejamaní","Meámbar","Minas de Oro","Ojos de Agua","San Jerónimo","San José de Comayagua","San José del Potrero","San Luis","San Sebastián","Siguatepeque","Villa de San Antonio","Las Lajas","Taulabé"],
  "Copán": ["Santa Rosa de Copán","Cabañas","Concepción","Copán Ruinas","Corquín","Cucuyagua","Dolores","Dulce Nombre","El Paraíso","Florida","La Jigua","La Unión","Nueva Arcadia","San Agustín","San Antonio","San Jerónimo","San José","San Juan de Opoa","San Nicolás","San Pedro de Copán","Santa Rita","Trinidad de Copán","Veracruz"],
  "Cortés": ["San Pedro Sula","Choloma","La Lima","Omoa","Pimienta","Potrerillos","Puerto Cortés","San Antonio de Cortés","San Francisco de Yojoa","San Manuel","Santa Cruz de Yojoa","Villanueva"],
  "El Paraíso": ["Yuscarán","Alauca","Danlí","El Paraíso","Güinope","Jacaleapa","Liure","Morocelí","Oropolí","Potrerillos","San Antonio de Flores","San Lucas","San Matías","Soledad","Teupasenti","Texiguat","Vado Ancho","Yauyupe","Trojes"],
  "Francisco Morazán": ["Distrito Central (Tegucigalpa)","Alubarén","Cedros","Curarén","El Porvenir","Guaimaca","Lepaterique","Maraita","Marale","Nueva Armenia","Ojojona","Orica","Reitoca","Sabanagrande","San Antonio de Oriente","San Buenaventura","San Ignacio","San Juan de Flores","San Miguelito","Santa Ana","Santa Lucía","Talanga","Tatumbla","Valle de Ángeles","Vallecillo","Villa de San Francisco"],
  "Gracias a Dios": ["Puerto Lempira","Brus Laguna","Ahuas","Juan Francisco Bulnes","Ramón Villeda Morales","Wampusirpi"],
  "Intibucá": ["La Esperanza","Camasca","Colomoncagua","Concepción","Dolores","Intibucá","Jesús de Otoro","Magdalena","Masaguara","San Antonio","San Isidro","San Juan","San Marcos de la Sierra","Santa Lucía","Yamaranguila","San Francisco de Opalaca"],
  "Islas de la Bahía": ["Roatán","Guanaja","José Santos Guardiola","Utila"],
  "La Paz": ["La Paz","Aguanqueterique","Cabañas","Cane","Chinacla","Guajiquiro","Lauterique","Marcala","Mercedes de Oriente","Opatoro","San Antonio del Norte","San José","San Juan","San Pedro de Tutule","Santa Ana","Santa Elena","Santa María","Santiago de Puringla","Yarula"],
  "Lempira": ["Gracias","Belén","Candelaria","Cololaca","Erandique","Gualcince","Guarita","La Campa","La Iguala","Las Flores","La Unión","La Virtud","Lepaera","Mapulaca","Piraera","San Andrés","San Francisco","San Juan Guarita","San Manuel Colohete","San Rafael","San Sebastián","Santa Cruz","Talgua","Tambla","Tomalá","Valladolid","Virginia","San Marcos de Caiquín"],
  "Ocotepeque": ["Nueva Ocotepeque","Belén Gualcho","Concepción","Dolores Merendón","Fraternidad","La Encarnación","La Labor","Lucerna","Mercedes","San Fernando","San Francisco del Valle","San Jorge","San Marcos","Santa Fe","Sensenti","Sinuapa"],
  "Olancho": ["Juticalpa","Campamento","Catacamas","Concordia","Dulce Nombre de Culmí","El Rosario","Esquipulas del Norte","Gualaco","Guarizama","Guata","Guayape","Jano","La Unión","Mangulile","Manto","Salamá","San Esteban","Santa María del Real","Silca","Yocón","Patuca"],
  "Santa Bárbara": ["Santa Bárbara","Arada","Atima","Azacualpa","Ceguaca","Concepción del Norte","Concepción del Sur","Chinda","El Níspero","Gualala","Ilama","Macuelizo","Naranjito","Nuevo Celilac","Petoa","Protección","Quimistán","San Francisco de Ojuera","San José de Colinas","San Luis","San Marcos","San Nicolás","San Pedro Zacapa","San Vicente Centenario","Santa Rita","Trinidad","Nueva Frontera"],
  "Valle": ["Nacaome","Alianza","Amapala","Aramecina","Caridad","Goascorán","Langue","San Francisco de Coray","San Lorenzo"],
  "Yoro": ["Yoro","Arenal","El Negrito","El Progreso","Jocón","Morazán","Olanchito","Santa Rita","Sulaco","Victoria","Yorito"]
};

/* =========================================================
   ESTADO
========================================================= */
let products = [];
let currentProduct = null;
let currentModalQty = 1;
let activeCategory = "Todos";
let cart = loadCart();

/* =========================================================
   UTILIDADES
========================================================= */
function formatL(n) {
  return "L. " + n.toLocaleString("es-HN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function averageRating(p) {
  if (p.reviews && p.reviews.length) {
    const sum = p.reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / p.reviews.length;
  }
  return p.rating || 5;
}

function starsHtml(avg) {
  const rounded = Math.round(avg * 2) / 2;
  let html = '<span class="stars">';
  for (let i = 1; i <= 5; i++) {
    if (rounded >= i) html += "★";
    else if (rounded >= i - 0.5) html += "★"; // simplificado: media estrella redondeada hacia arriba
    else html += "☆";
  }
  html += "</span>";
  return html;
}

function reviewAvatar(review) {
  if (review.photo) {
    return `<img src="${review.photo}" alt="${escapeHtml(review.name)}" class="w-9 h-9 rounded-full object-cover shrink-0">`;
  }
  const initial = (review.name || "?").trim().charAt(0).toUpperCase();
  return `<div class="w-9 h-9 rounded-full bg-primary/10 text-primary font-heading font-bold flex items-center justify-center shrink-0">${initial}</div>`;
}

function loadCart() {
  try {
    const raw = localStorage.getItem("bt_cart");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem("bt_cart", JSON.stringify(cart));
  } catch (e) { /* almacenamiento no disponible, se ignora */ }
}

/* =========================================================
   CARGA DE PRODUCTOS (products.json)
========================================================= */
fetch("products.json")
  .then(res => res.json())
  .then(data => {
    products = data;
    renderFilterBar();
    applyFilters();
    updateCartUI();
  })
  .catch(err => {
    console.error("No se pudieron cargar los productos:", err);
    document.getElementById("product-grid").innerHTML =
      '<p class="col-span-full text-center text-slate-500 text-sm py-10">No se pudo cargar el catálogo. Intenta recargar la página.</p>';
  });

/* =========================================================
   BUSCADOR Y FILTROS POR CATEGORIA
========================================================= */
const searchInput = document.getElementById("search-input");
const filterBar = document.getElementById("filter-bar");
const grid = document.getElementById("product-grid");
const emptyState = document.getElementById("empty-state");

function renderFilterBar() {
  const categories = ["Todos", ...new Set(products.map(p => p.category))];
  filterBar.innerHTML = categories.map(cat => `
    <button type="button" data-category="${escapeHtml(cat)}"
      class="filter-btn ${cat === activeCategory ? "active" : ""} border-2 border-slate-200 text-slate-600 text-xs font-bold px-4 py-1.5 rounded-full">
      ${escapeHtml(cat)}
    </button>
  `).join("");
}

filterBar.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-category]");
  if (!btn) return;
  activeCategory = btn.dataset.category;
  filterBar.querySelectorAll(".filter-btn").forEach(el => {
    el.classList.toggle("active", el.dataset.category === activeCategory);
  });
  applyFilters();
});

searchInput.addEventListener("input", applyFilters);

function applyFilters() {
  const term = searchInput.value.trim().toLowerCase();
  const filtered = products.filter(p => {
    const matchesCategory = activeCategory === "Todos" || p.category === activeCategory;
    const matchesTerm = !term || p.title.toLowerCase().includes(term);
    return matchesCategory && matchesTerm;
  });
  renderGrid(filtered);
}

/* =========================================================
   RENDER: GRID DE PRODUCTOS (con galería de miniaturas)
========================================================= */
function renderGrid(list) {
  emptyState.classList.toggle("hidden", list.length > 0);
  grid.innerHTML = list.map(p => {
    const avg = averageRating(p);
    const thumbs = p.images.slice(0, 4);
    return `
    <div class="card-hover bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
      <div class="relative aspect-square bg-slate-100 overflow-hidden cursor-pointer" data-open-modal="${p.id}">
        <img data-main-for="${p.id}" src="${thumbs[0]}" alt="${escapeHtml(p.title)}" class="w-full h-full object-cover">
        <span class="absolute top-3 left-3 bg-accent text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow">${escapeHtml(p.badge)}</span>
      </div>
      <div class="grid grid-cols-4 gap-1.5 p-2 bg-slate-50 border-b border-slate-100">
        ${thumbs.map((img, i) => `
          <button type="button" class="thumb-btn aspect-square rounded-md overflow-hidden ${i === 0 ? "active" : ""}" data-thumb-for="${p.id}" data-img="${img}">
            <img src="${img}" class="w-full h-full object-cover pointer-events-none" alt="Miniatura ${i + 1}">
          </button>
        `).join("")}
      </div>
      <div class="p-4 flex flex-col flex-1">
        <span class="inline-block w-fit bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase mb-2">${escapeHtml(p.category)}</span>
        <h3 class="font-heading font-bold text-sm sm:text-base text-dark mb-1.5 leading-snug flex-1 cursor-pointer" data-open-modal="${p.id}">${escapeHtml(p.title)}</h3>
        <div class="flex items-center gap-1.5 mb-2">
          ${starsHtml(avg)}
          <span class="text-[11px] text-slate-400">(${p.reviews.length})</span>
        </div>
        <div class="flex items-baseline gap-2 mb-3">
          <span class="text-slate-400 line-through text-xs">${formatL(p.originalPrice)}</span>
          <span class="text-primary font-heading font-extrabold text-lg">${formatL(p.price)}</span>
        </div>
        <div class="flex gap-2">
          <button type="button" class="flex-1 border-2 border-primary text-primary hover:bg-primary/10 font-heading font-bold text-xs py-2.5 rounded-xl transition-colors" data-open-modal="${p.id}">
            Ver Detalles
          </button>
          <button type="button" class="flex-1 bg-accent hover:bg-orange-600 text-white font-heading font-bold text-xs py-2.5 rounded-xl transition-colors" data-quick-add="${p.id}">
            Agregar
          </button>
        </div>
      </div>
    </div>`;
  }).join("");
}

/* Delegación de eventos del grid: abrir modal, agregar rápido y cambiar miniatura */
grid.addEventListener("click", (e) => {
  const openBtn = e.target.closest("[data-open-modal]");
  const addBtn = e.target.closest("[data-quick-add]");
  const thumbBtn = e.target.closest("[data-thumb-for]");

  if (thumbBtn) {
    setCardMainImage(thumbBtn.dataset.thumbFor, thumbBtn.dataset.img, thumbBtn);
    return;
  }
  if (addBtn) {
    addToCart(Number(addBtn.dataset.quickAdd), 1);
    showToast("Producto agregado al carrito");
    return;
  }
  if (openBtn) {
    openModal(Number(openBtn.dataset.openModal));
  }
});

/* Hover en miniaturas (escritorio) también cambia la imagen principal */
grid.addEventListener("mouseover", (e) => {
  const thumbBtn = e.target.closest("[data-thumb-for]");
  if (thumbBtn) setCardMainImage(thumbBtn.dataset.thumbFor, thumbBtn.dataset.img, thumbBtn);
});

function setCardMainImage(productId, img, thumbBtn) {
  const mainImg = grid.querySelector(`[data-main-for="${productId}"]`);
  if (mainImg) mainImg.src = img;
  const card = thumbBtn.closest(".card-hover");
  card.querySelectorAll("[data-thumb-for]").forEach(el => el.classList.toggle("active", el === thumbBtn));
}

/* =========================================================
   MODAL DE PRODUCTO (galería, reseñas, agregar al carrito)
========================================================= */
const overlay = document.getElementById("modal-overlay");
const panel = document.getElementById("modal-panel");

function openModal(productId) {
  currentProduct = products.find(p => p.id === productId);
  if (!currentProduct) return;
  currentModalQty = 1;

  const p = currentProduct;
  document.getElementById("modal-category").textContent = p.category;
  document.getElementById("modal-title").textContent = p.title;
  document.getElementById("modal-description").textContent = p.description || "";
  document.getElementById("modal-badge").textContent = p.badge;
  document.getElementById("modal-main-img").src = p.images[0];
  document.getElementById("modal-main-img").alt = p.title;
  document.getElementById("modal-original-price").textContent = formatL(p.originalPrice);
  document.getElementById("modal-unit-price").textContent = formatL(p.price);
  document.getElementById("modal-qty-value").textContent = "1";

  const avg = averageRating(p);
  document.getElementById("modal-rating").innerHTML =
    `${starsHtml(avg)}<span class="text-xs text-slate-500">${avg.toFixed(1)} · ${p.reviews.length} reseñas</span>`;

  document.getElementById("modal-thumbs").innerHTML = p.images.slice(0, 4).map((img, i) => `
    <button type="button" data-modal-thumb data-img="${img}" class="thumb-btn aspect-square rounded-lg overflow-hidden ${i === 0 ? "active" : ""}">
      <img src="${img}" class="w-full h-full object-cover pointer-events-none" alt="Miniatura ${i + 1}">
    </button>
  `).join("");

  document.getElementById("modal-benefits").innerHTML = p.benefits.map(b => `
    <li class="flex items-start gap-2 text-sm text-slate-600">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
      <span>${escapeHtml(b)}</span>
    </li>
  `).join("");

  document.getElementById("modal-reviews").innerHTML = (p.reviews || []).map(r => `
    <div class="flex items-start gap-3">
      ${reviewAvatar(r)}
      <div>
        <div class="flex items-center gap-2">
          <p class="font-bold text-xs text-dark">${escapeHtml(r.name)}</p>
          <span class="stars text-xs">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</span>
        </div>
        <p class="text-xs text-slate-500 mt-0.5">${escapeHtml(r.comment)}</p>
      </div>
    </div>
  `).join("");

  overlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => {
    overlay.classList.remove("opacity-0");
    panel.classList.remove("opacity-0", "translate-y-6", "sm:scale-95");
  });
}

document.querySelector("#modal-panel").addEventListener("click", (e) => {
  const thumb = e.target.closest("[data-modal-thumb]");
  if (!thumb) return;
  document.getElementById("modal-main-img").src = thumb.dataset.img;
  document.querySelectorAll("[data-modal-thumb]").forEach(el => el.classList.toggle("active", el === thumb));
});
document.querySelector("#modal-panel").addEventListener("mouseover", (e) => {
  const thumb = e.target.closest("[data-modal-thumb]");
  if (!thumb) return;
  document.getElementById("modal-main-img").src = thumb.dataset.img;
  document.querySelectorAll("[data-modal-thumb]").forEach(el => el.classList.toggle("active", el === thumb));
});

function closeModal() {
  overlay.classList.add("opacity-0");
  panel.classList.add("opacity-0", "translate-y-6", "sm:scale-95");
  document.body.style.overflow = "";
  setTimeout(() => overlay.classList.add("hidden"), 250);
}

document.getElementById("modal-close-btn").addEventListener("click", closeModal);
overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });

document.getElementById("modal-qty-minus").addEventListener("click", () => {
  currentModalQty = Math.max(1, currentModalQty - 1);
  document.getElementById("modal-qty-value").textContent = currentModalQty;
});
document.getElementById("modal-qty-plus").addEventListener("click", () => {
  currentModalQty = Math.min(20, currentModalQty + 1);
  document.getElementById("modal-qty-value").textContent = currentModalQty;
});
document.getElementById("modal-add-cart-btn").addEventListener("click", () => {
  if (!currentProduct) return;
  addToCart(currentProduct.id, currentModalQty);
  showToast("Producto agregado al carrito");
  closeModal();
});

/* =========================================================
   CARRITO DE COMPRAS
========================================================= */
function addToCart(productId, qty) {
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty });
  }
  saveCart();
  updateCartUI();
}

function updateCartQty(productId, qty) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  if (qty <= 0) {
    cart = cart.filter(i => i.id !== productId);
  } else {
    item.qty = qty;
  }
  saveCart();
  updateCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  updateCartUI();
}

function cartLines() {
  return cart
    .map(item => {
      const product = products.find(p => p.id === item.id);
      if (!product) return null;
      return { product, qty: item.qty, subtotal: product.price * item.qty };
    })
    .filter(Boolean);
}

function cartTotal() {
  return cartLines().reduce((sum, line) => sum + line.subtotal, 0);
}

function cartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function updateCartUI() {
  const count = cartCount();
  [document.getElementById("cart-badge"), document.getElementById("cart-fab-badge")].forEach(badge => {
    badge.textContent = count;
    badge.classList.toggle("hidden", count === 0);
  });

  const lines = cartLines();
  const list = document.getElementById("cart-items-list");
  document.getElementById("cart-empty-msg").classList.toggle("hidden", lines.length > 0);
  document.getElementById("cart-footer").classList.toggle("hidden", lines.length === 0);

  list.innerHTML = lines.map(({ product, qty, subtotal }) => `
    <div class="flex gap-3 items-center border-b border-slate-100 pb-4">
      <img src="${product.images[0]}" alt="${escapeHtml(product.title)}" class="w-16 h-16 rounded-lg object-cover shrink-0">
      <div class="flex-1 min-w-0">
        <p class="font-bold text-xs text-dark line-clamp-2">${escapeHtml(product.title)}</p>
        <p class="text-primary font-heading font-bold text-sm mt-1">${formatL(product.price)}</p>
        <div class="flex items-center gap-2 mt-2">
          <button type="button" class="w-7 h-7 rounded-md border border-slate-200 text-sm font-bold" data-cart-qty="${product.id}" data-delta="-1">-</button>
          <span class="text-sm font-bold w-5 text-center">${qty}</span>
          <button type="button" class="w-7 h-7 rounded-md border border-slate-200 text-sm font-bold" data-cart-qty="${product.id}" data-delta="1">+</button>
          <button type="button" class="ml-auto text-[11px] text-red-500 font-semibold" data-cart-remove="${product.id}">Quitar</button>
        </div>
      </div>
      <span class="font-heading font-extrabold text-sm text-dark shrink-0">${formatL(subtotal)}</span>
    </div>
  `).join("");

  document.getElementById("cart-total").textContent = formatL(cartTotal());
}

document.getElementById("cart-items-list").addEventListener("click", (e) => {
  const qtyBtn = e.target.closest("[data-cart-qty]");
  const removeBtn = e.target.closest("[data-cart-remove]");
  if (qtyBtn) {
    const id = Number(qtyBtn.dataset.cartQty);
    const delta = Number(qtyBtn.dataset.delta);
    const item = cart.find(i => i.id === id);
    if (item) updateCartQty(id, item.qty + delta);
  }
  if (removeBtn) {
    removeFromCart(Number(removeBtn.dataset.cartRemove));
  }
});

/* =========================================================
   CARRITO: ABRIR / CERRAR DRAWER
========================================================= */
const cartDrawer = document.getElementById("cart-drawer");
const cartDrawerOverlay = document.getElementById("cart-drawer-overlay");
const cartViewItems = document.getElementById("cart-view-items");
const cartViewCheckout = document.getElementById("cart-view-checkout");
const cartViewSuccess = document.getElementById("cart-view-success");
const cartCheckoutBtn = document.getElementById("cart-checkout-btn");
const cartSubmitBtn = document.getElementById("cart-submit-btn");

function openCartDrawer() {
  cartViewItems.classList.remove("hidden");
  cartViewCheckout.classList.add("hidden");
  cartViewSuccess.classList.add("hidden");
  cartCheckoutBtn.classList.remove("hidden");
  cartSubmitBtn.classList.add("hidden");
  document.getElementById("cart-footer").classList.toggle("hidden", cartLines().length === 0);

  cartDrawerOverlay.classList.remove("hidden");
  cartDrawer.classList.remove("translate-x-full");
  cartDrawer.classList.add("translate-x-0");
  document.body.style.overflow = "hidden";
}

function closeCartDrawer() {
  cartDrawer.classList.remove("translate-x-0");
  cartDrawer.classList.add("translate-x-full");
  document.body.style.overflow = "";
  setTimeout(() => cartDrawerOverlay.classList.add("hidden"), 300);
}

document.getElementById("cart-open-btn").addEventListener("click", openCartDrawer);
document.getElementById("cart-fab").addEventListener("click", openCartDrawer);
document.getElementById("cart-close-btn").addEventListener("click", closeCartDrawer);
cartDrawerOverlay.addEventListener("click", closeCartDrawer);
document.getElementById("success-close-btn").addEventListener("click", closeCartDrawer);

/* =========================================================
   SELECT DE DEPARTAMENTOS / MUNICIPIOS
========================================================= */
const departmentSelect = document.getElementById("field-department");
const municipalitySelect = document.getElementById("field-municipality");

Object.keys(HONDURAS).forEach(dept => {
  const opt = document.createElement("option");
  opt.value = dept;
  opt.textContent = dept;
  departmentSelect.appendChild(opt);
});

departmentSelect.addEventListener("change", () => {
  const dept = departmentSelect.value;
  municipalitySelect.innerHTML = '<option value="" disabled selected>Selecciona...</option>';
  if (dept && HONDURAS[dept]) {
    municipalitySelect.disabled = false;
    HONDURAS[dept].forEach(m => {
      const opt = document.createElement("option");
      opt.value = m;
      opt.textContent = m;
      municipalitySelect.appendChild(opt);
    });
  } else {
    municipalitySelect.disabled = true;
  }
});

/* =========================================================
   CHECKOUT: FORMULARIO Y ENVIO POR WHATSAPP
========================================================= */
const form = document.getElementById("order-form");
const phoneInput = document.getElementById("field-phone");

phoneInput.addEventListener("input", () => {
  let digits = phoneInput.value.replace(/\D/g, "").slice(0, 8);
  phoneInput.value = digits.length > 4 ? digits.slice(0, 4) + "-" + digits.slice(4) : digits;
});

function isPhoneValid(value) {
  return /^\d{8}$/.test(value.replace(/\D/g, ""));
}

function resetForm() {
  form.reset();
  municipalitySelect.innerHTML = '<option value="" disabled selected>Elige depto. primero</option>';
  municipalitySelect.disabled = true;
  form.querySelectorAll("input, select, textarea").forEach(el => el.classList.remove("touched", "border-red-500"));
  form.querySelectorAll(".error-msg").forEach(el => el.classList.add("hidden"));
}

cartCheckoutBtn.addEventListener("click", () => {
  if (cartLines().length === 0) return;
  cartViewItems.classList.add("hidden");
  cartViewCheckout.classList.remove("hidden");
  cartCheckoutBtn.classList.add("hidden");
  cartSubmitBtn.classList.remove("hidden");
});

document.getElementById("checkout-back-btn").addEventListener("click", () => {
  cartViewCheckout.classList.add("hidden");
  cartViewItems.classList.remove("hidden");
  cartCheckoutBtn.classList.remove("hidden");
  cartSubmitBtn.classList.add("hidden");
});

cartSubmitBtn.addEventListener("click", () => {
  const nameEl = document.getElementById("field-name");
  const addressEl = document.getElementById("field-address");
  const referenceEl = document.getElementById("field-reference");

  let valid = true;
  const fieldsToCheck = [
    { el: nameEl, ok: nameEl.value.trim().length > 2 },
    { el: phoneInput, ok: isPhoneValid(phoneInput.value) },
    { el: departmentSelect, ok: !!departmentSelect.value },
    { el: municipalitySelect, ok: !!municipalitySelect.value },
    { el: addressEl, ok: addressEl.value.trim().length > 4 },
    { el: referenceEl, ok: referenceEl.value.trim().length > 2 }
  ];

  fieldsToCheck.forEach(({ el, ok }) => {
    el.classList.add("touched");
    const errorMsg = el.closest("div").querySelector(".error-msg");
    if (!ok) {
      valid = false;
      el.classList.add("border-red-500");
      if (errorMsg) errorMsg.classList.remove("hidden");
    } else {
      el.classList.remove("border-red-500");
      if (errorMsg) errorMsg.classList.add("hidden");
    }
  });

  if (!valid) return;

  const lines = cartLines();
  const total = cartTotal();
  const customerName = nameEl.value.trim();
  const customerPhone = phoneInput.value.trim();
  const customerAddress = addressEl.value.trim();
  const customerReference = referenceEl.value.trim();

  const orderMessage =
    `🛒 *Nuevo Pedido - Pago Contra Entrega*\n\n` +
    lines.map(({ product, qty, subtotal }) => `• ${product.title} x${qty} — ${formatL(subtotal)}`).join("\n") +
    `\n\n*Total a pagar:* ${formatL(total)}\n\n` +
    `*Nombre:* ${customerName}\n` +
    `*Teléfono:* ${customerPhone}\n` +
    `*Departamento:* ${departmentSelect.value}\n` +
    `*Municipio:* ${municipalitySelect.value}\n` +
    `*Dirección exacta:* ${customerAddress}\n` +
    `*Punto de referencia:* ${customerReference}`;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderMessage)}`;
  document.getElementById("whatsapp-redirect-link").href = whatsappUrl;
  window.open(whatsappUrl, "_blank");

  cartViewCheckout.classList.add("hidden");
  cartViewSuccess.classList.remove("hidden");
  document.getElementById("cart-footer").classList.add("hidden");

  cart = [];
  saveCart();
  updateCartUI();
  resetForm();
});

/* =========================================================
   TOAST SIMPLE
========================================================= */
let toastTimeout = null;
function showToast(message) {
  let toast = document.getElementById("bt-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "bt-toast";
    toast.className = "fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-dark text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg opacity-0 transition-opacity duration-200 pointer-events-none";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = "1";
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => { toast.style.opacity = "0"; }, 2000);
}
