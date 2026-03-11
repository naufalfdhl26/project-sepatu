document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. DARK MODE
    // ==========================================
    const btnTheme = document.getElementById('btn-theme');
    const body = document.body;

    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        btnTheme.innerText = "Mode Terang";
    }

    btnTheme.addEventListener('click', function () {
        body.classList.toggle('dark-mode');

        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            btnTheme.innerText = "Mode Terang";
        } else {
            localStorage.removeItem('theme');
            btnTheme.innerText = "Mode Gelap";
        }
    });

    // ==========================================
    // 2. BELI
    // ==========================================
    function aktifkanTombolBeli() {
        const tombolBeli = document.querySelectorAll('.btn-detail');

        tombolBeli.forEach(function (button) {
            button.replaceWith(button.cloneNode(true));
        });

        const tombolBaru = document.querySelectorAll('.btn-detail');

        tombolBaru.forEach(function (button) {
            button.addEventListener('click', function (e) {
                const cardBody = e.target.closest('.card-body');
                const stokElement = cardBody.querySelector('.stok-text');

                let stok = parseInt(stokElement.innerText.replace("Stok: ", ""));

                if (stok > 0) {
                    stok--;
                    stokElement.innerText = "Stok: " + stok;

                    const namaBarang = cardBody.querySelector('.card-title').innerText;
                    alert("Berhasil membeli " + namaBarang);
                } else {
                    alert("Stok Habis!");
                    e.target.disabled = true;
                    e.target.innerText = "Habis";
                }
            });
        });
    }

    aktifkanTombolBeli();

    // ==========================================
    // 3. WISHLIST
    // ==========================================
    let wishlist = JSON.parse(sessionStorage.getItem('wishlist')) || [];
    const wishlistModal = document.getElementById('wishlistModal');

    function updateWishlistCount() {
        document.getElementById('wishlist-count').innerText = wishlist.length;
    }

    function tampilkanWishlist() {
        const daftarWishlist = document.getElementById('daftar-wishlist');
        daftarWishlist.innerHTML = '';

        if (wishlist.length === 0) {
            daftarWishlist.innerHTML =
                '<li class="list-group-item text-center text-muted">Wishlist masih kosong.</li>';
        } else {
            wishlist.forEach(function (item) {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.innerText = '❤ ' + item;
                daftarWishlist.appendChild(li);
            });
        }
    }

    document.querySelectorAll('.btn-wishlist').forEach(function (button) {
        button.addEventListener('click', function (e) {
            const cardBody = e.target.closest('.card-body');
            const namaBarang = cardBody.querySelector('.card-title').innerText;

            if (!wishlist.includes(namaBarang)) {
                wishlist.push(namaBarang);
                sessionStorage.setItem('wishlist', JSON.stringify(wishlist));
                updateWishlistCount();

                // tambahkan dan langsung tunjukkan modal tanpa alert
                const modalInstance = new bootstrap.Modal(wishlistModal);
                tampilkanWishlist();
                modalInstance.show();
            } else {
                // jika sudah ada, beri notifikasi singkat tanpa memblokir UI
                alert(namaBarang + " sudah ada di Wishlist!");
            }
        });
    });

    // tampilkan saat modal dibuka manual
    wishlistModal.addEventListener('show.bs.modal', function () {
        tampilkanWishlist();
    });

    // handle navbar wishlist button (tidak lagi menggunakan data-bs attributes)
    const btnWishlistNav = document.getElementById('btn-wishlist-nav');
    if (btnWishlistNav) {
        btnWishlistNav.addEventListener('click', function () {
            tampilkanWishlist();
            const modalInstance = new bootstrap.Modal(wishlistModal);
            modalInstance.show();
        });
    }

    // hapus semua
    window.hapusWishlist = function () {
        wishlist = [];
        sessionStorage.removeItem('wishlist');
        updateWishlistCount();
        tampilkanWishlist();
    };

    updateWishlistCount();
});