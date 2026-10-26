"use strict";

const produkUmkm = [
  { nama: "Arabika Gayo", kategori: "Kopi", harga: 85000, stok: 12 },
  { nama: "Robusta Temanggung", kategori: "Kopi", harga: 65000, stok: 1 },
  { nama: "Paket Seduh", kategori: "Bundling", harga: 125000, stok: 0 },
];

const formatRupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});


function renderProduk() {
    const grid = document.querySelector("#produk-dinamis");
    const ringkasan = document.querySelector("#produk-ringkasan");

    if (!grid || !ringkasan) {
        return;
    }

    function statusStok(stok) {
        if (stok === 0) {
            return { label: "Habis", className: "empty" };
        }
        if (stok <= 5) {
            return { label: "Stok terbatas", className: "warning" };
        }
        return { label: "Tersedia", className: "" };
    }

    function labelKategori(kategori) {
        switch (kategori) {
            case "Kopi":
                return "Produk kopi pilihan";
            case "Bundling":
                return "Paket hemat";
            default:
                return "Produk UMKM";
        }
    }

    let jumlahTersedia = 0;
    let markup = "";

    for (const produk of produkUmkm) {
        const status = statusStok(produk.stok);
        const kategori = labelKategori(produk.kategori);
        const labelAksi = produk.stok > 0 ? "Siap dipesan" : "Hubungi admin";
        if (produk.stok > 0) {
            jumlahTersedia = jumlahTersedia + 1;
        }
        markup = markup + `
        <article class="js-product-card">
            <h3>${produk.nama}</h3>
            <p>${kategori}</p>
            <p class="price">${formatRupiah.format(produk.harga)}</p>
            <span class="stock-badge ${status.className}">${status.label}</span>
            <p>${labelAksi}</p>
        </article>
        `;
    }

    grid.innerHTML = markup;
    ringkasan.textContent = `${jumlahTersedia} produk tersedia dari ${produkUmkm.length} data.`;
}

document.addEventListener("DOMContentLoaded", renderProduk);

