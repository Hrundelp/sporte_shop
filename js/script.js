/**
 * script.js — логика главной страницы
 * Требует store.js подключённого ДО этого файла
 */

// COUNTDOWN TIMER 
// Целевая дата — 3 дня от первого запуска, сохраняется в localStorage
function getCountdownTarget() {
    const key = 'sportiki_sale_end';
    let target = localStorage.getItem(key);
    if (!target) {
        // дата окончания 3 дня с момента первого посещения
        target = Date.now() + 3 * 24 * 60 * 60 * 1000;
        localStorage.setItem(key, target);
    }
    return parseInt(target);
}

function updateCountdown() {
    const daysEl    = document.getElementById('days');
    const hoursEl   = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    if (!hoursEl || !minutesEl || !secondsEl) return;

    const remaining = getCountdownTarget() - Date.now();

    if (remaining <= 0) {
        // Таймер истёк — показываем нули и останавливаем
        if (daysEl)    daysEl.textContent    = '00';
        hoursEl.textContent   = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        clearInterval(countdownInterval);
        return;
    }

    const totalSeconds = Math.floor(remaining / 1000);
    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    if (daysEl)    daysEl.textContent    = String(d).padStart(2, '0');
    hoursEl.textContent   = String(h).padStart(2, '0');
    minutesEl.textContent = String(m).padStart(2, '0');
    secondsEl.textContent = String(s).padStart(2, '0');

    // Синхронизируем баннерный таймер (promo-banner)
    const bDays = document.getElementById('bannerDays');
    const bHours = document.getElementById('bannerHours');
    const bMinutes = document.getElementById('bannerMinutes');
    const bSeconds = document.getElementById('bannerSeconds');
    if (bDays)    bDays.textContent    = String(d).padStart(2, '0');
    if (bHours)   bHours.textContent   = String(h).padStart(2, '0');
    if (bMinutes) bMinutes.textContent = String(m).padStart(2, '0');
    if (bSeconds) bSeconds.textContent = String(s).padStart(2, '0');
}
const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown(); // запускаем сразу без задержки в 1 сек

// PRODUCTS SCROLL
function scrollProducts(direction) {
    const container = document.getElementById('flashProducts');
    if (!container) return;
    container.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
}

// CATEGORIES SCROLL
function scrollCategories(direction) {
    const container = document.getElementById('categoriesGrid');
    if (!container) return;
    container.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {

    // БУРГЕР-МЕНЮ 
    const navbar = document.querySelector('.navbar .container');
    const navMenu = document.querySelector('.nav-menu');

    if (navbar && navMenu) {
        // Создаём кнопку бургера
        const burger = document.createElement('button');
        burger.className = 'burger-btn';
        burger.setAttribute('aria-label', 'Меню');
        burger.innerHTML = `
            <span></span>
            <span></span>
            <span></span>`;
        navbar.insertBefore(burger, navMenu);

        burger.addEventListener('click', () => {
            burger.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        // Закрываем при клике вне меню
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target)) {
                burger.classList.remove('open');
                navMenu.classList.remove('open');
            }
        });
    }

    // ─── ЖИВОЙ ПОИСК
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim().toLowerCase();
            const allCards = document.querySelectorAll('.product-card');

            if (!query) {
                allCards.forEach(card => card.style.display = '');
                return;
            }

            allCards.forEach(card => {
                const name = card.querySelector('h3')?.textContent.toLowerCase() || '';
                card.style.display = name.includes(query) ? '' : 'none';
            });
        });

        // Очищаем поиск при нажатии Escape
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchInput.value = '';
                document.querySelectorAll('.product-card').forEach(c => c.style.display = '');
                searchInput.blur();
            }
        });
    }

    // ─── ФИЛЬТРАЦИЯ ПО КАТЕГОРИЯМ
    // Маппинг названий категорий
    const CATEGORY_KEYWORDS = {
        'Одежда':      ['костюм', 'футболка', 'шорты', 'форма', 'gussi'],
        'Обувь':       ['кроссовки', 'бутсы', 'боксерки', 'обувь'],
        'Аксессуары':  ['перчатки', 'лапы', 'бинт', 'скакалка'],
        'Бег, ходьба': ['кроссовки', 'беговые'],
        'Плавание':    ['купальник', 'очки', 'шапочка'],
        'Футбол':      ['бутсы', 'мяч', 'форма', 'футбол'],
    };

    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            // Переключаем активный класс
            document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            const categoryName = card.querySelector('span')?.textContent.trim();
            const keywords = CATEGORY_KEYWORDS[categoryName] || [];

            const allCards = document.querySelectorAll('.product-card');

            if (!keywords.length) {
                allCards.forEach(c => c.style.display = '');
                return;
            }

            allCards.forEach(productCard => {
                const name = productCard.querySelector('h3')?.textContent.toLowerCase() || '';
                const matches = keywords.some(kw => name.includes(kw));
                productCard.style.display = matches ? '' : 'none';
            });

            // Прокручиваем к товарам
            const firstSection = document.querySelector('.flash-sales, .best-selling');
            if (firstSection) {
                firstSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    //HERO SLIDER
    const slider = document.getElementById('heroSlider');
    const dots   = document.querySelectorAll('.banner-dots span');
    let currentSlide = 0;
    let slideInterval;

    function updateSlider(index) {
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[index]) dots[index].classList.add('active');
        if (slider) slider.style.transform = `translateX(-${index * 100}%)`;
        currentSlide = index;
    }

    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                updateSlider(index);
                clearInterval(slideInterval);
                slideInterval = setInterval(() => updateSlider((currentSlide + 1) % dots.length), 5000);
            });
        });
        slideInterval = setInterval(() => updateSlider((currentSlide + 1) % dots.length), 5000);
    }

    // ─── КНОПКИ "В ИЗБРАННОЕ" (карточки товаров)
    // Работает для карточек с data-product-id на кнопке .action-btn
    document.querySelectorAll('.action-btn[data-product-id]').forEach(btn => {
        const id = btn.dataset.productId;
        if (Store.isInWishlist(id)) btn.classList.add('in-wishlist');

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const product = {
                id,
                name:  btn.dataset.name  || btn.closest('.product-card')?.querySelector('h3')?.textContent || 'Товар',
                price: parseInt(btn.dataset.price) || 0,
                image: btn.dataset.image || ''
            };
            const added = Store.toggleWishlist(product);
            btn.classList.toggle('in-wishlist', added);
        });
    });

    // ─── КНОПКИ "В КОРЗИНУ" 
    document.querySelectorAll('.btn-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            Store.addToCart({
                id:    btn.dataset.productId,
                name:  btn.dataset.name,
                price: parseInt(btn.dataset.price),
                image: btn.dataset.image || ''
            });
        });
    });

    // ─── NEWSLETTER 
    document.querySelectorAll('.newsletter').forEach(form => {
        form.querySelector('button')?.addEventListener('click', (e) => {
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