/* ══════════════════════════════════════════════
   cart.js — логика корзины и оформления заказа
   Зависит от: store.js
   ══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    initCheckout();
});

/* ══════════════════════════════════════════════
   КОРЗИНА
   ══════════════════════════════════════════════ */

function renderCart() {
    const cart   = Store.getCart();
    const layout = document.getElementById('cartLayout');

    if (cart.length === 0) {
        layout.innerHTML = `
            <div class="cart-empty">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                <h2>Корзина пуста</h2>
                <p>Добавьте товары, чтобы оформить заказ</p>
                <a href="index.html" class="btn-continue">Перейти к покупкам</a>
            </div>`;
        return;
    }

    const total    = Store.getCartTotal();
    const delivery = total >= 5000 ? 0 : 350;

    layout.innerHTML = `
        <div class="cart-items">
            <div class="cart-table-head">
                <span>Товар</span>
                <span>Цена</span>
                <span>Количество</span>
                <span>Сумма</span>
                <span></span>
            </div>
            <div id="cartItemsList"></div>
        </div>
        <div class="cart-summary">
            <h3>Итого</h3>
            <div class="summary-line">
                <span>Товары (${Store.getCartCount()} шт.)</span>
                <span>${total.toLocaleString('ru')} ₽</span>
            </div>
            <div class="summary-line">
                <span>Доставка</span>
                <span>${delivery === 0 ? '<span class="free-delivery">Бесплатно</span>' : delivery + ' ₽'}</span>
            </div>
            <div class="summary-line summary-total">
                <span>К оплате</span>
                <span>${(total + delivery).toLocaleString('ru')} ₽</span>
            </div>
            ${delivery > 0 ? `<p class="delivery-hint">Бесплатная доставка от 5 000 ₽</p>` : ''}
            <div class="promo-wrap">
                <input type="text" class="promo-input" placeholder="Промокод" id="promoInput">
                <button class="btn-promo" onclick="applyPromo()">Применить</button>
            </div>
            <button class="btn-checkout" onclick="openCheckout()">Оформить заказ</button>
            <a href="index.html" class="btn-continue-small">← Продолжить покупки</a>
        </div>`;

    const list = document.getElementById('cartItemsList');
    cart.forEach(item => {
        const row = document.createElement('div');
        row.className = 'cart-item';
        row.dataset.id = item.id;
        row.innerHTML = `
            <div class="cart-item-product">
                <div class="cart-item-img">
                    <img src="${item.image || 'assets/images/placeholder.jpg'}" alt="${item.name}">
                </div>
                <span class="cart-item-name">${item.name}</span>
            </div>
            <div class="cart-item-price">${item.price.toLocaleString('ru')} ₽</div>
            <div class="cart-item-qty">
                <button class="qty-btn" onclick="changeQty('${item.id}', -1)">−</button>
                <span class="qty-value">${item.qty}</span>
                <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
            </div>
            <div class="cart-item-total">${(item.price * item.qty).toLocaleString('ru')} ₽</div>
            <button class="cart-item-remove" onclick="removeItem('${item.id}')" title="Удалить">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14H6L5 6"/>
                    <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
                </svg>
            </button>`;
        list.appendChild(row);
    });
}

function changeQty(id, delta) {
    const item = Store.getCart().find(i => i.id === id);
    if (!item) return;
    Store.updateCartQty(id, item.qty + delta);
    renderCart();
}

function removeItem(id) {
    Store.removeFromCart(id);
    Store.showToast('Товар удалён из корзины', 'error');
    renderCart();
}

function applyPromo() {
    const code = document.getElementById('promoInput')?.value.trim();
    if (!code) { Store.showToast('Введите промокод', 'error'); return; }
    const promo = Store.applyPromoCode(code);
    if (promo) {
        Store.showToast(`Промокод применён: ${promo.label}!`);
    } else {
        Store.showToast('Промокод не найден', 'error');
    }
}

/* ══════════════════════════════════════════════
   ОФОРМЛЕНИЕ ЗАКАЗА
   ══════════════════════════════════════════════ */

