const DATA_URL = "data/products.json";
const catalogStatus = document.querySelector("#catalog-status");
const produkGrid = document.querySelector("#produk-dinamis");
const produkRingkasan = document.querySelector("#produk-ringkasan");
const produkUnggulan = document.querySelector("#produk-unggulan");
const tombolFilter = document.querySelectorAll("[data-filter]");

let products = [];
let activeCategory = "Semua";

function setStatus(state, message) {
  catalogStatus.className = "catalog-status";
  if (state) {
    catalogStatus.classList.add(state);
  }
  catalogStatus.textContent = message;
}

function formatRupiah(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(price);
}

function createProductCard(product) {
  const article = document.createElement("article");
  article.classList.add("product-card");

  const badge = document.createElement("span");
  badge.classList.add("product-badge");
  badge.textContent = product.featured
    ? "Unggulan"
    : product.stock <= 5
      ? "Stok Terbatas"
      : product.category;

  const title = document.createElement("h3");
  title.textContent = product.name;

  const category = document.createElement("p");
  category.textContent = `Kategori: ${product.category}`;

  const description = document.createElement("p");
  description.textContent = product.description;

  const price = document.createElement("p");
  price.classList.add("price");
  price.textContent = formatRupiah(product.price);

  const stock = document.createElement("p");
  stock.textContent = `Stok tersedia: ${product.stock}`;

  const actions = document.createElement("div");
  actions.classList.add("card-actions");

  const link = document.createElement("a");
  link.classList.add("button");
  link.href = "kontak.html";
  link.textContent = "Tanya produk";

  actions.append(link);

  article.append(badge, title, category, description, price, stock, actions);

  return article;
}

function buatEmptyState(category = activeCategory) {
  const empty = document.createElement("p");
  empty.classList.add("empty-state");
  empty.textContent =
    `Belum ada produk pada kategori ${category}.`;

  return empty;
}

function renderProducts(items) {
  produkGrid.replaceChildren();

  if (items.length === 0) {
    produkGrid.append(buatEmptyState());
    produkRingkasan.textContent = "0 produk ditemukan.";
    return;
  }

  items.forEach((product) => {
    produkGrid.append(createProductCard(product));
  });

  const featured = products.find(
    (product) => product.featured
  );

  produkUnggulan.textContent = featured
    ? `Produk unggulan: ${featured.name} - ${formatRupiah(featured.price)}`
    : "Belum ada produk unggulan.";

  produkRingkasan.textContent =
    `${items.length} produk ditampilkan.`;
}

function applyFilter(category) {
  activeCategory = category;

  const filtered = category === "Semua"
    ? products
    : products.filter(
        (product) => product.category === category
      );

  renderProducts(filtered);
}

async function loadProducts() {
  try {
    setStatus("loading", "Memuat data produk...");

    const response = await fetch(DATA_URL);

    if (!response.ok) {
      throw new Error(`HTTP status ${response.status}`);
    }

    products = await response.json();
    renderProducts(products)
    setStatus(
      "success",
      `${products.length} produk berhasil dimuat.`
    );
  } catch (error) {
    setStatus("error", `Gagal memuat produk: ${error.message}`);
  }
}

tombolFilter.forEach((button) => {
  button.addEventListener("click", () => {
    tombolFilter.forEach((item) => {
      item.classList.remove("is-active");
    });
    button.classList.add("is-active");
    applyFilter(button.dataset.filter || "Semua");
  });
});

loadProducts();
