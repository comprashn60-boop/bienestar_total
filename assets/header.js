/* =========================================================
   HEADER GLOBAL: MENU MOVIL Y BUSCADOR DE PRODUCTOS
========================================================= */
function toggleMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  if (menu) menu.classList.toggle("hidden");
}

function toggleSearch() {
  const panel = document.getElementById("search-panel");
  if (!panel) return;
  const opening = panel.classList.contains("hidden");
  panel.classList.toggle("hidden");

  const input = document.getElementById("search-input");
  if (opening) {
    renderSearchResults("");
    input.focus();
  } else {
    input.value = "";
  }
}

function renderSearchResults(query) {
  const resultsEl = document.getElementById("search-results");
  if (!resultsEl) return;
  const q = query.trim().toLowerCase();

  if (!q) {
    resultsEl.innerHTML = `<p class="text-sm text-slate-400 text-center py-4">Escribe el nombre de un producto...</p>`;
    return;
  }

  const matches = products.filter(p => p.title.toLowerCase().includes(q)).slice(0, 8);

  if (matches.length === 0) {
    resultsEl.innerHTML = `<p class="text-sm text-slate-400 text-center py-4">No se encontraron productos para "${query}".</p>`;
    return;
  }

  resultsEl.innerHTML = matches.map(p => `
    <a href="/producto/${p.id}" class="flex items-center gap-3 py-2.5 px-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors">
      <img src="${p.imagen}" alt="${p.title}" class="w-12 h-12 rounded-lg object-cover shrink-0 bg-slate-100">
      <div class="flex-1 min-w-0">
        <p class="text-sm font-bold text-dark truncate">${p.title}</p>
        <p class="text-xs text-primary font-bold">${formatL(p.price)}</p>
      </div>
    </a>
  `).join("");
}

function initHeader() {
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", () => renderSearchResults(searchInput.value));
  }

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const panel = document.getElementById("search-panel");
    if (panel && !panel.classList.contains("hidden")) toggleSearch();
  });
}
