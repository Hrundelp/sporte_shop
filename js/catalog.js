/* ══════════════════════════════════════════════════════
   СОСТОЯНИЕ ФИЛЬТРОВ
   ══════════════════════════════════════════════════════ */
let state = {
    category: 'all',
    priceMin: null,
    priceMax: null,
    search: '',
    sort: 'default'
};

/* ══════════════════════════════════════════════════════
   РЕНДЕР
   ══════════════════════════════════════════════════════ */
function renderGrid(products) {
    const grid = document.getElementById('catalogGrid');
    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = `
            <div class="catalog-empty">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.5">
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <h3>Ничего не найдено</h3>
                <p>Попробуйте изменить фильтры или поисковый запрос</p>
                <button onclick="resetFilters()">Сбросить фильтры</button>
            </div>`;
        document.getElementById('visibleCount').textContent = 0;
        return;
    }

    products.forEach(p => {
        const inWishlist = Store.isInWishlist(p.id);
        const stars = '★'.repeat(p.rating) + '☆'.repeat(5 - p.rating);
        const specsHtml = p.specs.map(s =>
            `<div class="product-spec"><span>${s.label}:</span><span>${s.value}</span></div>`
        ).join('');

        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.id = p.id;
        card.innerHTML = `
            <div class="product-image">
                ${p.discount > 0 ? `<div class="discount-badge">-${p.discount}%</div>` : ''}
                <a href="product.html?id=${p.id}" style="display:block;width:100%;height:100%;">
                    <img src="${p.image}" alt="${p.name}" loading="lazy" style="width:100%;height:100%;object-fit:cover;">
                </a>
                <div class="product-actions">
                    <button class="action-btn ${inWishlist ? 'in-wishlist' : ''}"
                        data-product-id="${p.id}"
                        data-name="${p.name}"
                        data-price="${p.price}"
                        data-image="${p.image}"
                        title="В избранное">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                    </button>
                </div>
                <button class="btn-to-cart"
                    data-product-id="${p.id}"
                    data-name="${p.name}"
                    data-price="${p.price}"
                    data-image="${p.image}">
                    В корзину
                </button>
            </div>
            <div class="product-info">
                <h3><a href="product.html?id=${p.id}" style="color:inherit;text-decoration:none;">${p.name}</a></h3>
                <div class="price">
                    <span class="current-price">${p.price.toLocaleString('ru')} ₽</span>
                    ${p.oldPrice ? `<span class="old-price">${p.oldPrice.toLocaleString('ru')} ₽</span>` : ''}
                </div>
                <div class="product-specs">${specsHtml}</div>
                <div class="rating">
                    <span class="stars">${stars}</span>
                    <span>(${p.reviews})</span>
                </div>
            </div>`;
        grid.appendChild(card);
    });

    // Навешиваем обработчики
    grid.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const product = {
                id: btn.dataset.productId,
                name: btn.dataset.name,
                price: parseInt(btn.dataset.price),
                image: btn.dataset.image
            };
            const added = Store.toggleWishlist(product);
            btn.classList.toggle('in-wishlist', added);
        });
    });

    grid.querySelectorAll('.btn-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            Store.addToCart({
                id: btn.dataset.productId,
                name: btn.dataset.name,
                price: parseInt(btn.dataset.price),
                image: btn.dataset.image
            });
        });
    });

    document.getElementById('visibleCount').textContent = products.length;
}

/* ══════════════════════════════════════════════════════
   ФИЛЬТРАЦИЯ + СОРТИРОВКА
   ══════════════════════════════════════════════════════ */
function getFiltered() {
    let list = [...PRODUCTS];

    // По категории
    if (state.category !== 'all') {
        list = list.filter(p => p.category === state.category);
    }

    // По цене
    if (state.priceMin !== null) list = list.filter(p => p.price >= state.priceMin);
    if (state.priceMax !== null) list = list.filter(p => p.price <= state.priceMax);

    // По поиску
    if (state.search) {
        const q = state.search.toLowerCase();
        list = list.filter(p => p.name.toLowerCase().includes(q));
    }

    // Сортировка
    switch (state.sort) {
        case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
        case 'price-desc': list.sort((a, b) => b.price - a.price); break;
        case 'name-asc':   list.sort((a, b) => a.name.localeCompare(b.name, 'ru')); break;
        case 'discount':   list.sort((a, b) => b.discount - a.discount); break;
    }

    return list;
}

function applyAll() {
    state.sort = document.getElementById('sortSelect').value;
    renderGrid(getFiltered());
    renderChips();
}

