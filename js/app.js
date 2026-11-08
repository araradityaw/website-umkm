"use strict";

const produkUmkm = [
  { nama: "Arabika Gayo", kategori: "Kopi", harga: 85000, stok: 12, unggulan: true },
  { nama: "Robusta Temanggung", kategori: "Kopi", harga: 65000, stok: 4, unggulan: false },
  { nama: "Paket Seduh", kategori: "Bundling", harga: 125000, stok: 0, unggulan: false },
  { nama: "Drip Bag Nusantara", kategori: "Kopi", harga: 45000, stok: 18, unggulan: false },
];

const galeriProduk = [
  {
    nama: "Kopi Tubruk Signature",
    kategori: "Kopi",
    harga: 45000,
    stok: 3,
    unggulan: true,
    gambar: "assets/images/coco-kopi.jpeg"
  },
  {
    nama: "Cold Brew Aren",
    kategori: "Kopi",
    harga: 22000,
    stok: 5,
    unggulan: true,
    gambar: "assets/images/coco-kopi.jpeg"
  },
  {
    nama: "Coconut Coffee",
    kategori: "Kopi",
    harga: 26000,
    stok: 10,
    unggulan: false,
    gambar: "assets/images/coco-kopi.jpeg"
  },
  {
    nama: "Paket Seduh",
    kategori: "Bundling",
    harga: 125000,
    stok: 0,
    unggulan: true,
    gambar: "assets/images/coco-kopi.jpeg"
  },
];

function formatRupiah(nilai) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nilai);
}
console.log(formatRupiah(85000)); 

const statusStok = (stok) => {
    if (stok === 0) {
        return { label: "Habis", className: "empty" };
    } 
    if (stok <= 5) {
        return { label: "Stok terbatas", className: "warning" };
    }
    return { label: "Tersedia", className: "" };
};
console.log(statusStok(3));

const labelKategori = (kategori) => {
    switch (kategori) {
        case "Kopi":
            return "Produk kopi pilihan";
        case "Bundling":
            return "Paket hemat";
        default:
            return "Produk UMKM";
    }
};
console.log(labelKategori("Kopi"));

function buatKartuProduk(produk) {
  const card = document.createElement("article");
  card.classList.add("product-card");

  const title = document.createElement("h3");
  title.textContent = produk.nama;

  const category = document.createElement("p");
  category.classList.add("category-note");
  category.textContent = produk.kategori;

  const price = document.createElement("p");
  price.classList.add("price");
  price.textContent = formatRupiah(produk.harga);

  const stock = document.createElement("span");
  const status = statusStok(produk.stok);
  stock.classList.add("stock-badge");
  if (status.className) {
    stock.classList.add(status.className);
  }
  stock.textContent = status.label;

  const ringkasan = document.querySelector("#produk-ringkasan");
  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.textContent = "Sembunyikan";
  removeButton.classList.add("ghost-button");
  removeButton.addEventListener("click", () => {
    card.remove();
    ringkasan.textContent = "Terdapat produk yang disembunyikan."
  });
   
  card.append(removeButton, title, category, price, stock);
  return card;
}

produkUmkm.forEach((produk) => {
    console.log("Debug produk:", produk.nama, "stok:", produk.stok);
});
console.table(produkUmkm);

function renderProduk(kategoriAktif = "Semua") {
    const grid = document.querySelector("#produk-dinamis");
    const ringkasan = document.querySelector("#produk-ringkasan");
    const unggulan = document.querySelector("#produk-unggulan");

    if (!grid || !ringkasan || !unggulan) {
        console.warn("Target render produk belum lengkap.");
        return;
    }

    console.log("Render kategori:", kategoriAktif);

    const produkTampil = kategoriAktif === "Semua"
        ? produkUmkm
        : produkUmkm.filter((produk) => produk.kategori === kategoriAktif);

    grid.replaceChildren();

    if (produkTampil.length === 0) {
        grid.append(buatEmptyState(kategoriAktif));
        ringkasan.textContent = "0 produk ditemukan.";
        unggulan.textContent = "Tidak ada produk unggulan.";
        return;
    }

    produkTampil.forEach((produk) => {
        grid.append(buatKartuProduk(produk));
    });

    const produkUnggulan = produkTampil.find(
        (produk) => produk.unggulan === true
    );

    ringkasan.textContent = `${produkTampil.length} produk ditampilkan.`;
    unggulan.textContent = produkUnggulan
        ? `Produk unggulan: ${produkUnggulan.nama}`
        : "Belum ada produk unggulan.";
}

function buatEmptyState(kategori) {
  const empty = document.createElement("p");
  empty.classList.add("empty-state");
  empty.textContent = `Belum ada produk pada kategori ${kategori}.`;
  return empty;
}

const tombolFilter = document.querySelectorAll("[data-filter]");
tombolFilter.forEach((tombol) => {
  tombol.addEventListener("click", (event) => {
    const tombolAktif = event.currentTarget;
    const kategori = tombolAktif.dataset.filter;

    tombolFilter.forEach((item) => item.classList.remove("is-active"));
    tombolAktif.classList.add("is-active");

    renderProduk(kategori);
  });
});

galeriProduk.forEach((produk) => {
    console.log("Debug galeri produk:", produk.nama, "stok:", produk.stok);
});
console.table(galeriProduk);

function renderGaleriProduk() {
    const grid = document.querySelector("#galeri-produk");
    const ringkasan = document.querySelector("#galeri-ringkasan");

    if (!grid || !ringkasan) {
        console.warn("Target render galeri produk belum lengkap.");
        return;
    }

    const produkTersedia = galeriProduk.filter((produk) => produk.stok > 0);
    const produkUnggulan = galeriProduk.filter((produk) => produk.unggulan === true);
    const markup = galeriProduk.map((produk) => buatKartuProduk(produk, "galeri")).join("");

    grid.innerHTML = markup;
    ringkasan.textContent =
        `${produkTersedia.length} produk tersedia dari ${galeriProduk.length} data. ` +
        `${produkUnggulan.length} produk merupakan produk unggulan.`;
}

document.addEventListener("DOMContentLoaded", () => {
    renderProduk();
    renderGaleriProduk();
});
