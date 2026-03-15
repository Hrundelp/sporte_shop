/* 
   profile.js — личный кабинет
   Зависит от: store.js
*/

document.addEventListener('DOMContentLoaded', () => {

    const user = Store.getUser();

    // Если не авторизован — редирект на логин
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    initProfile(user);
});

function initProfile(user) {
    // Заполняем шапку профиля
    document.getElementById('profileInitials').textContent = getInitials(user.name);
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileEmail').textContent = user.email || '—';
    document.getElementById('profileSince').textContent = formatDate(user.registeredAt || user.loginAt);

    // Счётчики
    document.getElementById('profileCartCount').textContent = Store.getCartCount();
    document.getElementById('profileWishlistCount').textContent = Store.getWishlist().length;

    // Заполняем форму редактирования
    const saved = getSavedProfile();
    document.getElementById('fieldName').value    = saved.name    || user.name  || '';
    document.getElementById('fieldEmail').value   = saved.email   || user.email || '';
    document.getElementById('fieldPhone').value   = saved.phone   || '';
    document.getElementById('fieldAddress').value = saved.address || '';

    // Сохранение формы
    document.getElementById('profileForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveProfile();
    });

    // Кнопка выйти
    document.getElementById('btnLogout').addEventListener('click', () => {
        Store.logout();
        Store.showToast('Вы вышли из аккаунта');
        setTimeout(() => window.location.href = 'index.html', 1000);
    });
}

function saveProfile() {
    const name    = document.getElementById('fieldName').value.trim();
    const email   = document.getElementById('fieldEmail').value.trim();
    const phone   = document.getElementById('fieldPhone').value.trim();
    const address = document.getElementById('fieldAddress').value.trim();

    // Валидация
    let valid = true;

    if (!name || name.split(' ').filter(Boolean).length < 2) {
        showFieldError('fieldName', 'errFieldName', 'Введите имя и фамилию');
        valid = false;
    } else {
        clearFieldError('fieldName', 'errFieldName');
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFieldError('fieldEmail', 'errFieldEmail', 'Введите корректный email');
        valid = false;
    } else {
        clearFieldError('fieldEmail', 'errFieldEmail');
    }

    if (!valid) return;

    // Сохраняем расширенные данные профиля отдельно
    const profile = { name, email, phone, address };
    localStorage.setItem('sportiki_profile', JSON.stringify(profile));

    // Обновляем основного пользователя (имя и email)
    const user = Store.getUser();
    Store.setUser({ ...user, name, email });

    // Обновляем шапку
    document.getElementById('profileInitials').textContent = getInitials(name);
    document.getElementById('profileName').textContent = name;
    document.getElementById('profileEmail').textContent = email || '—';

    Store.showToast('Данные сохранены');
}

function getSavedProfile() {
    try {
        const raw = localStorage.getItem('sportiki_profile');
        return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
}

function showFieldError(inputId, errorId, message) {
    document.getElementById(inputId)?.classList.add('invalid');
    const err = document.getElementById(errorId);
    if (err) err.textContent = message;
}

function clearFieldError(inputId, errorId) {
    document.getElementById(inputId)?.classList.remove('invalid');
    const err = document.getElementById(errorId);
    if (err) err.textContent = '';
}

function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function formatDate(dateStr) {
    if (!dateStr) return 'Неизвестно';
    try {
        return new Date(dateStr).toLocaleDateString('ru-RU', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    } catch { return '—'; }
}