function applyPriceFilter() {
    const min = parseInt(document.getElementById('priceMin').value);
    const max = parseInt(document.getElementById('priceMax').value);
    state.priceMin = isNaN(min) ? null : min;
    state.priceMax = isNaN(max) ? null : max;
    applyAll();
}

function resetFilters() {
    state = { category: 'all', priceMin: null, priceMax: null, search: '', sort: 'default' };
    document.getElementById('priceMin').value = '';
    document.getElementById('priceMax').value = '';
    document.getElementById('sortSelect').value = 'default';
    document.getElementById('catalogSearch').value = '';
    document.querySelectorAll('#categoryList button').forEach(b => b.classList.remove('active'));
    document.querySelector('#categoryList button[data-category="all"]').classList.add('active');
    applyAll();
}

/* ══════════════════════════════════════════════════════
   CHIPS (активные фильтры)
   ══════════════════════════════════════════════════════ */
function renderChips() {
    const wrap = document.getElementById('activeFilters');
    wrap.innerHTML = '';

    if (state.category !== 'all') {
        addChip(wrap, `Категория: ${CATEGORY_NAMES[state.category]}`, () => {
            state.category = 'all';
            document.querySelectorAll('#categoryList button').forEach(b => b.classList.remove('active'));
            document.querySelector('#categoryList button[data-category="all"]').classList.add('active');
            applyAll();
        });
    }

    if (state.priceMin !== null || state.priceMax !== null) {
        const label = state.priceMin && state.priceMax
            ? `${state.priceMin.toLocaleString('ru')} – ${state.priceMax.toLocaleString('ru')} ₽`
            : state.priceMin ? `от ${state.priceMin.toLocaleString('ru')} ₽`
            : `до ${state.priceMax.toLocaleString('ru')} ₽`;
        addChip(wrap, `Цена: ${label}`, () => {
            state.priceMin = null; state.priceMax = null;
            document.getElementById('priceMin').value = '';
            document.getElementById('priceMax').value = '';
            applyAll();
        });
    }

    if (state.search) {
        addChip(wrap, `Поиск: «${state.search}»`, () => {
            state.search = '';
            document.getElementById('catalogSearch').value = '';
            applyAll();
        });
    }
}

function addChip(container, label, onRemove) {
    const chip = document.createElement('div');
    chip.className = 'filter-chip';
    chip.innerHTML = `<span>${label}</span><button title="Удалить фильтр">✕</button>`;
    chip.querySelector('button').addEventListener('click', onRemove);
    container.appendChild(chip);
}

/* ══════════════════════════════════════════════════════
   СЧЁТЧИКИ В КАТЕГОРИЯХ
   ══════════════════════════════════════════════════════ */
function updateCounters() {
    const cats = ['boxing', 'clothing', 'shoes', 'running', 'accessories'];
    document.getElementById('cnt-all').textContent = PRODUCTS.length;
    cats.forEach(c => {
        const el = document.getElementById(`cnt-${c}`);
        if (el) el.textContent = PRODUCTS.filter(p => p.category === c).length;
    });
}

/* ══════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

    // Читаем ?category= из URL (переход из сайдбара главной)
    const urlParams = new URLSearchParams(window.location.search);
    const urlCategory = urlParams.get('category');
    const validCategories = ['all', 'boxing', 'clothing', 'shoes', 'running', 'accessories'];

    if (urlCategory && validCategories.includes(urlCategory)) {
        state.category = urlCategory;
        document.querySelectorAll('#categoryList button').forEach(b => {
            b.classList.toggle('active', b.dataset.category === urlCategory);
        });
    }

    updateCounters();
    applyAll();

    // Фильтр по категории
    document.querySelectorAll('#categoryList button').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#categoryList button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.category = btn.dataset.category;
            applyAll();
        });
    });

    // Живой поиск
    document.getElementById('catalogSearch').addEventListener('input', function () {
        state.search = this.value.trim().toLowerCase();
        applyAll();
    });

    // Поиск по Enter в прайс-полях
    ['priceMin', 'priceMax'].forEach(id => {
        document.getElementById(id).addEventListener('keydown', e => {
            if (e.key === 'Enter') applyPriceFilter();
        });
    });

    // Newsletter
    document.querySelectorAll('.newsletter').forEach(form => {
        form.querySelector('button')?.addEventListener('click', e => {
            e.preventDefault();
            const input = form.querySelector('input');
            const email = input?.value.trim();
            if (email && email.includes('@')) {
                Store.showToast(`Подписка оформлена на ${email}`);
                input.value = '';
            } else {
                Store.showToast('Введите корректный e-mail', 'error');
            }
        });
    });
});