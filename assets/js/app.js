// ==========================================
// FUNGSI GENERIK FETCH TABEL (Jobsheet 6)
// ==========================================
async function muatDataTabel(urlJson, daftarKunci) {
    const tbody = document.querySelector(".table-responsive table tbody");
    const loading = document.getElementById("loading-indicator");
    if (!tbody) return;

    if (loading) loading.style.display = "block";
    tbody.innerHTML = "";

    try {
        // Delay simulasi 3 detik
        await new Promise((resolve) => setTimeout(resolve, 3000)); 

        const res = await fetch(urlJson);
        if (!res.ok) {
            throw new Error("Gagal mengambil data (status " + res.status + ")");
        }
        const listData = await res.json();

        listData.forEach(function (item) {
            const tr = document.createElement("tr");

            let htmlSel = "";
            daftarKunci.forEach(function (kunci) {
                htmlSel += "<td>" + (item[kunci] !== undefined ? item[kunci] : "-") + "</td>";
            });

            htmlSel += '<td><button type="button">Edit</button> <button type="button" class="btn-hapus">Hapus</button></td>';

            tr.innerHTML = htmlSel;
            tbody.appendChild(tr);
        });
    } catch (err) {
        const totalKolom = daftarKunci.length + 1;
        tbody.innerHTML = '<tr><td colspan="' + totalKolom + '">Gagal memuat data: ' + err.message + '</td></tr>';
    } finally {
        if (loading) loading.style.display = "none";
    }
}

// ==========================================
// FUNGSI INTERAKTIVITAS UTAMA (Jobsheet 5)
// ==========================================
function initNavToggle() {
    const toggleBtn = document.getElementById("nav-toggle-btn");
    const nav = document.querySelector("header nav");
    if (!toggleBtn || !nav) return;

    toggleBtn.addEventListener("click", function () {
        nav.classList.toggle("nav-open");
    });
}

function initHapusConfirm() {
    document.addEventListener("click", function (e) {
        const btn = e.target.closest(".btn-hapus");
        if (!btn) return;

        const row = btn.closest("tr");
        const nama = row ? row.querySelector("td")?.textContent : "data ini";
        const yakin = confirm("Yakin ingin menghapus \"" + nama + "\"?");
        if (yakin && row) {
            row.remove();
        }
    });
}

function initTableFilter() {
    const input = document.getElementById("search-input");
    const table = document.querySelector(".table-responsive table");
    if (!input || !table) return;

    input.addEventListener("keyup", function () {
        const keyword = input.value.toLowerCase();
        const rows = table.querySelectorAll("tbody tr");
        rows.forEach(function (row) {
            const firstTd = row.querySelector("td");
            if (firstTd) {
                const teksKolomUtama = firstTd.textContent.toLowerCase();
                row.style.display = teksKolomUtama.includes(keyword) ? "" : "none";
            }
        });
    });
}

function tampilkanError(input, pesan) {
    hapusError(input);
    const span = document.createElement("span");
    span.className = "error";
    span.textContent = pesan;
    input.insertAdjacentElement("afterend", span);
}

function hapusError(input) {
    const next = input.nextElementSibling;
    if (next && next.classList.contains("error")) {
        next.remove();
    }
}

function initValidasiForm() {
    const form = document.getElementById("form-tambah");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        let valid = true;

        const judul = form.querySelector("[name='judul'], [name='nama']");
        if (judul && judul.value.trim() === "") {
            tampilkanError(judul, "Field ini wajib diisi.");
            valid = false;
        } else if (judul) {
            hapusError(judul);
        }

        const pengarang = form.querySelector("[name='pengarang']");
        if (pengarang && pengarang.value.trim() === "") {
            tampilkanError(pengarang, "Pengarang wajib diisi.");
            valid = false;
        } else if (pengarang) {
            hapusError(pengarang);
        }

        const tahun = form.querySelector("[name='tahun']");
        if (tahun) {
            const nilai = parseInt(tahun.value, 10);
            if (isNaN(nilai) || nilai < 1900 || nilai > 2026) {
                tampilkanError(tahun, "Tahun harus di antara 1900-2026.");
                valid = false;
            } else {
                hapusError(tahun);
            }
        }

        const isbn = form.querySelector("#isbn, [name='isbn']");
        if (isbn) {
            const nilaiIsbn = isbn.value.trim();
            if (nilaiIsbn !== "") {
                const regexIsbn = /^[0-9-]+$/;
                if (!regexIsbn.test(nilaiIsbn)) {
                    tampilkanError(isbn, "ISBN hanya boleh berisi angka dan tanda hubung (-).");
                    valid = false;
                } else {
                    hapusError(isbn);
                }
            } else {
                hapusError(isbn);
            }
        }

        const stok = form.querySelector("[name='stok']");
        if (stok) {
            const nilai = parseInt(stok.value, 10);
            if (isNaN(nilai) || nilai < 0) {
                tampilkanError(stok, "Stok tidak boleh negatif.");
                valid = false;
            } else {
                hapusError(stok);
            }
        }

        if (!valid) {
            e.preventDefault();
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    initNavToggle();
    initHapusConfirm();
    initTableFilter();
    initValidasiForm();
});