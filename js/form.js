"use strict";

const form = document.querySelector("#form-kontak");
const preview = document.querySelector("#preview-form");
const formFeedback = document.querySelector("#form-feedback");
const fields = ["nama", "email", "whatsapp", "paket", "pesan"].map((id) => document.querySelector(`#${id}`));
const waktuKontakField = document.querySelectorAll('input[name="waktu-kontak"]');
const topikInputs = document.querySelectorAll('input[name="topik"]');

function getFieldError(field) {
  const validity = field.validity;

  if (validity.valueMissing) return "Bagian ini wajib diisi.";
  if (validity.typeMismatch) return "Format data belum sesuai.";
  if (validity.tooShort) return `Isi minimal ${field.minLength} karakter.`;
  if (validity.patternMismatch) return "Format belum sesuai contoh yang diminta.";

  return "";
}

function tampilkanError(field, pesan) {
  const error = document.querySelector(`#${field.id}-error`);
  field.setCustomValidity(pesan);
  field.setAttribute("aria-invalid", pesan ? "true" : "false");

  if (error) {
    error.textContent = pesan;
  }
}

function validasiField(field) {
  field.setCustomValidity("");
  const pesan = getFieldError(field);
  tampilkanError(field, pesan);
  return pesan === "";
}

function validasiRadio(inputs, errorId, pesanError) {
  const terpilih = Array.from(inputs).some(
    (input) => input.checked
  );
  const error = document.querySelector(`#${errorId}`);

  if (error) {
    error.textContent = terpilih ? "" : pesanError;
  }
  return terpilih;
}

fields.forEach((field) => {
  field.addEventListener("input", () => {
    validasiField(field);
  });

  field.addEventListener("change", () => {
    validasiField(field);
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const semuaValid = fields
    .map((field) => validasiField(field))
    .every(Boolean);

  const waktuKontakValid = validasiRadio(
    waktuKontakField,
    "waktu-kontak-error",
    "Pilih salah satu waktu yang diinginkan."
  );

  const topikValid = validasiRadio(
    topikInputs,
    "topik-error",
    "Pilih salah satu topik pertanyaan."
  );

  if (!semuaValid || !waktuKontakValid || !topikValid || !form.checkValidity()) {
    formFeedback.textContent = "Periksa kembali bagian yang ditandai.";
    formFeedback.classList.remove("success");
    form.reportValidity();
    form.querySelector(":invalid")?.focus();
    
    return;
  }

  tampilkanPreview();
  simpanPreferensi();
});

function tampilkanPreview() {
  const data = new FormData(form);

  preview.textContent = [
    `Nama: ${data.get("nama")}`,
    `Email: ${data.get("email")}`,
    `WhatsApp: ${data.get("whatsapp")}`,
    `Paket: ${data.get("paket")}`,
    `Waktu kontak: ${data.get("waktu-kontak")}`,
    `Topik: ${data.get("topik")}`,
    `Pesan: ${data.get("pesan")}`,
  ].join("\n");

  formFeedback.textContent = "Form valid. Preview berhasil dibuat.";
  formFeedback.classList.add("success");
}

const STORAGE_KEY = "kopi-nusa-preferensi";

function simpanPreferensi() {
  const data = new FormData(form);
  const preferensi = {
    paket: data.get("paket"),
    waktuKontak: data.get("waktu-kontak"),
    topik: data.get("topik"),
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferensi));
}

function muatPreferensi() {
  try {
    const tersimpan = localStorage.getItem(STORAGE_KEY);
    if (!tersimpan) return;

    const preferensi = JSON.parse(tersimpan);
    document.querySelector("#paket").value = preferensi.paket ?? "";

    const waktuKontak = document.querySelector(`input[name="waktu-kontak"][value="${preferensi.waktuKontak}"]`);
    if (waktuKontak) waktuKontak.checked = true;

    const topik = document.querySelector(`input[name="topik"][value="${preferensi.topik}"]`);
    if (topik) topik.checked = true;
    
  } catch (error) {
    console.warn("Preferensi tidak valid.", error);
    localStorage.removeItem(STORAGE_KEY);
  }
}

muatPreferensi();