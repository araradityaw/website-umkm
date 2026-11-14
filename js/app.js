"use strict";

const nav = document.querySelector(".nav");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("#nav-menu");

if (nav && navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("is-open");

        navToggle.setAttribute("aria-expanded", isOpen);
        navToggle.setAttribute(
            "aria-label",
            isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"
        );
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            nav.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
            navToggle.setAttribute("aria-label", "Buka menu navigasi");
        }
    });
}

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

function buatKartuProduk(produk, tipe) {
    const status = statusStok(produk.stok);

    const card = document.createElement("article");
    card.classList.add("js-product-card");

    const kategori = labelKategori(produk.kategori);

    const stock = document.createElement("span");
    stock.classList.add("stock-badge");
    if (status.className) {
        stock.classList.add(status.className);
    }
    stock.textContent = status.label;

    const title = document.createElement("h3");
    title.textContent = produk.nama;

    const category = document.createElement("p");
    category.textContent = kategori;

    const price = document.createElement("p");
    price.classList.add("price");
    price.textContent = formatRupiah(produk.harga);

    const action = document.createElement("p");
    action.textContent = produk.stok > 0
        ? "Siap dipesan"
        : "Hubungi admin";

    if (tipe === "galeri") {
        const productInfo = document.createElement("div");
        productInfo.classList.add("product-info");

        const galleryImage = document.createElement("div");
        galleryImage.classList.add("gallery-image");
      
        const image = document.createElement("img");
        image.src = produk.gambar;
        image.alt = produk.nama;
        image.width = 640;
        image.height = 360;
        image.loading = "lazy";

        const imageBadges = document.createElement("div");
        imageBadges.classList.add("image-badges");

        if (produk.unggulan) {
            const featuredBadge = document.createElement("span");
            featuredBadge.classList.add("featured-badge");
            featuredBadge.textContent = "Produk unggulan";
            imageBadges.append(featuredBadge);
        }
        imageBadges.append(stock);
        galleryImage.append(image, imageBadges);

        productInfo.append(title, category, price, action);
        card.append(galleryImage, productInfo);
    }

    if (tipe === "produk") {
        const ringkasan = document.querySelector("#produk-ringkasan");
        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.textContent = "Sembunyikan";
        removeButton.addEventListener("click", () => {
          card.remove();
          ringkasan.textContent = `Produk "${produk.nama}" telah disembunyikan.`
        });
        card.append(removeButton, title, category, price, stock);
    }

    return card;
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

const tombolFilterGaleri = document.querySelectorAll("[data-filter-galeri]");
tombolFilterGaleri.forEach((tombol) => {
    tombol.addEventListener("click", (event) => {
        const tombolAktif = event.currentTarget;
        const kategori = tombolAktif.dataset.filterGaleri;

        tombolFilterGaleri.forEach((item) => {item.classList.remove("is-active")});
        tombolAktif.classList.add("is-active");

        renderGaleriProduk(kategori);
    });
});

produkUmkm.forEach((produk) => {
    console.log("Debug produk:", produk.nama, "stok:", produk.stok);
});

function renderProduk(kategoriAktif = "Semua") {
    const grid = document.querySelector("#produk-dinamis");
    const ringkasan = document.querySelector("#produk-ringkasan");
    const unggulan = document.querySelector("#produk-unggulan");

    if (!grid || !ringkasan || !unggulan) {
        console.warn("Target render produk belum lengkap.");
        return;
    }

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
        grid.append(buatKartuProduk(produk, "produk"));
    });

    const produkUnggulan = produkTampil.find(
        (produk) => produk.unggulan === true
    );

    ringkasan.textContent = `${produkTampil.length} produk ditampilkan.`;
    unggulan.textContent = produkUnggulan
        ? `Produk unggulan: ${produkUnggulan.nama}`
        : "Belum ada produk unggulan.";
}

galeriProduk.forEach((produk) => {
    console.log("Debug galeri produk:", produk.nama, "stok:", produk.stok);
});

function renderGaleriProduk(kategoriAktif = "Semua") {
    const grid = document.querySelector("#galeri-produk");
    const ringkasan = document.querySelector("#galeri-ringkasan");

    if (!grid || !ringkasan) {
        console.warn("Target render galeri produk belum lengkap.");
        return;
    }

    const produkTampil = kategoriAktif === "Semua"
        ? galeriProduk
        : galeriProduk.filter((produk) => produk.kategori === kategoriAktif);
    grid.replaceChildren();

    if (produkTampil.length === 0) {
        grid.append(buatEmptyState(kategoriAktif));
        ringkasan.textContent = "0 produk ditemukan.";
        return;
    }

    produkTampil.forEach((produk) => {
        grid.append(buatKartuProduk(produk, "galeri"));
    });

    ringkasan.textContent = `${produkTampil.length} produk ditampilkan. `;
}

document.addEventListener("DOMContentLoaded", () => {
    renderProduk();
    renderGaleriProduk();
});
