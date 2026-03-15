/**
 * auth.js — авторизация и регистрация
 * Использует Store для сохранения пользователя и toast-уведомлений
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. ПЕРЕКЛЮЧАТЕЛЬ ПАРОЛЯ
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const container = this.closest('.password-group');
            if (!container) return;
            const input = container.querySelector('input');
            const openImg = this.querySelector('.eye-open');
            const closedImg = this.querySelector('.eye-closed');
            if (input && openImg && closedImg) {
                const isPassword = input.type === 'password';
                input.type = isPassword ? 'text' : 'password';
                openImg.classList.toggle('hidden', isPassword);
                closedImg.classList.toggle('hidden', !isPassword);
            }
        });
    });

    // 2. РЕГИСТРАЦИЯ
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            if (!name) { Store.showToast('Введите имя', 'error'); return; }
            if (!email) { Store.showToast('Введите email или телефон', 'error'); return; }
            if (password.length < 6) { Store.showToast('Пароль — минимум 6 символов', 'error'); return; }

            Store.setUser({ name, email, registeredAt: new Date().toISOString() });

            // Сохраняем в профиль — телефон если ввели номер вместо email
            const isPhone = !email.includes('@');
            const existingProfile = JSON.parse(localStorage.getItem('sportiki_profile') || '{}');
            localStorage.setItem('sportiki_profile', JSON.stringify({
                ...existingProfile,
                name,
                email: isPhone ? '' : email,
                phone: isPhone ? email : (existingProfile.phone || '')
            }));

            Store.showToast(`Добро пожаловать, ${name}!`);
            setTimeout(() => window.location.href = 'index.html', 1200);
        });
    }

    // 3. ВХОД
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const emailPhone = document.getElementById('emailPhone').value.trim();
            const password = document.getElementById('password').value;

            if (!emailPhone || !password) {
                Store.showToast('Заполните все поля', 'error');
                return;
            }
            if (password.length < 6) {
                Store.showToast('Пароль слишком короткий', 'error');
                return;
            }

            const name = emailPhone.includes('@')
                ? emailPhone.split('@')[0]
                : emailPhone;

            Store.setUser({ name, email: emailPhone, loginAt: new Date().toISOString() });

            // Обновляем имя в профиле, телефон/email не перезаписываем если уже есть
            const existingProfile = JSON.parse(localStorage.getItem('sportiki_profile') || '{}');
            const isPhone = !emailPhone.includes('@');
            localStorage.setItem('sportiki_profile', JSON.stringify({
                ...existingProfile,
                name,
                email: existingProfile.email || (isPhone ? '' : emailPhone),
                phone: existingProfile.phone || (isPhone ? emailPhone : '')
            }));

            Store.showToast(`С возвращением, ${name}!`);
            setTimeout(() => window.location.href = 'index.html', 1200);
        });
    }

    // 4. ЗАБЫЛИ ПАРОЛЬ
    document.querySelector('.forgot-password')?.addEventListener('click', (e) => {
        e.preventDefault();
        Store.showToast('Функция восстановления пароля в разработке', 'error');
    });

    // 5. UX: плавающий лейбл при автозаполнении браузером
    document.querySelectorAll('.form-group input').forEach(input => {
        const check = () => input.classList.toggle('has-value', input.value !== '');
        check();
        input.addEventListener('blur', check);
        input.addEventListener('input', check);
    });
});