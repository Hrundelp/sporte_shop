/* 
   product.js — логика страницы товара
   Зависит от: products.js, store.js
*/

function renderProduct(product) {
    document.title = `${product.name} | Спортики`;
    document.getElementById('breadcrumbName').textContent = product.name;

    const stars = '★'.repeat(product.rating) + '☆'.repeat(5 - product.rating);
    const inWishlist = Store.isInWishlist(product.id);
    const images = product.images && product.images.length > 0 ? product.images : [product.image];

    const thumbsHtml = images.map((src, i) =>
        `<button class="thumb-btn ${i === 0 ? 'active' : ''}" data-src="${src}" data-idx="${i}">
            <img src="${src}" alt="Фото ${i + 1}" loading="lazy">
        </button>`
    ).join('');

    const specsHtml = product.specs.map(s =>
        `<tr><td>${s.label}</td><td>${s.value}</td></tr>`
    ).join('');

    const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
    const relatedHtml = related.map(p => {
        const rStars = '★'.repeat(p.rating) + '☆'.repeat(5 - p.rating);
        return `
        <div class="product-card" data-id="${p.id}">
            <div class="product-image">
                ${p.discount > 0 ? `<div class="discount-badge">-${p.discount}%</div>` : ''}
                <img src="${p.image}" alt="${p.name}" loading="lazy">
                <div class="product-actions">
                    <button class="action-btn ${Store.isInWishlist(p.id) ? 'in-wishlist' : ''}"
                        data-product-id="${p.id}" data-name="${p.name}"
                        data-price="${p.price}" data-image="${p.image}">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                    </button>
                </div>
                <button class="btn-to-cart"
                    data-product-id="${p.id}" data-name="${p.name}"
                    data-price="${p.price}" data-image="${p.image}">
                    В корзину
                </button>
            </div>
            <div class="product-info">
                <h3><a href="product.html?id=${p.id}" style="color:inherit;text-decoration:none;">${p.name}</a></h3>
                <div class="price">
                    <span class="current-price">${p.price.toLocaleString('ru')} ₽</span>
                    ${p.oldPrice ? `<span class="old-price">${p.oldPrice.toLocaleString('ru')} ₽</span>` : ''}
                </div>
                <div class="rating">
                    <span class="stars">${rStars}</span>
                    <span>(${p.reviews})</span>
                </div>
            </div>
        </div>`;
    }).join('');

    document.getElementById('productContent').innerHTML = `
        <div class="product-layout">
            <div class="product-gallery">
                <div class="gallery-thumbs">${thumbsHtml}</div>
                <div class="gallery-main">
                    ${product.discount > 0 ? `<div class="gallery-badge">-${product.discount}%</div>` : ''}
                    <img src="${images[0]}" alt="${product.name}" id="mainImage">
                </div>
            </div>
            <div class="product-info-panel">
                <div>
                    <p style="font-size:13px;color:rgba(0,0,0,0.4);margin-bottom:8px;font-weight:500;letter-spacing:0.5px;text-transform:uppercase;">
                        ${CATEGORY_NAMES[product.category] || ''}
                    </p>
                    <h1 class="product-title">${product.name}</h1>
                </div>
                <div class="product-rating-row">
                    <span class="product-stars">${stars}</span>
                    <span class="product-reviews-count">${product.reviews} отзывов</span>
                    <span class="product-instock ${product.inStock ? 'in' : 'out'}">
                        ${product.inStock ? '✓ В наличии' : '✗ Нет в наличии'}
                    </span>
                </div>
                <div class="product-price-wrap">
                    <span class="product-price">${product.price.toLocaleString('ru')} ₽</span>
                    ${product.oldPrice ? `<span class="product-old-price">${product.oldPrice.toLocaleString('ru')} ₽</span>` : ''}
                    ${product.discount > 0 ? `<span class="product-discount-label">-${product.discount}%</span>` : ''}
                </div>
                <div class="product-divider"></div>
                <p class="product-description">${product.description}</p>
                <div class="product-divider"></div>
                <div class="product-actions-block">
                    <div class="qty-selector">
                        <button type="button" id="qtyMinus" aria-label="Уменьшить">−</button>
                        <input type="number" id="qtyInput" value="1" min="1" max="99" aria-label="Количество">
                        <button type="button" id="qtyPlus" aria-label="Увеличить">+</button>
                    </div>
                    <button class="btn-add-to-cart" id="btnAddToCart"
                        ${!product.inStock ? 'disabled style="opacity:.5;cursor:not-allowed;"' : ''}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                        </svg>
                        ${product.inStock ? 'В корзину' : 'Нет в наличии'}
                    </button>
                    <button class="btn-wishlist-product ${inWishlist ? 'active' : ''}" id="btnWishlist" aria-label="В избранное">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <div class="product-specs-section">
            <h2>Характеристики</h2>
            <table class="specs-table">
                <tbody>${specsHtml}</tbody>
            </table>
        </div>

        <div id="reviewsSection"></div>

    ${related.length > 0 ? `
        <div class="related-section">
            <div class="section-title-group" style="margin-bottom:36px;">
                <div class="section-label">
                    <div class="red-bar"></div>
                    <span>Похожие</span>
                </div>
                <h2 class="section-title">Вам может понравиться</h2>
            </div>
            <div class="related-grid">${relatedHtml}</div>
        </div>` : ''}
    `;

    // Переключение фото
    const mainImg = document.getElementById('mainImage');
    document.querySelectorAll('.thumb-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.thumb-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            mainImg.classList.add('fade');
            setTimeout(() => {
                mainImg.src = btn.dataset.src;
                mainImg.classList.remove('fade');
            }, 200);
        });
    });

    // Количество
    const qtyInput = document.getElementById('qtyInput');
    document.getElementById('qtyMinus').addEventListener('click', () => {
        const v = parseInt(qtyInput.value);
        if (v > 1) qtyInput.value = v - 1;
    });
    document.getElementById('qtyPlus').addEventListener('click', () => {
        const v = parseInt(qtyInput.value);
        if (v < 99) qtyInput.value = v + 1;
    });
    qtyInput.addEventListener('change', () => {
        let v = parseInt(qtyInput.value);
        if (isNaN(v) || v < 1) v = 1;
        if (v > 99) v = 99;
        qtyInput.value = v;
    });

    // В корзину
    if (product.inStock) {
        document.getElementById('btnAddToCart').addEventListener('click', () => {
            const qty = parseInt(qtyInput.value) || 1;
            Store.addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, qty });
        });
    }

    // В избранное
    const wishBtn = document.getElementById('btnWishlist');
    wishBtn.addEventListener('click', () => {
        const added = Store.toggleWishlist({ id: product.id, name: product.name, price: product.price, image: product.image });
        wishBtn.classList.toggle('active', added);
    });

    // Похожие — корзина / избранное
    document.querySelectorAll('.related-grid .action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const p = { id: btn.dataset.productId, name: btn.dataset.name, price: parseInt(btn.dataset.price), image: btn.dataset.image };
            const added = Store.toggleWishlist(p);
            btn.classList.toggle('in-wishlist', added);
        });
    });
    document.querySelectorAll('.related-grid .btn-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            Store.addToCart({ id: btn.dataset.productId, name: btn.dataset.name, price: parseInt(btn.dataset.price), image: btn.dataset.image });
        });
    });

    // Отзывы
    renderReviews(product);

    // Клик по похожему товару
    document.querySelectorAll('.related-grid .product-card').forEach(card => {
        card.querySelector('.product-image img')?.addEventListener('click', () => {
            window.location.href = `product.html?id=${card.dataset.id}`;
        });
        card.querySelector('.product-info h3')?.addEventListener('click', () => {
            window.location.href = `product.html?id=${card.dataset.id}`;
        });
    });
}


