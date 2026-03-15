/* ══════════════════════════════════════════════
   wishlist.js — логика страницы избранного
   Зависит от: store.js
   ══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    renderWishlist();
});

function renderWishlist() {
    const list    = Store.getWishlist();
    const content = document.getElementById('wishlistContent');
    const countEl = document.getElementById('wishlistCount');
    const btnAll  = document.getElementById('btnAddAll');

    if (countEl) countEl.textContent = list.length > 0 ? `(${list.length})` : '';
    if (btnAll)  btnAll.style.display = list.length > 0 ? 'block' : 'none';

    if (list.length === 0) {
        content.innerHTML = `
            <div class="cart-empty">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <h2>В избранном пусто</h2>
                <p>Добавляйте понравившиеся товары, нажимая на ♥</p>
                <a href="index.html" class="btn-continue">Перейти к покупкам</a>
            </div>`;
        return;
    }

    const grid = document.createElement('div');
    grid.className = 'wishlist-grid';

    list.forEach(item => {
        const card = document.createElement('div');
        card.className = 'wishlist-card';
        card.dataset.id = item.id;
        card.innerHTML = `
            <div class="wishlist-card-img">
                <img src="${item.image || 'assets/images/placeholder.jpg'}" alt="${item.name}">
                <button class="wishlist-remove" onclick="removeFromWishlist('${item.id}')" title="Удалить из избранного">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
            <div class="wishlist-card-info">
                <h3 class="wishlist-card-name">${item.name}</h3>
                <div class="wishlist-card-price">${item.price.toLocaleString('ru')} ₽</div>
                <button class="wishlist-btn-cart" onclick="moveToCart('${item.id}')">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    В корзину
                </button>
            </div>`;
        grid.appendChild(card);
    });

    content.innerHTML = '';
    content.appendChild(grid);
}

function removeFromWishlist(id) {
    const product = Store.getWishlist().find(i => i.id === id);
    if (product) {
        Store.toggleWishlist(product);
        renderWishlist();
    }
}

function moveToCart(id) {
    const product = Store.getWishlist().find(i => i.id === id);
    if (!product) return;
    Store.addToCart(product);
    Store.toggleWishlist(product);
    renderWishlist();
}

function addAllToCart() {
    const list = Store.getWishlist();
    if (list.length === 0) return;
    list.forEach(product => Store.addToCart(product));
    localStorage.removeItem('sportiki_wishlist');
    Store.updateWishlistBadge();
    Store.showToast('Все товары добавлены в корзину');
    renderWishlist();
}