/* =========================================================
   RENDER: TARJETA Y GRID DE PRODUCTOS POR CATEGORIA
========================================================= */
function renderProductCard(p) {
  return `
  <div class="card-hover bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col cursor-pointer" onclick="openModal(${p.id})">
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
      <button class="w-full bg-accent hover:bg-orange-600 text-white font-heading font-bold text-xs sm:text-sm py-3 rounded-xl transition-colors">
        COMPRAR CONTRA ENTREGA
      </button>
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
let overlay, panel, viewPurchase, viewSuccess;
let lightboxOverlay, lightboxImg;
let form, phoneInput;

/* =========================================================
   INICIALIZACION DE UNA PAGINA DE CATEGORIA
========================================================= */
function initCatalogPage(category, gridId) {
  renderCategoryGrid(category, gridId || "product-grid");

  /* Select de departamentos */
  departmentSelect = document.getElementById("field-department");
  municipalitySelect = document.getElementById("field-municipality");

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

  /* Modal de compra */
  overlay = document.getElementById("modal-overlay");
  panel = document.getElementById("modal-panel");
  viewPurchase = document.getElementById("view-purchase");
  viewSuccess = document.getElementById("view-success");

  document.getElementById("modal-close-btn").addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
  document.getElementById("success-close-btn").addEventListener("click", closeModal);

  /* Lightbox */
  lightboxOverlay = document.getElementById("lightbox-overlay");
  lightboxImg = document.getElementById("lightbox-img");
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightboxOverlay.classList.contains("hidden")) closeLightbox();
  });

  /* Formulario de pedido */
  form = document.getElementById("order-form");
  phoneInput = document.getElementById("field-phone");

  phoneInput.addEventListener("input", () => {
    let digits = phoneInput.value.replace(/\D/g, "").slice(0, 8);
    if (digits.length > 4) {
      phoneInput.value = digits.slice(0, 4) + "-" + digits.slice(4);
    } else {
      phoneInput.value = digits;
    }
  });

  form.addEventListener("submit", handleOrderSubmit);
}

/* =========================================================
   MODAL: ABRIR / CERRAR
========================================================= */
function openModal(productId) {
  currentProduct = products.find(p => p.id === productId);
  if (!currentProduct) return;
  currentQtyIndex = 0;

  document.getElementById("modal-title").textContent = currentProduct.title;
  document.getElementById("modal-description").textContent = currentProduct.description || "";
  document.getElementById("modal-badge").textContent = currentProduct.badge;
  document.getElementById("modal-main-img").src = currentProduct.imagen;
  document.getElementById("modal-main-img").alt = currentProduct.title;
  document.getElementById("modal-original-price").textContent = formatL(currentProduct.originalPrice);
  document.getElementById("modal-unit-price").textContent = formatL(currentProduct.price);

  document.getElementById("modal-benefits").innerHTML = currentProduct.benefits.map(b => `
    <li class="flex items-start gap-2 text-sm text-slate-600">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
      <span>${b}</span>
    </li>
  `).join("");

  renderQtySelector();
  updateOrderSummary();
  resetForm();

  viewPurchase.classList.remove("hidden");
  viewSuccess.classList.add("hidden");

  overlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => {
    overlay.classList.remove("opacity-0");
    panel.classList.remove("opacity-0", "translate-y-6", "sm:scale-95");
  });
}

function closeModal() {
  overlay.classList.add("opacity-0");
  panel.classList.add("opacity-0", "translate-y-6", "sm:scale-95");
  document.body.style.overflow = "";
  setTimeout(() => overlay.classList.add("hidden"), 250);
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
    const finalTotal = unitTotal * (1 - tier.discount);
    return `
      <button type="button" onclick="selectQty(${i})" data-idx="${i}"
        class="qty-card ${i === 0 ? 'selected' : ''} border-2 border-slate-200 rounded-xl p-2.5 text-center transition-all">
        <p class="font-heading font-extrabold text-sm text-dark">${tier.qty}</p>
        <p class="text-[10px] text-slate-500 mb-1">${tier.qty === 1 ? 'unidad' : 'unidades'}</p>
        ${tier.discount > 0 ? `<p class="text-[10px] font-bold text-primary">-${tier.discount * 100}%</p>` : `<p class="text-[10px] text-slate-400">Normal</p>`}
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
  const discountAmount = unitTotal * tier.discount;
  const finalTotal = unitTotal - discountAmount;

  document.getElementById("summary-qty-label").textContent = `${tier.label} x ${formatL(currentProduct.price)}`;
  document.getElementById("summary-unit-total").textContent = formatL(unitTotal);

  const discountRow = document.getElementById("summary-discount-row");
  if (tier.discount > 0) {
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
function resetForm() {
  form.reset();
  municipalitySelect.innerHTML = '<option value="" disabled selected>Elige depto. primero</option>';
  municipalitySelect.disabled = true;
  form.querySelectorAll("input, select, textarea").forEach(el => el.classList.remove("touched"));
  form.querySelectorAll(".error-msg").forEach(el => el.classList.add("hidden"));
}

function isPhoneValid(value) {
  return /^\d{8}$/.test(value.replace(/\D/g, ""));
}

function handleOrderSubmit(e) {
  e.preventDefault();

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

  const tier = QTY_TIERS[currentQtyIndex];
  const unitTotal = currentProduct.price * tier.qty;
  const finalTotal = unitTotal * (1 - tier.discount);

  const customerName = nameEl.value.trim();
  const customerPhone = phoneInput.value.trim();
  const customerLocation = `${municipalitySelect.value}, ${departmentSelect.value}`;
  const customerAddress = addressEl.value.trim();
  const customerReference = referenceEl.value.trim();

  document.getElementById("success-product").textContent = `${currentProduct.title} (x${tier.qty})`;
  document.getElementById("success-name").textContent = customerName;
  document.getElementById("success-phone").textContent = customerPhone;
  document.getElementById("success-location").textContent = customerLocation;
  document.getElementById("success-total").textContent = formatL(finalTotal);

  viewPurchase.classList.add("hidden");
  viewSuccess.classList.remove("hidden");
  document.getElementById("modal-panel").scrollTop = 0;

  /* Redacta el pedido y redirige automáticamente a WhatsApp Business */
  const orderMessage =
    `🛒 *Nuevo Pedido - Pago Contra Entrega*\n\n` +
    `*Producto:* ${currentProduct.title}\n` +
    `*Cantidad:* ${tier.qty}\n` +
    `*Total a pagar:* ${formatL(finalTotal)}\n\n` +
    `*Nombre:* ${customerName}\n` +
    `*Teléfono:* ${customerPhone}\n` +
    `*Departamento:* ${departmentSelect.value}\n` +
    `*Municipio:* ${municipalitySelect.value}\n` +
    `*Dirección exacta:* ${customerAddress}\n` +
    `*Punto de referencia:* ${customerReference}`;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderMessage)}`;
  document.getElementById("whatsapp-redirect-link").href = whatsappUrl;
  window.open(whatsappUrl, "_blank");
}
