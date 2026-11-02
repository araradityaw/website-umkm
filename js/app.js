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

const statusStok = (stok) => {
    if (stok === 0) {
        return { label: "Habis", className: "empty" };
    } 
    if (stok <= 5) {
        return { label: "Stok terbatas", className: "warning" };
    }
    return { label: "Tersedia", className: "" };
};

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

function buatKartuProduk(produk) {
  const status = statusStok(produk.stok);

  return `
    <article class="js-product-card">
      <h3>${produk.nama}</h3>
      <p class="category-note">${produk.kategori}</p>
      <p class="price">${formatRupiah(produk.harga)}</p>
      <span class="stock-badge ${status.className}">${status.label}</span>
    </article>
  `;
}

produkUmkm.forEach((produk) => {
    console.log("Debug produk:", produk.nama, "stok:", produk.stok);
});
console.table(produkUmkm);

function renderProduk() {
    const grid = document.querySelector("#produk-dinamis");
    const ringkasan = document.querySelector("#produk-ringkasan");
    const unggulan = document.querySelector("#produk-unggulan");

    if (!grid || !ringkasan || !unggulan) {
        console.warn("Target render produk belum lengkap.");
        return;
    }

    const produkTersedia = produkUmkm.filter((produk) => produk.stok > 0);
    const produkUnggulan = produkUmkm.find((produk) => produk.unggulan === true);
    const markupProduk = produkTersedia.map(buatKartuProduk).join("");

    grid.innerHTML = markupProduk;
    ringkasan.textContent = `${produkTersedia.length} produk tersedia dari ${produkUmkm.length} data.`;
    unggulan.textContent = produkUnggulan
        ? `Produk unggulan: ${produkUnggulan.nama}`
        : "Belum ada produk unggulan.";
}


function renderGaleriProduk() {
    const grid = document.querySelector("#galeri-produk");
    const ringkasan = document.querySelector("#galeri-ringkasan");

    if (!grid || !ringkasan) {
        return;
    }

    let jumlahTersedia = 0;
    let jumlahUnggulan = 0;
    let markup = "";

    for (const produk of galeriProduk) {
        const status = statusStok(produk.stok);
        const kategori = labelKategori(produk.kategori);

        const badgeUnggulan = produk.unggulan
            ? `<span class="featured-badge">Produk unggulan</span>`
            : "";

        const labelAksi = produk.stok > 0
            ? "Siap dipesan"
            : "Hubungi admin";

        if (produk.stok > 0) {
            jumlahTersedia++;
        }

        if (produk.unggulan === true) {
            jumlahUnggulan++;
        }

        markup += `
        <article class="js-product-card">
            <div class="gallery-image">
                <img
                    src="${produk.gambar}"
                    alt="${produk.nama}"
                    width="640"
                    height="360"
                    loading="lazy"
                >
                <div class="image-badges">
                    ${badgeUnggulan}
                    <span class="stock-badge ${status.className}">
                        ${status.label}
                    </span>
                </div>
            </div>

            <div class="product-info">
                <h3>${produk.nama}</h3>
                <p>${kategori}</p>

                <p class="price">
                    ${formatRupiah(produk.harga)}
                </p>

                <p>${labelAksi}</p>
            </div>
        </article>
        `;
    }

    grid.innerHTML = markup;

    ringkasan.textContent =
        `${jumlahTersedia} produk tersedia dari ${galeriProduk.length} data. ` +
        `${jumlahUnggulan} produk merupakan produk unggulan.`;
}

document.addEventListener("DOMContentLoaded", () => {
    renderProduk();
    renderGaleriProduk();
});

console.table(galeriProduk);