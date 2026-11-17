/* =========================================================
   PAGINA DEDICADA DE PRODUCTO (/producto/:id)
   Pensada como landing page individual para anuncios (Meta Ads).
========================================================= */
const CATEGORY_LABELS = {
  "FITNESS": "Fitness",
  "SUPLEMENTOS": "Suplementos",
  "BIENESTAR CORPORAL": "Bienestar Corporal"
};

function renderStars(rating) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

function renderGallery(product) {
  const images = (product.imagenes && product.imagenes.length ? product.imagenes : [product.imagen]);
  const mainImg = document.getElementById("main-image");
  mainImg.src = images[0];
  mainImg.alt = product.title;

  const thumbRow = document.getElementById("thumbnail-row");
  if (images.length <= 1) {
    thumbRow.innerHTML = "";
    return;
  }

  thumbRow.innerHTML = images.map((src, i) => `
    <button type="button" onclick="document.getElementById('main-image').src='${src}'; document.querySelectorAll('.thumb-img').forEach(el => el.classList.remove('active')); this.querySelector('img').classList.add('active');"
      class="rounded-lg overflow-hidden border-2 ${i === 0 ? 'border-primary' : 'border-transparent'}">
      <img src="${src}" alt="${product.title} ${i + 1}" class="thumb-img w-full aspect-square object-cover ${i === 0 ? 'active' : ''}">
    </button>
  `).join("");
}

/* Muestra todas las fotos del producto, grandes y una debajo de otra,
   como una mini landing page al estilo Shopify. Si solo hay una foto,
   la sección igual se muestra con esa única imagen. */
function renderGallerySequence(product) {
  const images = (product.imagenes && product.imagenes.length ? product.imagenes : [product.imagen]);
  document.getElementById("gallery-sequence").innerHTML = images.map((src, i) => `
    <img src="${src}" alt="${product.title} ${i + 1}" class="gallery-sequence-img cursor-zoom-in" onclick="openLightbox('${src}', '${product.title.replace(/'/g, "\\'")}')">
  `).join("");
}

function renderReviews(product) {
  const reviews = getProductReviews(product);
  document.getElementById("reviews-grid").innerHTML = reviews.map(r => `
    <div class="bg-slate-50 border border-slate-200 rounded-xl p-4">
      <div class="star-rating text-sm mb-1">${renderStars(r.rating)}</div>
      <p class="text-sm text-slate-700 mb-2">"${r.text}"</p>
      <p class="text-xs font-bold text-dark">${r.name}</p>
    </div>
  `).join("");
}

/* Lee el ID del producto de forma robusta: Netlify reescribe /producto/:id
   hacia este archivo SIN cambiar la URL visible en el navegador, así que
   location.search nunca trae "?id=". Por eso se busca primero en el path
   (/producto/5) y se usa el query string (?id=5) solo como respaldo para
   cuando la página se abre directamente como producto.html?id=5. */
function getRequestedProductId() {
  const pathMatch = location.pathname.match(/\/producto\/(\d+)/);
  if (pathMatch) return parseInt(pathMatch[1], 10);
  return parseInt(new URLSearchParams(location.search).get("id"), 10);
}

function initProductPage() {
  const productId = getRequestedProductId();
  const product = products.find(p => p.id === productId);

  if (!product) {
    document.getElementById("not-found").classList.remove("hidden");
    return;
  }

  currentProduct = product;
  currentQtyIndex = 0;

  document.getElementById("product-main").classList.remove("hidden");

  /* Metadatos de la página */
  document.title = `${product.title} — Bienestar Total`;
  document.getElementById("page-description").setAttribute("content", product.description || product.title);

  /* Info del producto */
  document.getElementById("product-category-label").textContent = CATEGORY_LABELS[product.category] || "";
  document.getElementById("product-title").textContent = product.title;
  document.getElementById("product-description").textContent = product.description || "";
  document.getElementById("product-badge").textContent = product.badge;
  document.getElementById("product-original-price").textContent = formatL(product.originalPrice);
  document.getElementById("product-price").textContent = formatL(product.price);
  document.getElementById("order-product-label").textContent = product.title;

  document.getElementById("product-benefits").innerHTML = product.benefits.map(b => `
    <li class="flex items-start gap-2 text-sm text-slate-600">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
      <span>${b}</span>
    </li>
  `).join("");

  renderGallery(product);
  renderGallerySequence(product);
  renderReviews(product);

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

  renderQtySelector();
  updateOrderSummary();

  form.addEventListener("submit", handleProductPageOrderSubmit);
}

function handleProductPageOrderSubmit(e) {
  e.preventDefault();

  const { valid, nameEl, addressEl, referenceEl } = validateOrderForm();
  if (!valid) return;

  const tier = QTY_TIERS[currentQtyIndex];
  const unitTotal = currentProduct.price * tier.qty;
  const finalTotal = unitTotal - (tier.discountAmount || 0);

  const customer = {
    name: nameEl.value.trim(),
    phone: phoneInput.value.trim(),
    department: departmentSelect.value,
    municipality: municipalitySelect.value,
    address: addressEl.value.trim(),
    reference: referenceEl.value.trim()
  };

  document.getElementById("success-product").textContent = `${currentProduct.title} (x${tier.qty})`;
  document.getElementById("success-name").textContent = customer.name;
  document.getElementById("success-phone").textContent = customer.phone;
  document.getElementById("success-location").textContent = `${customer.municipality}, ${customer.department}`;
  document.getElementById("success-total").textContent = formatL(finalTotal);

  const whatsappUrl = buildOrderWhatsAppMessage(currentProduct, tier, finalTotal, customer);
  document.getElementById("whatsapp-redirect-link").href = whatsappUrl;

  const overlayEl = document.getElementById("modal-overlay");
  const panelEl = document.getElementById("modal-panel");
  overlayEl.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => {
    overlayEl.classList.remove("opacity-0");
    panelEl.classList.remove("opacity-0", "translate-y-6", "sm:scale-95");
  });

  window.open(whatsappUrl, "_blank");
}

function closeSuccessOverlay() {
  const overlayEl = document.getElementById("modal-overlay");
  const panelEl = document.getElementById("modal-panel");
  overlayEl.classList.add("opacity-0");
  panelEl.classList.add("opacity-0", "translate-y-6", "sm:scale-95");
  document.body.style.overflow = "";
  setTimeout(() => overlayEl.classList.add("hidden"), 250);
}