/* ОТЗЫВЫ*/

function getStoredReviews(productId) {
    try {
        const raw = localStorage.getItem(`sportiki_reviews_${productId}`);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
}

function saveReview(productId, review) {
    const reviews = getStoredReviews(productId);
    reviews.unshift(review); // новые сверху
    localStorage.setItem(`sportiki_reviews_${productId}`, JSON.stringify(reviews));
}

function renderReviews(product) {
    const container = document.getElementById('reviewsSection');
    if (!container) return;

    const demoReviews   = product.reviewsList || [];
    const storedReviews = getStoredReviews(product.id);
    const allReviews    = [...storedReviews, ...demoReviews];
    const user          = Store.getUser();

    const reviewsHtml = allReviews.length > 0
        ? allReviews.map(r => `
            <div class="review-card">
                <div class="review-top">
                    <div class="review-avatar">${r.author.charAt(0).toUpperCase()}</div>
                    <span class="review-author">${r.author}</span>
                    <span class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
                    <span class="review-date">${formatReviewDate(r.date)}</span>
                </div>
                <p class="review-text">${r.text}</p>
            </div>`).join('')
        : '<p style="color:rgba(0,0,0,0.4);font-size:14px;">Отзывов пока нет. Будьте первым!</p>';

    const formHtml = user
        ? `<div class="review-form-wrap">
            <h3>Оставить отзыв</h3>
            <form id="reviewForm" class="review-form" novalidate>
                <div>
                    <p style="font-size:13px;color:rgba(0,0,0,0.5);margin-bottom:8px;">Ваша оценка *</p>
                    <div class="star-rating">
                        <input type="radio" id="s5" name="rating" value="5"><label for="s5">★</label>
                        <input type="radio" id="s4" name="rating" value="4"><label for="s4">★</label>
                        <input type="radio" id="s3" name="rating" value="3"><label for="s3">★</label>
                        <input type="radio" id="s2" name="rating" value="2"><label for="s2">★</label>
                        <input type="radio" id="s1" name="rating" value="1"><label for="s1">★</label>
                    </div>
                </div>
                <textarea id="reviewText" placeholder="Расскажите о товаре — что понравилось, что нет?" rows="4"></textarea>
                <button type="submit" class="btn-submit-review">Опубликовать отзыв</button>
            </form>
        </div>`
        : `<div class="review-login-prompt">
            <a href="login.html">Войдите</a>, чтобы оставить отзыв
        </div>`;

    container.innerHTML = `
        <div class="reviews-section">
            <div class="reviews-header">
                <h2>Отзывы</h2>
                <span class="reviews-total">${allReviews.length} ${declReviews(allReviews.length)}</span>
            </div>
            <div class="reviews-list" id="reviewsList">${reviewsHtml}</div>
            ${formHtml}
        </div>`;

    // Обработка формы
    document.getElementById('reviewForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const ratingInput = document.querySelector('.star-rating input:checked');
        const text = document.getElementById('reviewText').value.trim();

        if (!ratingInput) { Store.showToast('Поставьте оценку', 'error'); return; }
        if (text.length < 10) { Store.showToast('Напишите отзыв (минимум 10 символов)', 'error'); return; }

        const review = {
            author: user.name || 'Пользователь',
            rating: parseInt(ratingInput.value),
            date:   new Date().toISOString().split('T')[0],
            text
        };

        saveReview(product.id, review);
        Store.showToast('Отзыв опубликован!');

        renderReviews(product);
    });
}

