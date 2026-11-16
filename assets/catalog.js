/* =========================================================
   RENDER: TARJETA Y GRID DE PRODUCTOS POR CATEGORIA
========================================================= */
function renderProductCard(p) {
  const productUrl = `/producto/${p.id}`;
  return `
  <div class="card-hover bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col cursor-pointer" onclick="location.href='${productUrl}'">
    <div class="relative aspect-square bg-slate-100 overflow-hidden">
      <img src="${p.imagen}" alt="${p.title}" class="w-full h-full object-cover cursor-zoom-in" onclick="event.stopPropagation(); openLightbox('${p.imagen}', '${p.title.replace(/'/g, "\\'")}')">
      <span class="absolute top-3 left-3 bg-accent text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow">${p.badge}</span>
    </div>
    <div class="p-4 flex flex-col flex-1">
      <h3 class="font-heading font-bold text-sm sm:text-base text-dark mb-2 leading-snug flex-1">${p.title}</h3>
      <div class="flex items-baseline gap-2 mb-1">
        <span class="text-slate-400 line-through text-xs">${formatL(p.originalPrice)}</span>
        <span class="text-primary font-heading font-extrabold text-lg">${formatL(p.price)}</span>
      </div>
      <span class="inline-block w-fit bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase mb-3">Envío Gratis</span>
      <a href="${productUrl}" onclick="event.stopPropagation()"
        class="w-full flex items-center justify-center bg-accent hover:bg-orange-600 text-white font-heading font-bold text-xs sm:text-sm py-3 rounded-xl transition-colors">
        VER PRODUCTO
      </a>
    </div>
  </div>
`;
}

function renderCategoryGrid(category, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const items = products.filter(p => p.category === category);

  if (items.length === 0) {
    container.innerHTML = `
      <div class="col-span-full border-2 border-dashed border-slate-200 rounded-2xl py-10 px-6 text-center">
        <p class="font-heading font-bold text-sm text-slate-400 uppercase tracking-wide">Próximamente nuevos productos</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(renderProductCard).join("");
}

/* =========================================================
   ESTADO Y ELEMENTOS COMPARTIDOS
========================================================= */
let currentProduct = null;
let currentQtyIndex = 0;

let departmentSelect, municipalitySelect;
let lightboxOverlay, lightboxImg;
let form, phoneInput;

/* =========================================================
   INICIALIZACION DE UNA PAGINA DE CATEGORIA
========================================================= */
function initCatalogPage(category, gridId) {
  renderCategoryGrid(category, gridId || "product-grid");

  /* Lightbox (zoom de la foto en la tarjeta) */
  lightboxOverlay = document.getElementById("lightbox-overlay");
  lightboxImg = document.getElementById("lightbox-img");
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightboxOverlay.classList.contains("hidden")) closeLightbox();
  });
}

/* =========================================================
   LIGHTBOX: IMAGEN AMPLIADA
========================================================= */
function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt || "";
  lightboxOverlay.classList.remove("hidden");
  requestAnimationFrame(() => lightboxOverlay.classList.remove("opacity-0"));
}

function closeLightbox() {
  lightboxOverlay.classList.add("opacity-0");
  setTimeout(() => lightboxOverlay.classList.add("hidden"), 200);
}

/* =========================================================
   SELECTOR DE CANTIDAD
========================================================= */
function renderQtySelector() {
  const container = document.getElementById("qty-selector");
  container.innerHTML = QTY_TIERS.map((tier, i) => {
    const unitTotal = currentProduct.price * tier.qty;
    const finalTotal = unitTotal - (tier.discountAmount || 0);
    return `
      <button type="button" onclick="selectQty(${i})" data-idx="${i}"
        class="qty-card ${i === 0 ? 'selected' : ''} border-2 border-slate-200 rounded-xl p-2.5 text-center transition-all">
        <p class="font-heading font-extrabold text-sm text-dark">${tier.qty}</p>
        <p class="text-[10px] text-slate-500 mb-1">${tier.qty === 1 ? 'unidad' : 'unidades'}</p>
        ${tier.discountAmount > 0 ? `<p class="text-[10px] font-bold text-primary">-${formatL(tier.discountAmount)}</p>` : `<p class="text-[10px] text-slate-400">Normal</p>`}
        <p class="text-xs font-bold text-dark mt-1">${formatL(finalTotal)}</p>
      </button>
    `;
  }).join("");
}

function selectQty(index) {
  currentQtyIndex = index;
  document.querySelectorAll(".qty-card").forEach((el, i) => {
    el.classList.toggle("selected", i === index);
  });
  updateOrderSummary();
}

function updateOrderSummary() {
  if (!currentProduct) return;
  const tier = QTY_TIERS[currentQtyIndex];
  const unitTotal = currentProduct.price * tier.qty;
  const discountAmount = tier.discountAmount || 0;
  const finalTotal = unitTotal - discountAmount;

  document.getElementById("summary-qty-label").textContent = `${tier.label} x ${formatL(currentProduct.price)}`;
  document.getElementById("summary-unit-total").textContent = formatL(unitTotal);

  const discountRow = document.getElementById("summary-discount-row");
  if (discountAmount > 0) {
    discountRow.classList.remove("hidden");
    document.getElementById("summary-discount").textContent = "- " + formatL(discountAmount);
  } else {
    discountRow.classList.add("hidden");
  }

  document.getElementById("summary-total").textContent = formatL(finalTotal);
}

/* =========================================================
   FORMULARIO: VALIDACION Y ENVIO
========================================================= */
function isPhoneValid(value) {
  return /^\d{8}$/.test(value.replace(/\D/g, ""));
}

/* Valida los campos del formulario de pedido, marcando errores visualmente.
   Devuelve { valid, nameEl, addressEl, referenceEl } para que el caller
   pueda leer los valores ya validados. */
function validateOrderForm() {
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

  return { valid, nameEl, addressEl, referenceEl };
}

/* Arma el texto del pedido en el formato que llega a WhatsApp Business */
function buildOrderWhatsAppMessage(product, tier, finalTotal, customer) {
  const orderMessage =
    `🛒 *Nuevo Pedido - Pago Contra Entrega*\n\n` +
    `*Producto:* ${product.title}\n` +
    `*Cantidad:* ${tier.qty}\n` +
    `*Total a pagar:* ${formatL(finalTotal)}\n\n` +
    `*Nombre:* ${customer.name}\n` +
    `*Teléfono:* ${customer.phone}\n` +
    `*Departamento:* ${customer.department}\n` +
    `*Municipio:* ${customer.municipality}\n` +
    `*Dirección exacta:* ${customer.address}\n` +
    `*Punto de referencia:* ${customer.reference}`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderMessage)}`;
}