function openCheckout() {
    if (Store.getCart().length === 0) { Store.showToast('Корзина пуста', 'error'); return; }

    const total    = Store.getCartTotal();
    const delivery = total >= 5000 ? 0 : 350;
    const grand    = total + delivery;

    document.getElementById('checkoutTotalRow').innerHTML = `
        <div class="checkout-total-line">
            <span>Товары (${Store.getCartCount()} шт.)</span>
            <span>${total.toLocaleString('ru')} ₽</span>
        </div>
        <div class="checkout-total-line">
            <span>Доставка</span>
            <span>${delivery === 0 ? '<span style="color:#00c853;font-weight:600;">Бесплатно</span>' : delivery + ' ₽'}</span>
        </div>
        <div class="checkout-total-line final">
            <span>Итого</span>
            <span>${grand.toLocaleString('ru')} ₽</span>
        </div>`;

    const user = Store.getUser();
    if (user) {
        // Берём расширенные данные из профиля если есть
        let profile = {};
        try { profile = JSON.parse(localStorage.getItem('sportiki_profile') || '{}'); } catch {}

        const nameEl    = document.getElementById('chkName');
        const emailEl   = document.getElementById('chkEmail');
        const phoneEl   = document.getElementById('chkPhone');
        const addressEl = document.getElementById('chkAddress');

        if (nameEl    && !nameEl.value)    nameEl.value    = profile.name    || user.name  || '';
        if (emailEl   && !emailEl.value)   emailEl.value   = profile.email   || user.email || '';
        if (phoneEl   && !phoneEl.value)   phoneEl.value   = profile.phone   || '';
        if (addressEl && !addressEl.value) addressEl.value = profile.address || '';
    }

    document.getElementById('checkoutOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCheckout() {
    document.getElementById('checkoutOverlay').classList.remove('open');
    document.body.style.overflow = '';
}

function initCheckout() {
    document.getElementById('checkoutClose').addEventListener('click', closeCheckout);
    document.getElementById('checkoutOverlay').addEventListener('click', function(e) {
        if (e.target === this) closeCheckout();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeCheckout();
    });

    document.querySelectorAll('.checkout-form input, .checkout-form select, .checkout-form textarea').forEach(el => {
        el.addEventListener('input',  () => clearFieldError(el));
        el.addEventListener('change', () => clearFieldError(el));
    });

    document.getElementById('checkoutForm').addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateCheckout()) submitCheckout();
    });
}

function setError(inputId, errorId, message) {
    document.getElementById(inputId)?.classList.add('invalid');
    const err = document.getElementById(errorId);
    if (err) err.textContent = message;
}

function clearFieldError(el) {
    el.classList.remove('invalid');
    const errEl = document.getElementById('err' + el.id.replace('chk', ''));
    if (errEl) errEl.textContent = '';
}

function validateCheckout() {
    let valid = true;

    const name = document.getElementById('chkName').value.trim();
    if (!name || name.split(' ').filter(Boolean).length < 2) {
        setError('chkName', 'errName', 'Введите имя и фамилию');
        valid = false;
    }

    const phoneDigits = document.getElementById('chkPhone').value.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
        setError('chkPhone', 'errPhone', 'Введите корректный номер телефона');
        valid = false;
    }

    const email = document.getElementById('chkEmail').value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('chkEmail', 'errEmail', 'Введите корректный email');
        valid = false;
    }

    const address = document.getElementById('chkAddress').value.trim();
    if (!address || address.length < 10) {
        setError('chkAddress', 'errAddress', 'Введите полный адрес доставки');
        valid = false;
    }

    const agree = document.getElementById('chkAgree').checked;
    if (!agree) {
        document.getElementById('errAgree').textContent = 'Необходимо согласие с условиями';
        valid = false;
    } else {
        document.getElementById('errAgree').textContent = '';
    }

    if (!valid) {
        document.querySelector('.checkout-form .invalid')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return valid;
}

function submitCheckout() {
    const orderNum = Math.floor(Math.random() * 90000) + 10000;
    document.querySelector('.checkout-modal').innerHTML = `
        <div class="checkout-success">
            <div class="checkout-success-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00c853" stroke-width="2.5">
                    <path d="M20 6L9 17l-5-5"/>
                </svg>
            </div>
            <h2>Заказ оформлен!</h2>
            <p>Ваш заказ <strong>#${orderNum}</strong> принят.<br>
               Мы свяжемся с вами в ближайшее время для подтверждения.</p>
            <a href="index.html">Продолжить покупки</a>
        </div>`;
    Store.clearCart();
    renderCart();
}