/**
 * store.js — единое хранилище данных сайта Спортики
 * Управляет: корзиной, избранным, авторизацией
 */

const Store = (() => {

    // ─── PROMO CODES ─────────────────────────────────────────────────────────

    const PROMO_CODES = {
        'SPORT10': { discount: 0.10, label: 'скидка 10%' },
        'SPORT20': { discount: 0.20, label: 'скидка 20%' },
        'FIRST':   { discount: 0.15, label: 'скидка 15% для новых покупателей' },
    };

    function applyPromoCode(code) {
        const promo = PROMO_CODES[code.toUpperCase()];
        if (!promo) return null;
        return promo;
    }

    // ─── AUTH ────────────────────────────────────────────────────────────────

    function getUser() {
        try {
            const raw = localStorage.getItem('sportiki_user');
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    function setUser(userData) {
        localStorage.setItem('sportiki_user', JSON.stringify(userData));
        renderHeader();
    }

    function logout() {
        localStorage.removeItem('sportiki_user');
        renderHeader();
    }

    function isLoggedIn() {
        return getUser() !== null;
    }

    // ─── CART ────────────────────────────────────────────────────────────────

    function getCart() {
        try {
            const raw = localStorage.getItem('sportiki_cart');
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem('sportiki_cart', JSON.stringify(cart));
        updateCartBadge();
    }

    function addToCart(product) {
        if (!isLoggedIn()) {
            showToast('Войдите в аккаунт, чтобы добавить товар в корзину', 'error');
            setTimeout(() => window.location.href = 'login.html', 1500);
            return;
        }
        if (!product.id || !product.name || !product.price) return;
        const cart = getCart();
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            existing.qty += (product.qty || 1);
        } else {
            cart.push({ ...product, qty: product.qty || 1 });
        }
        saveCart(cart);
        showToast(`«${product.name}» добавлен в корзину`);
    }

    function removeFromCart(productId) {
        const cart = getCart().filter(item => item.id !== productId);
        saveCart(cart);
    }

    function updateCartQty(productId, qty) {
        if (qty <= 0) {
            removeFromCart(productId);
            return;
        }
        const cart = getCart();
        const item = cart.find(i => i.id === productId);
        if (item) {
            item.qty = qty;
            saveCart(cart);
        }
    }

    function clearCart() {
        saveCart([]);
    }

    function getCartTotal() {
        return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
    }

    function getCartCount() {
        return getCart().reduce((sum, item) => sum + item.qty, 0);
    }

    // ─── WISHLIST ────────────────────────────────────────────────────────────

    function getWishlist() {
        try {
            const raw = localStorage.getItem('sportiki_wishlist');
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    function saveWishlist(list) {
        localStorage.setItem('sportiki_wishlist', JSON.stringify(list));
        updateWishlistBadge();
    }

    function toggleWishlist(product) {
        if (!isLoggedIn()) {
            showToast('Войдите в аккаунт, чтобы добавить в избранное', 'error');
            setTimeout(() => window.location.href = 'login.html', 1500);
            return false;
        }
        const list = getWishlist();
        const idx = list.findIndex(i => i.id === product.id);
        if (idx >= 0) {
            list.splice(idx, 1);
            showToast(`«${product.name}» удалён из избранного`, 'error');
        } else {
            list.push(product);
            showToast(`«${product.name}» добавлен в избранное`);
        }
        saveWishlist(list);
        return idx < 0; // true = добавлен
    }

    function isInWishlist(productId) {
        return getWishlist().some(i => i.id === productId);
    }

    // ─── UI BADGES ───────────────────────────────────────────────────────────

    function updateCartBadge() {
        const count = getCartCount();
        document.querySelectorAll('.cart-badge').forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
            // Пульсация при изменении
            el.classList.remove('pulse');
            void el.offsetWidth; // reflow для перезапуска анимации
            if (count > 0) el.classList.add('pulse');
        });
    }

    function updateWishlistBadge() {
        const count = getWishlist().length;
        document.querySelectorAll('.wishlist-badge').forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
            el.classList.remove('pulse');
            void el.offsetWidth;
            if (count > 0) el.classList.add('pulse');
        });
    }

    // ─── HEADER AUTH UI ──────────────────────────────────────────────────────

    function renderHeader() {
        const user = getUser();
        const userBtnWrap = document.querySelector('.user-btn-wrap');
        if (!userBtnWrap) return;

        if (user) {
            userBtnWrap.innerHTML = `
                <div class="user-dropdown-wrap">
                    <button class="icon-btn user-avatar-btn" title="${user.name}">
                        <span class="avatar-initials">${getInitials(user.name)}</span>
                    </button>
                    <div class="user-dropdown">
                        <div class="user-dropdown-header">
                            <span class="avatar-initials">${getInitials(user.name)}</span>
                            <div>
                                <div class="user-dropdown-name">${user.name}</div>
                                <div class="user-dropdown-email">${user.phone || user.email || ''}</div>
                            </div>
                        </div>
                        <ul class="user-dropdown-menu">
                            <li><a href="profile.html">Личный кабинет</a></li>
                            <li><a href="cart.html">Корзина</a></li>
                            <li><a href="wishlist.html">Избранное</a></li>
                            <li><button class="logout-btn" id="logoutBtn">Выйти</button></li>
                        </ul>
                    </div>
                </div>`;

            document.getElementById('logoutBtn')?.addEventListener('click', () => {
                logout();
                showToast('Вы вышли из аккаунта');
            });
        } else {
            userBtnWrap.innerHTML = `<a href="login.html" class="btn-header-login">Войти</a>`;
        }

        updateCartBadge();
        updateWishlistBadge();
    }

    function getInitials(name) {
        if (!name) return '?';
        return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    }

    // ─── TOAST ───────────────────────────────────────────────────────────────

    function showToast(message, type = 'success') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                ${type === 'success'
                    ? '<path d="M20 6L9 17l-5-5"/>'
                    : '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>'}
            </svg>
            <span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    // ─── INIT ─────────────────────────────────────────────────────────────────

    // ─── SEARCH DROPDOWN ──────────────────────────────────────────────────────

    function initSearch() {
        const searchBox = document.querySelector('.search-box');
        if (!searchBox) return;

        const input = searchBox.querySelector('input');
        if (!input) return;

        // Не инициализируем на странице каталога — там свой поиск
        if (window.location.pathname.includes('catalog.html')) return;

        // Создаём дропдаун
        const dropdown = document.createElement('div');
        dropdown.className = 'search-dropdown';
        dropdown.setAttribute('role', 'listbox');
        searchBox.style.position = 'relative';
        searchBox.appendChild(dropdown);

        // Берём товары — ждём products.js если он ещё не загружен
        function getProducts() {
            return (typeof PRODUCTS !== 'undefined') ? PRODUCTS : [];
        }

        function showDropdown(items) {
            dropdown.innerHTML = '';
            if (items.length === 0) {
                dropdown.innerHTML = '<div class="search-dd-empty">Ничего не найдено</div>';
                dropdown.classList.add('open');
                return;
            }
            items.forEach(p => {
                const item = document.createElement('a');
                item.className = 'search-dd-item';
                item.href = `product.html?id=${p.id}`;
                item.setAttribute('role', 'option');
                item.innerHTML = `
                    <img src="${p.image}" alt="${p.name}">
                    <div class="search-dd-info">
                        <span class="search-dd-name">${highlight(p.name, input.value)}</span>
                        <span class="search-dd-price">${p.price.toLocaleString('ru')} ₽</span>
                    </div>
                    ${p.discount > 0 ? `<span class="search-dd-badge">-${p.discount}%</span>` : ''}`;
                dropdown.appendChild(item);
            });

            // Ссылка «Смотреть все результаты в каталоге»
            const all = document.createElement('a');
            all.className = 'search-dd-all';
            all.href = `catalog.html`;
            all.textContent = `Смотреть все результаты в каталоге →`;
            dropdown.appendChild(all);

            dropdown.classList.add('open');
        }

        function hideDropdown() {
            dropdown.classList.remove('open');
        }

        // Подсветка совпадающего текста
        function highlight(text, query) {
            if (!query) return text;
            const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            return text.replace(new RegExp(`(${escaped})`, 'gi'),
                '<mark style="background:rgba(219,68,68,0.15);color:#DB4444;border-radius:2px;">$1</mark>');
        }

        let debounceTimer;
        input.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            const q = input.value.trim().toLowerCase();

            if (q.length < 2) { hideDropdown(); return; }

            debounceTimer = setTimeout(() => {
                const results = getProducts()
                    .filter(p => p.name.toLowerCase().includes(q))
                    .slice(0, 6); // максимум 6 результатов
                showDropdown(results);
            }, 150);
        });

        // Закрыть при клике вне
        document.addEventListener('click', e => {
            if (!searchBox.contains(e.target)) hideDropdown();
        });

        // Закрыть при Escape
        input.addEventListener('keydown', e => {
            if (e.key === 'Escape') { hideDropdown(); input.blur(); }
            // Enter — переходим на каталог с поиском если нет результатов
            if (e.key === 'Enter' && input.value.trim().length > 1) {
                window.location.href = `catalog.html`;
            }
        });

        // Клик по иконке поиска — переход в каталог
        const icon = searchBox.querySelector('img');
        if (icon) {
            icon.style.cursor = 'pointer';
            icon.addEventListener('click', () => {
                if (input.value.trim().length > 0) {
                    window.location.href = `catalog.html`;
                }
            });
        }
    }

    function init() {
        document.addEventListener('DOMContentLoaded', () => {
            renderHeader();
            // Отмечаем активные кнопки избранного на странице
            document.querySelectorAll('[data-product-id]').forEach(btn => {
                if (isInWishlist(btn.dataset.productId)) {
                    btn.classList.add('in-wishlist');
                }
            });
            setTimeout(initSearch, 0);
        });
    }

    init();

    return {
        getUser, setUser, logout, isLoggedIn,
        getCart, addToCart, removeFromCart, updateCartQty, clearCart, getCartTotal, getCartCount,
        getWishlist, toggleWishlist, isInWishlist,
        applyPromoCode,
        renderHeader, showToast,
        updateCartBadge, updateWishlistBadge
    };
})();