function formatReviewDate(dateStr) {
    try {
        return new Date(dateStr).toLocaleDateString('ru-RU', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    } catch { return dateStr; }
}

function declReviews(n) {
    const abs = Math.abs(n) % 100;
    const mod = abs % 10;
    if (abs >= 11 && abs <= 19) return 'отзывов';
    if (mod === 1) return 'отзыв';
    if (mod >= 2 && mod <= 4) return 'отзыва';
    return 'отзывов';
}

/*Страница "Не найден"*/
function renderNotFound() {
    document.title = 'Товар не найден | Спортики';
    document.getElementById('productContent').innerHTML = `
        <div class="product-not-found">
            <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1.5">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <h2>Товар не найден</h2>
            <p>Возможно, он был удалён или вы перешли по неверной ссылке</p>
            <a href="catalog.html">Вернуться в каталог</a>
        </div>`;
}

/* Init*/
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const product = PRODUCTS.find(p => p.id === id);

    if (product) {
        renderProduct(product);
    } else {
        renderNotFound();
    }

    document.querySelectorAll('.newsletter').forEach(form => {
        form.querySelector('button')?.addEventListener('click', e => {
            e.preventDefault();
            const input = form.querySelector('input');
            const email = input?.value.trim();
            if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                Store.showToast(`Подписка оформлена на ${email}`);
                input.value = '';
            } else {
                Store.showToast('Введите корректный e-mail', 'error');
            }
        });
    });
});